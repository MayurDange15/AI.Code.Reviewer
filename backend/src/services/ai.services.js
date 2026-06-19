import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../prompts/codeReviewer.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main(prompt) {
  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    // let fullText = "";

    // // Iterate through the stream
    // for await (const chunk of response) {
    //   // Print chunks sequentially without forcing a new line
    //   process.stdout.write(chunk.text);

    //   // Accumulate the text
    //   fullText += chunk.text;
    // }

    // // Add a final newline for clean terminal output once the stream is done
    // console.log();

    // // Return the complete string after the stream has fully resolved
    // return fullText;
    return response;
    // for await (const chunk of response) {
    //   process.stdout.write(chunk.text);
    // }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export default main;
