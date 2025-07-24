
import { GoogleGenAI, Type } from "@google/genai";

// Ensure the API_KEY is available in the environment variables
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this prototype, we'll log an error.
  console.error("Gemini API key not found in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const suggestAppNames = async (description: string): Promise<string[]> => {
  if (!API_KEY) {
    // Return mock data if API key is not set
    return new Promise(resolve => setTimeout(() => resolve(['CodeGenius', 'DeployMate', 'Stackify', 'LaunchPad', 'AppHarbor']), 500));
  }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 5 unique and creative names for a software application based on this description: "${description}". The names should be single words or short two-word phrases. Avoid generic terms.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            names: {
              type: Type.ARRAY,
              description: "A list of 5 suggested application names.",
              items: {
                type: Type.STRING
              }
            }
          },
          required: ["names"]
        },
      }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result.names || [];

  } catch (error) {
    console.error("Error suggesting app names:", error);
    // Return an empty array or throw the error, depending on desired UX
    return [];
  }
};
