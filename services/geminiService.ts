
import { GoogleGenAI, Type } from "@google/genai";

// A `systemInstruction` e o `responseSchema` agora são passados como argumentos
// para tornar a função reutilizável para diferentes tipos de documentos.

export const generateDocumentContent = async (
  prompt: string,
  systemInstruction: string,
  responseSchema: any // eslint-disable-line @typescript-eslint/no-explicit-any
): Promise<{ [key: string]: string; }> => {
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    throw new Error("A variável de ambiente API_KEY não está configurada.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  if (!prompt || !systemInstruction || !responseSchema) {
    throw new Error("Prompt, system instruction, and response schema are required.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);

    return parsedData;
  } catch (error) {
    console.error("Error generating content from Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Falha ao gerar conteúdo: ${error.message}. Verifique o console para mais detalhes.`);
    }
    throw new Error("Ocorreu um erro desconhecido ao se comunicar com a API.");
  }
};
