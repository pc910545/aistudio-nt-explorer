
import { GoogleGenAI } from "@google/genai";
import { UserPreferences } from "../types";

export interface RecommendationCard {
  nameZh: string;
  nameEn: string;
  rating: string;
  category: string;
  highlightZh: string;
  highlightEn: string;
  imageKeyword: string;
  mapUri: string;
}

export const getRecommendations = async (
  preferences: UserPreferences,
  location?: { latitude: number; longitude: number }
): Promise<RecommendationCard[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const quizDetails = preferences.answers.map(a => `${a.questionId}: ${a.value}`).join(', ');
  
  const prompt = `
    Act as a professional visual travel guide for Northern Taiwan (Taipei, New Taipei, Keelung, Taoyuan).
    Recommend exactly 6 high-quality spots (4+ stars). 

    User Persona:
    - Quiz Profile: ${quizDetails}
    - Preferred Transport: ${preferences.transport}
    - Budget Level: ${preferences.price}
    - Typical Stay: ${preferences.duration}
    - Time of Visit: ${preferences.timeOfDay}

    Output requirement:
    Return ONLY a valid JSON array of objects. No markdown formatting.
    Fields:
    - nameZh: Chinese name
    - nameEn: English name
    - rating: e.g. "4.8"
    - category: short category (e.g. "Scenic View")
    - highlightZh: ONE extremely short catchphrase in Chinese.
    - highlightEn: ONE extremely short catchphrase in English.
    - imageKeyword: A highly specific English keyword for finding a representative photo of this place (e.g., "Taipei101", "JiufenOldStreet", "ShilinNightMarket"). Do NOT include spaces if possible, or use simple words.
    - mapUri: The Google Maps URL.

    Use Google Maps grounding to verify all locations and ratings.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: location ? {
          retrievalConfig: { latLng: location }
        } : undefined
      },
    });

    const text = response.text || "";
    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']') + 1;
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonStr = text.substring(jsonStart, jsonEnd);
      return JSON.parse(jsonStr);
    }
    
    console.warn("Raw response from Gemini:", text);
    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
