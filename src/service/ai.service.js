import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateResponse(prompt) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating AI response:", error);
        throw error;
    }
}

// Keep genrateResponse alias for backward compatibility
const genrateResponse = generateResponse;

export { generateResponse, genrateResponse };