import { AICategorizationResult } from '../types';
// Fix: Refactor to use the @google/genai SDK following best practices.
import { GoogleGenAI, Type, GenerateContentResponse } from '@google/genai';

// Per coding guidelines, initialize GoogleGenAI and use process.env.API_KEY.
// This assumes the build environment is configured to provide this variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const SYSTEM_INSTRUCTION = `You are an organizational assistant. Your task is to analyze the user's input and generate a title, a detailed summary, a category path, and tags.`;

// This schema is designed to get a structured JSON response from the Gemini model.
// It now includes 'title' and 'summary' to create a more structured note.
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A very concise, single-line title for the note, under 100 characters."
    },
    summary: {
      type: Type.STRING,
      description: "A detailed summary of the note's content, up to a few sentences long."
    },
    categories: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of strings representing a hierarchical path. Example: [\"Programming\", \"Web Development\", \"React\"]. Keep it concise."
    },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of up to 5 concise, 1-2 word, context-aware, non-redundant, lowercase organizational tags to help users categorize and filter notes."
    },
    rationale: {
      type: Type.STRING,
      description: "A brief, one-sentence explanation for the chosen category."
    }
  },
  required: ["title", "summary", "categories", "tags", "rationale"]
};

/**
 * Gets AI-powered categorization for a given text content using the Gemini API.
 * The model is prompted to return a title, summary, categories, tags, and a rationale 
 * in a structured JSON format.
 * @param content The text content to analyze.
 * @param userPrompt Optional user instructions to guide categorization.
 * @returns A promise that resolves to an AICategorizationResult or null if it fails.
 */
export const getAICategorization = async (
  content: string,
  userPrompt?: string
): Promise<AICategorizationResult | null> => {
    // Per coding guidelines, the API key must come from process.env.API_KEY.
    // If it's not available, we cannot proceed.
    if (!process.env.API_KEY) {
        console.error("Gemini API key (process.env.API_KEY) is not configured.");
        return null;
    }

    let fullPrompt = ``;
    if (userPrompt) {
      fullPrompt += `USER'S INSTRUCTION: ${userPrompt}\n\n`;
    }
    fullPrompt += `CONTENT TO ORGANIZE:\n---\n${content}`;
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Using gemini-2.5-flash for this text task per guidelines.
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    // Per guidelines, extract text directly from the .text property.
    const jsonString = response.text;
    const parsedResult = JSON.parse(jsonString) as AICategorizationResult;

    // Validation for the new, more structured AI response.
    if (
      typeof parsedResult.title !== 'string' ||
      typeof parsedResult.summary !== 'string' ||
      !Array.isArray(parsedResult.categories) ||
      !Array.isArray(parsedResult.tags) ||
      typeof parsedResult.rationale !== 'string'
    ) {
      throw new Error("Invalid AI response schema.");
    }
    
    return parsedResult;
  } catch (error) {
    console.error("AI categorization failed:", error);
    return null;
  }
};
