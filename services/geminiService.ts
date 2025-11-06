// services/geminiService.ts
import { GoogleGenAI, GenerateContentRequest, Type, Part, Modality } from '@google/genai';
import type { SocialPost } from '../types';

// Initialize the Google Gemini AI client
// This instance will be used for all Gemini API calls.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Gemini API Functions ---

/**
 * Generates a stream of text for a chat conversation.
 */
// FIX: Refactored to use the modern `generateContentStream` API and corrected property access on chunks.
export async function* getChatStream(
    history: GenerateContentRequest['contents'],
    message: string,
    systemInstruction: string
): AsyncGenerator<string> {
    const response = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: [...history, { role: 'user', parts: [{ text: message }] }],
        config: {
            systemInstruction,
        },
    });

    for await (const chunk of response) {
        if (chunk.text) {
            yield chunk.text;
        }
    }
}

/**
 * Generates follow-up suggestions for a chat conversation.
 */
export const generateFollowUpSuggestions = async (
    history: GenerateContentRequest['contents'],
    systemInstruction: string
): Promise<string[]> => {
    const prompt = 'Com base no histórico da conversa, sugira 3 perguntas ou tópicos curtos e relevantes para o usuário continuar a conversa. Responda APENAS com um objeto JSON contendo um array de strings chamado "sugestoes".';
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
        config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    sugestoes: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                    },
                },
                required: ['sugestoes'],
            },
        },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result.sugestoes || [];
};

/**
 * Generates the content for a legal document as a stream.
 */
export async function* generateDocument(
    prompt: string,
    systemInstruction: string,
    responseSchema: any // eslint-disable-line @typescript-eslint/no-explicit-any
): AsyncGenerator<string> {
    const response = await ai.models.generateContentStream({
        model: 'gemini-2.5-pro',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema,
        }
    });

    for await (const chunk of response) {
        yield chunk.text;
    }
}

/**
 * Generates a social media post based on a theme, platform, and tone.
 */
export const generateSocialMediaPost = async (theme: string, platform: string, tone: string): Promise<Partial<SocialPost>> => {
    const prompt = `Crie um post para a plataforma "${platform}" com o tema "${theme}" e um tom de voz "${tone}". O post deve ser relevante para o público jurídico brasileiro. Se for um carrossel, crie de 3 a 5 slides. Se for TikTok, crie um roteiro curto. Se for artigo de blog, crie um corpo de artigo com pelo menos 3 parágrafos. Inclua um título, sugestões visuais e 3 a 5 hashtags.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    script: { type: Type.STRING },
                    slides: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                body: { type: Type.STRING },
                                imageSuggestion: { type: Type.STRING },
                            },
                        },
                    },
                    articleBody: { type: Type.STRING },
                    visualSuggestions: { type: Type.STRING },
                    hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
            },
        },
    });
    
    return JSON.parse(response.text.trim());
};

/**
 * Generates a content calendar for social media.
 */
export const generateContentCalendar = async (area: string, duration: string): Promise<{ calendario: any[] }> => {
    const prompt = `Crie um calendário de conteúdo para redes sociais para um advogado especialista em ${area}, com duração de ${duration} dias. Para cada dia, sugira um tema, um formato (ex: Post, Carrossel, Vídeo Curto) e um Call to Action (CTA).`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    calendario: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                dia: { type: Type.NUMBER },
                                tema: { type: Type.STRING },
                                formato: { type: Type.STRING },
                                cta: { type: Type.STRING },
                            },
                        },
                    },
                },
            },
        },
    });
    return JSON.parse(response.text.trim());
};


/**
 * Generates a video from a social media post script.
 */
export const generateVideoFromPost = async (post: SocialPost, doubt: string, onProgress: (status: string) => void): Promise<string> => {
    const aiWithKey = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Crie um vídeo curto para o TikTok. Comece com a pergunta: "${doubt}". Em seguida, use o seguinte roteiro: "${post.script}". O vídeo deve ser dinâmico e visualmente atraente para o tema.`;

    onProgress('Enviando requisição para geração de vídeo...');
    let operation = await aiWithKey.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt,
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: '9:16',
        },
    });

    onProgress('Aguardando processamento do vídeo... Isso pode levar alguns minutos.');
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        onProgress('Verificando status da operação...');
        operation = await aiWithKey.operations.getVideosOperation({ operation });
        if (operation.error) {
             throw new Error(operation.error.message || 'Erro desconhecido na geração do vídeo.');
        }
    }
    
    onProgress('Processamento concluído. Baixando o vídeo...');
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error('Não foi possível obter o link de download do vídeo.');
    }
    
    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) {
        const errorText = await videoResponse.text();
        if (errorText.includes('Requested entity was not found')) {
            throw new Error('API_KEY_INVALID');
        }
        throw new Error('Falha ao baixar o vídeo gerado.');
    }
    
    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
};

/**
 * Generates a promotional image for WhatsApp.
 */
