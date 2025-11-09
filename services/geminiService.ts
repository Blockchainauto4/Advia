// services/geminiService.ts
// Fix: Add import for GoogleGenAI and related types.
import { GoogleGenAI, GenerateContentRequest, Part, Type, GenerateContentResponse } from '@google/genai';
// Fix: Import types from the central types file.
import type { SocialPost, SafetyEvent, Lead, SeoData } from '../types';

const getAI = () => {
    // FIX: Add a check for the API key to prevent crashes. The key is expected to be in environment variables.
    if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set.");
        // A user-facing error should be thrown from the calling function.
        // This is a safeguard.
        throw new Error("API_KEY not configured.");
    }
    // Fix: Initialize GoogleGenAI with a named apiKey parameter.
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};


// --- Chat ---

export async function* getChatStream(
    history: GenerateContentRequest['contents'],
    message: string,
    systemInstruction: string,
): AsyncGenerator<string, void, unknown> {
    const ai = getAI();
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction },
        history: history
    });

    const result = await chat.sendMessageStream({ message });

    for await (const chunk of result) {
        yield chunk.text;
    }
}

export const generateFollowUpSuggestions = async (
    history: GenerateContentRequest['contents'],
    systemInstruction: string,
): Promise<string[]> => {
    const ai = getAI();
    const model = 'gemini-2.5-flash';
    const prompt = 'Com base na conversa, sugira 3 perguntas curtas de acompanhamento que o usuário poderia fazer. Responda APENAS com um array JSON de strings, como ["sugestão 1", "sugestão 2", "sugestão 3"].';
    
    const contents: GenerateContentRequest['contents'] = [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
    ];

    try {
        const response = await ai.models.generateContent({
            model,
            contents,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });

        const jsonStr = response.text.trim();
        const suggestions = JSON.parse(jsonStr);
        return Array.isArray(suggestions) ? suggestions.slice(0, 3) : [];

    } catch (error) {
        console.error('Error generating follow-up suggestions:', error);
        return [];
    }
};

// --- Document Generator ---

export async function* generateDocument(
    prompt: string,
    systemInstruction: string,
    responseSchema: any,
): AsyncGenerator<string, void, unknown> {
    const ai = getAI();
    const model = 'gemini-2.5-pro'; // Using a more powerful model for document generation

    const response = await ai.models.generateContentStream({
        model,
        contents: { parts: [{ text: prompt }] },
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema,
        },
    });

    for await (const chunk of response) {
        yield chunk.text;
    }
}

// --- Consultas & Calculators ---

export const consultarPlacaVeiculo = async (placa: string): Promise<any[]> => {
    const response = await fetch(`/api/reg-check?placa=${placa}`);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro na API de consulta.' }));
        throw new Error(errorData.message || `Erro: ${response.status}`);
    }
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");
    const vehicleData = xmlDoc.getElementsByTagName("vehicleJson")[0]?.textContent;
    if (vehicleData) {
        return [JSON.parse(vehicleData)];
    }
    throw new Error('Não foi possível obter os dados do veículo.');
};

export const analisarDadosVeiculo = async (dados: any, placa: string): Promise<{ pontosDeAtencao: string[]; sugestoesJuridicas: string[] }> => {
    const ai = getAI();
    const model = 'gemini-2.5-flash';
    const systemInstruction = "Você é um assistente jurídico especialista em direito de trânsito. Analise os dados de um veículo e forneça um resumo com pontos de atenção e sugestões.";

    const prompt = `Analise os seguintes dados do veículo com placa ${placa}: ${JSON.stringify(dados)}. Identifique 2 a 3 pontos de atenção críticos (ex: ano de fabricação muito antigo, situação de roubo, etc.) e 2 a 3 sugestões jurídicas ou próximos passos (ex: 'Verificar débitos no DETRAN', 'Recomendar perícia cautelar', etc.).`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    pontosDeAtencao: { type: Type.ARRAY, items: { type: Type.STRING } },
                    sugestoesJuridicas: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["pontosDeAtencao", "sugestoesJuridicas"],
            },
        },
    });
    
    return JSON.parse(response.text);
};


export const consultarCep = async (cep: string) => {
    const response = await fetch(`/api/consulta-cep?cep=${cep.replace(/\D/g, '')}`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao consultar CEP.');
    }
    return response.json();
};

export const consultarCnpj = async (cnpj: string) => {
    const response = await fetch(`/api/consulta-cnpj?cnpj=${cnpj.replace(/\D/g, '')}`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao consultar CNPJ.');
    }
    return response.json();
};

