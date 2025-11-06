import { GoogleGenAI, Chat, GenerateContentRequest, Type, Part, VideosOperationResponse, Content } from "@google/genai";
import type { SocialPost, SafetyEvent } from '../types';

export async function* getChatStream(
  history: GenerateContentRequest['contents'],
  newMessage: string,
  systemInstruction: string
): AsyncGenerator<string> {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        throw new Error("A variável de ambiente API_KEY não está configurada.");
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    // The history is already formatted by the App component
    const chat: Chat = ai.chats.create({
        model: 'gemini-2.5-pro',
        config: {
            systemInstruction,
            temperature: 0.7,
        },
        history,
    });

    try {
      const responseStream = await chat.sendMessageStream({ message: newMessage });

      for await (const chunk of responseStream) {
          yield chunk.text;
      }
    } catch (error) {
        console.error("Error streaming content from Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Falha ao gerar conteúdo: ${error.message}.`);
        }
        throw new Error("Ocorreu um erro desconhecido ao se comunicar com a API.");
    }
}

export async function generateFollowUpSuggestions(
  history: GenerateContentRequest['contents'],
  systemInstruction: string
): Promise<string[]> {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        throw new Error("A variável de ambiente API_KEY não está configurada.");
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const prompt = `
        Baseado no histórico desta conversa, sugira exatamente 3 perguntas curtas e diretas (máximo 8 palavras cada) que o usuário poderia fazer em seguida para aprofundar o tópico ou explorar um novo aspecto relacionado.
        As perguntas devem ser proativas e úteis.
        Retorne a resposta como um array JSON de strings. Não adicione nenhuma formatação extra, apenas o array.
        Exemplo: ["Qual o prazo para contestar?", "Como funciona a citação?", "E se a parte não pagar?"]
    `;

    const contentsWithPrompt: Content[] = [...history, { role: 'user', parts: [{ text: prompt }] }];

    const responseSchema = {
        type: Type.ARRAY,
        items: { type: Type.STRING },
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: contentsWithPrompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema,
                temperature: 0.8,
            },
        });
        
        const jsonText = response.text.trim().replace(/^```json\n|```$/g, '');
        const suggestions = JSON.parse(jsonText);
        
        if (Array.isArray(suggestions) && suggestions.every(s => typeof s === 'string')) {
            return suggestions.slice(0, 3);
        }
        return [];

    } catch (error) {
        console.error("Error generating follow-up suggestions:", error);
        return [];
    }
}

export async function* generateDocument(
    prompt: string,
    systemInstruction: string,
    responseSchema: any // eslint-disable-line @typescript-eslint/no-explicit-any
): AsyncGenerator<string> {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        throw new Error("A variável de ambiente API_KEY não está configurada.");
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema,
                temperature: 0.5,
            },
        });
        
        yield response.text;

    } catch (error) {
        console.error("Error generating document from Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Falha ao gerar documento: ${error.message}.`);
        }
        throw new Error("Ocorreu um erro desconhecido ao se comunicar com a API.");
    }
}

