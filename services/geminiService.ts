
import { GoogleGenAI } from "@google/genai";
import type { Coordinates, GroundingChunk } from '../types';

export const getGroundedResponse = async (
  prompt: string,
  location: Coordinates | null
): Promise<{ text: string; groundingChunks: GroundingChunk[] }> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const config: {
    tools: ({ googleSearch: {} } | { googleMaps: {} })[];
    toolConfig?: { retrievalConfig: { latLng: Coordinates } };
  } = {
    tools: [{ googleSearch: {} }, { googleMaps: {} }],
  };

  if (location) {
    config.toolConfig = {
      retrievalConfig: {
        latLng: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      },
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: config,
    });

    const text = response.text;
    const groundingChunks: GroundingChunk[] =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { text, groundingChunks };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get response from Gemini. Please check your API key and network connection.");
  }
};