export const findEmailPatterns = async (name: string, domain: string): Promise<string[]> => {
    const ai = getAI();
    const model = 'gemini-2.5-flash';
    const systemInstruction = "Atue como um especialista em OSINT (Open Source Intelligence). Seu objetivo é deduzir padrões de e-mail corporativo prováveis com base em nomes e domínios.";
    
    const prompt = `Com base no nome "${name}" e no domínio da empresa "${domain}", gere uma lista dos 5 formatos de e-mail corporativo mais prováveis que essa pessoa poderia ter. Ordene do mais comum para o menos comum. Retorne APENAS um array JSON de strings. Exemplo de entrada: Nome "João Silva", Domínio "empresa.com.br". Exemplo de saída: ["joao.silva@empresa.com.br", "jsilva@empresa.com.br", ...]`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error finding email patterns:", error);
        return [];
    }
};

// --- Marketing ---
export const generateContentCalendar = async (area: string, duracao: string): Promise<{ calendario: any[] }> => {
    const ai = getAI();
    const model = 'gemini-2.5-flash';
    const prompt = `Crie um calendário de conteúdo de marketing jurídico para ${duracao} dias para um advogado especialista em ${area}. Para cada dia, sugira um tema, um formato (ex: Post, Carrossel, Vídeo Curto, Artigo) e uma CTA (Call to Action).`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
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
                            required: ["dia", "tema", "formato", "cta"],
                        },
                    },
                },
            },
        },
    });
    return JSON.parse(response.text);
};

export const generateSocialMediaPost = async (theme: string, platform: string, tone: string): Promise<Partial<SocialPost>> => {
    const ai = getAI();
    const model = 'gemini-2.5-pro';
    const systemInstruction = `Você é um especialista em marketing de conteúdo para advogados. Gere posts informativos e que engajam, respeitando as normas da OAB. O formato da resposta deve ser JSON.`;

    let prompt = `Crie um post para a plataforma "${platform}" com o tema "${theme}" e um tom de voz "${tone}".\n`;
    let responseSchema: any;

    if (platform.includes('Carrossel')) {
        prompt += 'Gere um título e 5 slides, cada um com um título curto, um corpo de texto e uma sugestão de imagem. Inclua também sugestões visuais gerais e 5 hashtags.';
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
                            imageSuggestion: { type: Type.STRING },
                        },
                        required: ["title", "body", "imageSuggestion"],
                    },
                },
                visualSuggestions: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
        };
    } else if (platform.includes('Blog')) {
        prompt += 'Gere um título, um roteiro (script) de pelo menos 4 parágrafos, sugestões visuais e 5 hashtags.';
        responseSchema = {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                articleBody: { type: Type.STRING },
                visualSuggestions: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
        };
    } else { // Feed, TikTok, etc.
        prompt += 'Gere um título, um roteiro/script para o post, sugestões visuais e 5 hashtags.';
        responseSchema = {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                script: { type: Type.STRING },
                visualSuggestions: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
        };
    }

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema,
        },
    });
    return JSON.parse(response.text);
};

export const generateVideoFromPost = async (post: SocialPost, doubt: string, onStatusUpdate: (msg: string) => void): Promise<string> => {
    // Before making API call, create a new GoogleGenAI instance to ensure the latest API key is used.
    const ai = getAI();
    const model = 'veo-3.1-fast-generate-preview';
    const prompt = `Crie um vídeo curto para o TikTok/Reels. O vídeo deve começar respondendo à pergunta "${doubt}". Em seguida, use o seguinte roteiro: "${post.script}". O vídeo deve ser dinâmico, com legendas e visualmente atraente para o tema jurídico.`;
    
    onStatusUpdate("Iniciando a operação de vídeo...");
    let operation;
    try {
        operation = await ai.models.generateVideos({
            model,
            prompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '9:16'
            }
        });
    } catch (e: any) {
         if (e.message?.includes('API key not valid')) {
            throw new Error('API_KEY_INVALID');
         }
         throw e;
    }

    let checks = 0;
    while (!operation.done && checks < 30) { // Timeout after 5 minutes (30 * 10s)
        await new Promise(resolve => setTimeout(resolve, 10000));
        onStatusUpdate(`Verificando status (${checks + 1}/30)...`);
        operation = await ai.operations.getVideosOperation({ operation });
        checks++;
    }

    if (!operation.done) {
        throw new Error("A geração do vídeo demorou muito e foi cancelada.");
    }
    
    if (operation.error) {
        throw new Error(operation.error.message || "Erro desconhecido na geração do vídeo.");
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Não foi possível obter o link de download do vídeo.");
    }

    onStatusUpdate("Buscando o vídeo gerado...");
    // The response.body contains the MP4 bytes. You must append an API key when fetching from the download link.
    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) {
        if(videoResponse.status === 404) {
            throw new Error('Requested entity was not found.');
        }
        throw new Error("Falha ao baixar o vídeo gerado.");
    }

    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
};