export const consultarPlacaVeiculo = async (placa: string): Promise<any[]> => {
    // A chave de API (username) foi movida para a função serverless para segurança.
    const requestUrl = `/api/reg-check?placa=${encodeURIComponent(placa)}`;

    try {
        const response = await fetch(requestUrl);

        if (!response.ok) {
            // Tenta extrair a mensagem de erro JSON da nossa função serverless
            try {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro na API de consulta: ${response.statusText}`);
            } catch (e) {
                // Fallback se a resposta de erro não for JSON
                throw new Error(`Erro na API de consulta: ${response.statusText}`);
            }
        }

        const xmlString = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "application/xml");
        
        const vehicleJsonNode = xmlDoc.querySelector("vehicleJson");
        if (vehicleJsonNode && vehicleJsonNode.textContent) {
            try {
                const jsonData = JSON.parse(vehicleJsonNode.textContent);
                
                if (jsonData.error) {
                    throw new Error(jsonData.error.message || 'Erro retornado pela API.');
                }

                if (!jsonData.Description) {
                    throw new Error("Placa não encontrada ou dados indisponíveis.");
                }

                // Mapeia para uma estrutura mais limpa para a UI
                const mappedData = {
                    description: jsonData.Description,
                    registrationYear: jsonData.RegistrationYear,
                    manufactureYear: jsonData.ManufactureYear,
                    make: jsonData.CarMake?.CurrentTextValue,
                    model: jsonData.CarModel,
                    bodyStyle: jsonData.BodyStyle?.CurrentTextValue,
                    engineSize: jsonData.EngineSize?.CurrentTextValue,
                    numberOfDoors: jsonData.NumberOfDoors?.CurrentTextValue,
                    numberOfSeats: jsonData.NumberOfSeats?.CurrentTextValue,
                    fuelType: jsonData.FuelType?.CurrentTextValue,
                    indicativeValue: jsonData.IndicativeValue,
                };
                return [mappedData];
            } catch (e) {
                throw new Error(e instanceof Error ? `Falha ao processar resposta: ${e.message}` : "A resposta da API não está no formato esperado.");
            }
        }
        
        throw new Error("Resposta da API inválida ou vazia. O campo 'vehicleJson' não foi encontrado.");

    } catch (error) {
        console.error("Error in vehicle plate consultation:", error);
        if (error instanceof Error) {
            throw new Error(`Falha na consulta: ${error.message}`);
        }
        throw new Error("Ocorreu um erro desconhecido na consulta da placa.");
    }
};

export async function analisarDadosVeiculo(veiculo: any, placa: string): Promise<{ pontosDeAtencao: string[]; sugestoesJuridicas: string[] }> {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        throw new Error("A variável de ambiente API_KEY não está configurada.");
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const prompt = `
        Analise os dados deste veículo e forneça pontos de atenção e sugestões jurídicas.
        Seja conciso e direto. Formato de resposta deve ser JSON.

        Dados do Veículo:
        - Descrição: ${veiculo.description}
        - Marca: ${veiculo.make}
        - Modelo: ${veiculo.model}
        - Ano Fabricação/Modelo: ${veiculo.manufactureYear}/${veiculo.registrationYear}
        - Placa: ${placa}
        - Motor: ${veiculo.engineSize || 'N/A'}
        - Combustível: ${veiculo.fuelType || 'N/A'}
        - Valor Indicativo: ${veiculo.indicativeValue || 'N/A'}
        
        Com base nestes dados, identifique possíveis problemas (ex: veículo muito antigo, modelo com histórico de problemas, valor incompatível) e sugira os próximos passos legais ou verificações que um comprador ou advogado deveria fazer (ex: verificar débitos de IPVA/multas, pesquisar por recalls, verificar sinistros).
    `;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            pontosDeAtencao: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Lista de possíveis problemas ou pontos que requerem atenção.'
            },
            sugestoesJuridicas: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Lista de sugestões de próximos passos ou verificações legais.'
            }
        },
        required: ["pontosDeAtencao", "sugestoesJuridicas"]
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                systemInstruction: 'Você é um assistente jurídico especialista em direito de trânsito. Sua resposta DEVE ser um objeto JSON válido com os campos "pontosDeAtencao" e "sugestoesJuridicas".',
                responseMimeType: "application/json",
                responseSchema,
            },
        });
        
        const jsonText = response.text.trim().replace(/^```json\n|```$/g, '');
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error analyzing vehicle data with Gemini API:", error);
        throw new Error("Falha ao analisar os dados do veículo.");
    }
}

export const consultarCep = async (cep: string): Promise<any> => {
    // Aponta para a nossa função serverless na Vercel
    const requestUrl = `/api/consulta-cep?cep=${encodeURIComponent(cep.replace(/\D/g, ''))}`;

    try {
        const response = await fetch(requestUrl);

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.message || `Erro do servidor: ${response.statusText}`;
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error in CEP consultation:", error);
        if (error instanceof Error) {
            if (error.message.includes('Failed to fetch')) {
                 throw new Error('Falha de comunicação com o servidor. Verifique sua conexão.');
            }
            throw new Error(`Falha na consulta: ${error.message}.`);
        }
        throw new Error("Ocorreu um erro desconhecido na consulta de CEP.");
    }
};

export const consultarCnpj = async (cnpj: string): Promise<any> => {
    // Aponta para a nossa função serverless na Vercel
    const requestUrl = `/api/consulta-cnpj?cnpj=${encodeURIComponent(cnpj.replace(/\D/g, ''))}`;

    try {
        const response = await fetch(requestUrl);

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.message || `Erro do servidor: ${response.statusText}`;
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error in CNPJ consultation:", error);
        if (error instanceof Error) {
            if (error.message.includes('Failed to fetch')) {
                 throw new Error('Falha de comunicação com o servidor. Verifique sua conexão.');
            }
            throw new Error(`Falha na consulta: ${error.message}.`);
        }
        throw new Error("Ocorreu um erro desconhecido na consulta de CNPJ.");
    }
};

export async function generateContentCalendar(areaAtuacao: string, duracao: string): Promise<{ calendario: any[] }> {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) throw new Error("A variável de ambiente API_KEY não está configurada.");
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const prompt = `Crie um calendário de conteúdo para redes sociais (Instagram, TikTok) para um advogado especialista em ${areaAtuacao}. O calendário deve ter a duração de ${duracao} dias. Para cada dia, sugira um tema, um formato (ex: vídeo curto, post carrossel, post único) e uma chamada para ação (CTA).`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            calendario: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        dia: { type: Type.INTEGER },
                        tema: { type: Type.STRING },
                        formato: { type: Type.STRING },
                        cta: { type: Type.STRING }
                    },
                    required: ["dia", "tema", "formato", "cta"]
                }
            }
        },
        required: ["calendario"]
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                systemInstruction: "Você é um especialista em marketing digital para advogados. Sua resposta DEVE ser um objeto JSON válido com a chave 'calendario'.",
                responseMimeType: "application/json",
                responseSchema,
            },
        });
        const jsonText = response.text.trim().replace(/^```json\n|```$/g, '');
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating content calendar with Gemini API:", error);
        throw new Error("Falha ao gerar o calendário de conteúdo.");
    }
}

export async function generateSocialMediaPost(theme: string, platform: string, tone: string): Promise<Partial<SocialPost>> {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) throw new Error("A variável de ambiente API_KEY não está configurada.");
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    let instruction = '';
    let responseSchema: any;

    const basePrompt = `Crie um post para um advogado sobre o tema: "${theme}". O tom deve ser ${tone}. A plataforma é ${platform}.`;

    if (platform.includes('Carrossel')) {
        instruction = "Gere um título para o post, 3 a 5 slides (cada um com título, corpo e uma sugestão de imagem), sugestões visuais gerais e uma lista de hashtags. A resposta DEVE ser um objeto JSON válido.";
        responseSchema = {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                slides: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            body: { type: Type.STRING },
                            imageSuggestion: { type: Type.STRING }
                        },
                        required: ["title", "body", "imageSuggestion"]
                    }
                },
                visualSuggestions: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "slides", "visualSuggestions", "hashtags"]
        };
    } else {
        instruction = "Gere um título para o post, um roteiro/texto para o post, sugestões visuais e uma lista de hashtags. A resposta DEVE ser um objeto JSON válido.";
        responseSchema = {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                script: { type: Type.STRING },
                visualSuggestions: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "script", "visualSuggestions", "hashtags"]
        };
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: basePrompt,
            config: {
                systemInstruction: `Você é um especialista em marketing de conteúdo jurídico. ${instruction}`,
                responseMimeType: "application/json",
                responseSchema,
            },
        });
        const jsonText = response.text.trim().replace(/^```json\n|```$/g, '');
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating social media post with Gemini API:", error);
        throw new Error("Falha ao gerar o post para rede social.");
    }
}

export async function convertFileContent(filePart: Part, outputFormat: 'txt' | 'docx'): Promise<string> {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        throw new Error("A variável de ambiente API_KEY não está configurada.");
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    let prompt = '';
    if (outputFormat === 'txt') {
        prompt = "Extraia e retorne apenas o texto bruto do documento fornecido. Não inclua nenhuma formatação, comentário, preâmbulo ou explicação. Apenas o texto puro.";
    } else { // docx
        prompt = "Extraia o conteúdo do documento PDF fornecido. Reformate-o de forma limpa para ser colado em um documento do Microsoft Word. Preserve a estrutura como títulos, parágrafos e listas. Não adicione nenhum comentário, preâmbulo ou explicação. Apenas forneça o conteúdo de texto formatado.";
    }

    const textPart = { text: prompt };
    const contents: Content[] = [{ parts: [textPart, filePart] }];

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro', // Pro model is good for document understanding
            contents: contents,
            config: {
                temperature: 0.2, // Lower temperature for more deterministic extraction
            },
        });

        return response.text;
    } catch (error) {
        console.error("Error converting file content with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Falha na conversão via IA: ${error.message}.`);
        }
        throw new Error("Ocorreu um erro desconhecido ao se comunicar com a API para conversão.");
    }
}

