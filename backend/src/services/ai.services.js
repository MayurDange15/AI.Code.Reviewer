import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../prompts/codeReviewer.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main(prompt) {
  const PRIMARY_MODEL = "gemini-3.5-flash";
  const SECONDARY_MODEL = "gemini-3.1-flash-lite";
  const FALLBACK_MODEL = "gemini-2.5-pro";

  const baseConfig = {
    systemInstruction: SYSTEM_INSTRUCTION,
  };

  try {
    console.log(`[AI Service] Attempting review with: ${PRIMARY_MODEL}`);
    return await ai.models.generateContentStream({
      model: PRIMARY_MODEL,
      contents: prompt,
      config: baseConfig,
    });
  } catch (error) {
    console.warn(`[AI Service] ${PRIMARY_MODEL} failed:`, error.message);
    console.log(`[AI Service] Falling back to: ${SECONDARY_MODEL}...`);

    try {
      return await ai.models.generateContentStream({
        model: SECONDARY_MODEL,
        contents: prompt,
        config: baseConfig,
      });
    } catch (error) {
      console.warn(`[AI Service] ${SECONDARY_MODEL} failed:`, error.message);
      console.log(`[AI Service] Falling back to: ${FALLBACK_MODEL}...`);

      try {
        return await ai.models.generateContentStream({
          model: FALLBACK_MODEL,
          contents: prompt,
          config: baseConfig,
        });
      } catch (fallbackError) {
        console.error(
          "[AI Service] CRITICAL: Both AI models failed.",
          fallbackError,
        );
        throw new Error("AI Service is temporarily unavailable.");
      }
    }
  }
}

export default main;