export const generateWhatsAppImage = async (toolName: string, toolDescription: string): Promise<string> => {
    const ai = getAI();
    const model = 'gemini-2.5-flash-image';
    const prompt = `Crie uma imagem de divulgação para WhatsApp, em formato de card vertical (9:16). A imagem deve ser profissional, com tema de advocacia (cores sóbrias como azul marinho, dourado, branco), e conter o texto principal: "Nova Ferramenta: ${toolName}", e um subtítulo: "${toolDescription}". Adicione o logo "AdvocaciaAI" de forma discreta.`;

    const response = await ai.models.generateContent({
        model,
        contents: { parts: [{ text: prompt }] },
        config: { responseModalities: ['IMAGE'] },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }
    throw new Error("Nenhuma imagem foi gerada.");
};

export const analyzeSeoData = async (data: SeoData): Promise<string> => {
    const ai = getAI();
    const model = 'gemini-2.5-flash';
    const systemInstruction = `Você é um consultor de SEO especialista no nicho jurídico. Analise os dados fornecidos e gere um resumo com insights e 3 a 5 sugestões práticas e acionáveis para um advogado ou escritório de advocacia melhorar sua presença online. Seja direto e foque em ações que o próprio advogado possa tomar. Use markdown para formatação (títulos com '###', listas com '*').`;

    const prompt = `
    Aqui estão os dados de SEO de um site jurídico:
    - Pontuação de Autoridade: ${data.authorityScore}
    - Tráfego Orgânico Mensal: ${data.organicTraffic}
    - Palavras-chave no Top 10: ${data.topKeywords}
    - Backlinks: ${data.backlinks}
    - Visibilidade em IA: ${data.aiVisibility.visibility}%
    - Principais Palavras-chave: ${data.topOrganicKeywords.map(k => `"${k.keyword}" (Posição ${k.position})`).join(', ')}

    Com base nesses dados, forneça uma análise e sugestões práticas em markdown.
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { systemInstruction },
    });

    return response.text;
};


// --- Safety Camera ---
export const analyzeVideoFramesForSafety = async (frames: Part[]): Promise<{ events: Omit<SafetyEvent, 'timestamp' | 'frameDataUrl'>[] }> => {
    const ai = getAI();
    const model = 'gemini-2.5-pro';
    const systemInstruction = "Você é um especialista em segurança de trânsito. Analise os frames de um vídeo de dashcam e identifique eventos relevantes.";
    const prompt = "Analise esta sequência de frames de um vídeo de dashcam. Identifique e liste eventos importantes. Para cada evento, classifique o tipo ('plate' para placas de veículos, 'infraction' para possíveis infrações, 'info' para outros eventos relevantes) e forneça uma descrição curta. Responda em JSON.";
    
    const contents: GenerateContentRequest['contents'] = [{
        parts: [{ text: prompt }, ...frames]
    }];

    const response = await ai.models.generateContent({
        model,
        contents,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
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
                            required: ["type", "description"]
                        },
                    },
                },
            },
        },
    });
    return JSON.parse(response.text);
};


// --- Conversor ---
export const convertFileContent = async (filePart: Part, outputFormat: 'txt' | 'docx'): Promise<string> => {
    const ai = getAI();
    const model = 'gemini-2.5-pro';
    const prompt = `Extraia todo o texto deste documento. Se o outputFormat for 'docx', mantenha a formatação original tanto quanto possível (negrito, itálico, listas, parágrafos). Se for 'txt', extraia apenas o texto puro.`;
    
    const contents: GenerateContentRequest['contents'] = [{
        parts: [
            { text: prompt },
            { text: `outputFormat: ${outputFormat}` },
            filePart
        ]
    }];

    const response = await ai.models.generateContent({
        model,
        contents,
    });

    return response.text;
};

// --- Contract Consultant ---
export const analyzeServiceRisks = async (description: string): Promise<{ risks: string[], questions: string[], suggestions: string[] }> => {
    const ai = getAI();
    const model = 'gemini-2.5-pro';
    const prompt = `Analise a seguinte descrição de um serviço para um contrato: "${description}". Identifique os principais riscos jurídicos e operacionais, formule perguntas essenciais para esclarecer o escopo e sugira cláusulas contratuais indispensáveis para mitigar os riscos.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    risks: { type: Type.ARRAY, items: { type: Type.STRING } },
                    questions: { type: Type.ARRAY, items: { type: Type.STRING } },
                    suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["risks", "questions", "suggestions"]
            }
        }
    });
    return JSON.parse(response.text);
};