export const generateWhatsAppImage = async (toolName: string, toolDescription: string): Promise<string> => {
    const prompt = `Crie uma imagem de marketing profissional e moderna no formato vertical (para status de WhatsApp) para divulgar a ferramenta "${toolName}" da plataforma "AdvocaciaAI". A descrição da ferramenta é: "${toolDescription}". A imagem deve ser limpa, usar uma paleta de cores com tons de azul, índigo e branco, e conter o logo "AdvocaciaAI" de forma sutil. O texto principal deve ser o nome da ferramenta.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part?.inlineData?.data) {
        return part.inlineData.data;
    }
    throw new Error('Não foi possível gerar a imagem.');
};

/**
 * Analyzes video frames for safety events.
 */
export const analyzeVideoFramesForSafety = async (frames: Part[]): Promise<{ events: any[] }> => {
    const prompt = 'Analise esta sequência de frames de uma dashcam. Identifique placas de veículos (formato Mercosul ou antigo), infrações de trânsito claras (ex: avanço de sinal vermelho, conversão proibida) e outros eventos de segurança (ex: pedestre em risco, colisão iminente). Para cada evento, forneça um tipo ("plate", "infraction", "info") e uma breve descrição.';

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: [{ parts: [{ text: prompt }, ...frames] }],
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    events: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                type: { type: Type.STRING },
                                description: { type: Type.STRING },
                            },
                        },
                    },
                },
            },
        },
    });
    return JSON.parse(response.text.trim());
};

/**
 * Analyzes the content of a document based on a specified action.
 */
export const analyzeDocumentContent = async (
    action: 'extract' | 'summarize' | 'key-points' | 'identify-parts' | 'translate',
    content: string,
    targetLanguage?: 'en' | 'es'
): Promise<any> => {
    let prompt = '';
    let responseSchema: any = {};

    switch (action) {
        case 'extract':
            prompt = 'Extraia o texto completo do documento a seguir, mantendo a formatação básica como parágrafos.';
            responseSchema = {
                type: Type.OBJECT,
                properties: {
                    extractedText: { type: Type.STRING, description: 'O texto completo extraído do documento.' },
                },
                 required: ["extractedText"],
            };
            break;
        case 'summarize':
            prompt = 'Leia o documento a seguir e crie um resumo conciso, capturando as ideias e conclusões principais.';
            responseSchema = {
                type: Type.OBJECT,
                properties: {
                    summary: { type: Type.STRING, description: 'Um resumo conciso do documento.' },
                },
                 required: ["summary"],
            };
            break;
        case 'key-points':
            prompt = 'Analise o documento a seguir e extraia os pontos-chave ou argumentos principais em formato de lista (bullet points).';
            responseSchema = {
                type: Type.OBJECT,
                properties: {
                    keyPoints: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: 'Uma lista dos pontos-chave do documento.',
                    },
                },
                 required: ["keyPoints"],
            };
            break;
        case 'identify-parts':
            prompt = 'Analise o documento a seguir e identifique todas as partes (pessoas físicas ou jurídicas), datas e valores monetários mencionados. Agrupe os resultados.';
            responseSchema = {
                type: Type.OBJECT,
                properties: {
                    parties: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Nomes de pessoas ou empresas mencionadas.' },
                    dates: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Datas mencionadas no texto.' },
                    values: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Valores monetários mencionados.' },
                },
            };
            break;
        case 'translate':
            const lang = targetLanguage === 'en' ? 'Inglês' : 'Espanhol';
            prompt = `Traduza o seguinte documento para o ${lang}.`;
            responseSchema = {
                type: Type.OBJECT,
                properties: {
                    translatedText: { type: Type.STRING, description: `O texto traduzido para ${lang}.` },
                },
                required: ["translatedText"],
            };
            break;
        default:
            throw new Error('Ação de análise desconhecida.');
    }

    const fullPrompt = `${prompt}\n\nDOCUMENTO:\n"""\n${content}\n"""`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema,
        },
    });

    return JSON.parse(response.text.trim());
};

/**
 * Analyzes vehicle data from RegCheck to provide legal insights.
 */
export const analisarDadosVeiculo = async (vehicleData: any, placa: string): Promise<{ pontosDeAtencao: string[]; sugestoesJuridicas: string[] }> => {
    const prompt = `Com base nos seguintes dados de um veículo de placa ${placa}: ${JSON.stringify(vehicleData)}, forneça uma breve análise jurídica para um advogado. Identifique 2 a 3 pontos de atenção principais (ex: "Veículo muito antigo pode indicar problemas", "Modelo com histórico de recall", "Situação 'roubado/furtado' exige ação imediata"). Depois, liste 2 a 3 sugestões de próximos passos ou verificações (ex: "Verificar débitos no Detran", "Consultar processos judiciais envolvendo a placa", "Recomendar perícia cautelar").`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    pontosDeAtencao: { type: Type.ARRAY, items: { type: Type.STRING } },
                    sugestoesJuridicas: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
            },
        },
    });
    return JSON.parse(response.text.trim());
};


// --- External API Functions (via Vercel Serverless) ---

/**
 * Consults a vehicle plate using the backend proxy.
 */
export const consultarPlacaVeiculo = async (placa: string): Promise<any[]> => {
    const response = await fetch(`/api/reg-check?placa=${placa}`);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Falha na consulta. Verifique a placa e tente novamente.' }));
        throw new Error(errorData.message);
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");
    const jsonNode = xmlDoc.getElementsByTagName('vehicleJson')[0];
    
    if (!jsonNode || !jsonNode.textContent) {
        throw new Error('Resposta da consulta de placa em formato inesperado.');
    }
    
    const jsonData = JSON.parse(jsonNode.textContent);
    return [jsonData]; // Wrap in array to match expected type
};

/**
 * Consults a CEP using the backend proxy.
 */
export const consultarCep = async (cep: string): Promise<any> => {
    const cleanCep = cep.replace(/\D/g, '');
    const response = await fetch(`/api/consulta-cep?cep=${cleanCep}`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erro ao consultar CEP.');
    }
    return data;
};

/**
 * Consults a CNPJ using the backend proxy.
 */
export const consultarCnpj = async (cnpj: string): Promise<any> => {
    const cleanCnpj = cnpj.replace(/\D/g, '');
    const response = await fetch(`/api/consulta-cnpj?cnpj=${cleanCnpj}`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erro ao consultar CNPJ.');
    }
    return data;
};