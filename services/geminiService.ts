import { GoogleGenAI, Chat, GenerateContentRequest } from "@google/genai";

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