export const generateContractClause = async (description: string, clauseType: string): Promise<{ clauseText: string }> => {
    const ai = getAI();
    const model = 'gemini-2.5-pro';
    const prompt = `Com base na descrição do serviço: "${description}", redija uma cláusula de "${clauseType}" para um contrato de prestação de serviços. A cláusula deve ser clara, objetiva e proteger ambas as partes.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    clauseText: { type: Type.STRING }
                },
                required: ["clauseText"]
            }
        }
    });
    return JSON.parse(response.text);
};

export async function* simulateContractNegotiationStream(contractText: string, persona: string): AsyncGenerator<string, void, unknown> {
    const ai = getAI();
    const model = 'gemini-2.5-pro';
    const prompt = `Aja como um "${persona}". Analise o seguinte contrato e inicie uma negociação. Aponte 2 ou 3 cláusulas que você gostaria de alterar e justifique suas solicitações.\n\nCONTRATO:\n${contractText}`;

    const response = await ai.models.generateContentStream({
        model,
        contents: prompt,
    });

    for await (const chunk of response) {
        yield chunk.text;
    }
}

// --- Lead Prospector ---
export const findLeadsOnGoogleMaps = async (query: string, location: { latitude: number, longitude: number }): Promise<Lead[]> => {
    const ai = getAI();
    const model = 'gemini-2.5-flash';
    
    // Prompt aprimorado para solicitar formato estruturado no texto da resposta
    const prompt = `Encontre empresas que correspondem a "${query}" perto da localização atual.
Liste as empresas encontradas. Para CADA uma, você DEVE fornecer os detalhes no seguinte formato estrito, separados por "---":

---
Nome: [Nome exato da empresa]
Endereço: [Endereço completo]
Telefone: [Número de telefone ou "N/A" se não encontrar]
Website: [URL do website ou "N/A" se não encontrar]
---

Certifique-se de incluir Telefone e Website sempre que estiverem disponíveis nos dados do mapa ou publicamente.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            tools: [{ googleMaps: {} }],
            toolConfig: { retrievalConfig: { latLng: location } },
        },
    });

    // Usa o parser atualizado para extrair os dados estruturados do texto
    return parseLeadsFromText(response.text);
};

function parseLeadsFromText(text: string): Lead[] {
    const leads: Lead[] = [];
    // Separa por '---' e filtra seções vazias
    const sections = text.split('---').map(s => s.trim()).filter(s => s.length > 0);

    sections.forEach((section, index) => {
        // Função auxiliar para extrair valor baseado na chave
        const extract = (key: string) => {
            const match = section.match(new RegExp(`${key}:\\s*(.+)`, 'i'));
            return match ? match[1].trim() : undefined;
        };

        const name = extract('Nome');
        // Validação básica para garantir que é uma seção de lead válida
        if (name && name.length < 150 && !name.startsWith('[')) {
             let phone = extract('Telefone');
             let website = extract('Website');
             const address = extract('Endereço');

             // Limpa valores "N/A" ou similares
             if (phone && (phone.toUpperCase() === 'N/A' || phone.toLowerCase().includes('não'))) phone = undefined;
             if (website && (website.toUpperCase() === 'N/A' || website.toLowerCase().includes('não'))) website = undefined;

             leads.push({
                id: `lead_${Date.now()}_${index}`,
                name: name.replace(/\*\*/g, ''), // Remove negrito do markdown se presente
                address: address?.replace(/\*\*/g, ''),
                phone: phone?.replace(/\*\*/g, ''),
                website: website?.replace(/\*\*/g, ''),
                status: 'Novo',
                createdAt: new Date().toISOString(),
            });
        }
    });

    // Deduplicação básica por nome
    const uniqueLeads = Array.from(new Map(leads.map(lead => [lead.name, lead])).values());
    return uniqueLeads;
}

export const generateLeadProposal = async (lead: Lead, serviceDescription: string): Promise<string> => {
    const ai = getAI();
    const model = 'gemini-2.5-flash';
    const prompt = `Crie uma mensagem curta e persuasiva para o WhatsApp para "${lead.name}", oferecendo o seguinte serviço: "${serviceDescription}". A mensagem deve ser amigável, profissional e terminar com uma pergunta para incentivar a resposta.`;
    
    const response = await ai.models.generateContent({
        model,
        contents: prompt
    });

    return response.text;
};