export async function generateVideoFromPost(post: SocialPost, doubt: string, setVideoStatus: (status: string) => void): Promise<string> {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        throw new Error("API_KEY_NOT_SELECTED");
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const prompt = `Crie um vídeo curto (estilo TikTok) para um advogado. O vídeo deve começar com a pergunta: "${doubt}". Em seguida, use o seguinte roteiro para responder a pergunta: "${post.script}". O tom deve ser ${post.tone}.`;

    try {
        setVideoStatus('Iniciando geração do vídeo...');
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '9:16' // Portrait for TikTok/Reels
            }
        });
        setVideoStatus('Processando... Isso pode levar alguns minutos.');
        
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
            setVideoStatus('Verificando status da geração...');
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }
        
        if (operation.error) {
            if (operation.error.message.includes('permission to access the resource')) {
                 throw new Error("API_KEY_INVALID");
            }
            throw new Error(`Erro na operação: ${operation.error.message}`);
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
            throw new Error('Link para download do vídeo não encontrado na resposta.');
        }

        setVideoStatus('Buscando vídeo gerado...');
        const videoResponse = await fetch(`${downloadLink}&key=${API_KEY}`);
        if (!videoResponse.ok) {
            const errorText = await videoResponse.text();
            if (errorText.includes('Requested entity was not found.')) {
                throw new Error("API_KEY_INVALID");
            }
            throw new Error(`Falha ao baixar o vídeo: ${videoResponse.statusText} - ${errorText}`);
        }

        const videoBlob = await videoResponse.blob();
        const videoUrl = URL.createObjectURL(videoBlob);
        
        return videoUrl;

    } catch (error) {
        console.error("Error generating video with Gemini API:", error);
        if (error instanceof Error && (error.message === 'API_KEY_INVALID' || error.message === 'API_KEY_NOT_SELECTED')) {
            throw error;
        }
        throw new Error("Falha na geração do vídeo. Tente novamente.");
    }
}

export async function analyzeVideoFramesForSafety(frames: Part[]): Promise<{ events: Omit<SafetyEvent, 'timestamp' | 'frameDataUrl'>[] }> {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) throw new Error("A variável de ambiente API_KEY não está configurada.");
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const prompt = `
        Você é um sistema de IA para uma câmera de segurança veicular. Analise a sequência de frames de um vídeo gravado a partir do painel de um carro.
        Sua tarefa é identificar e relatar:
        1.  **Placas de veículos** que estejam claramente visíveis. Formate a resposta como "Placa identificada: [NÚMERO_PLACA]".
        2.  **Possíveis infrações de trânsito** cometidas por outros veículos (ex: avançar sinal vermelho, conversão proibida, não dar preferência). Descreva a infração de forma objetiva.
        3.  Qualquer outra **informação relevante** para segurança (ex: pedestre atravessando fora da faixa, objeto na pista).

        Forneça a resposta como um objeto JSON.
    `;

    const contents: Content[] = [{ parts: [{ text: prompt }, ...frames] }];

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            events: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        type: { type: Type.STRING, enum: ['plate', 'infraction', 'info'] },
                        description: { type: Type.STRING }
                    },
                    required: ["type", "description"]
                }
            }
        },
        required: ["events"]
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image', // Good for image analysis
            contents: contents,
            config: {
                systemInstruction: "Analise frames de vídeo de um carro. A resposta DEVE ser um objeto JSON válido com a chave 'events'.",
                responseMimeType: "application/json",
                responseSchema,
            },
        });
        const jsonText = response.text.trim().replace(/^```json\n|```$/g, '');
        const parsedResult = JSON.parse(jsonText);
        
        if (parsedResult.events && Array.isArray(parsedResult.events)) {
            return { events: parsedResult.events };
        }
        return { events: [] };
    } catch (error) {
        console.error("Error analyzing video frames with Gemini API:", error);
        throw new Error("Falha ao analisar os frames do vídeo.");
    }
}