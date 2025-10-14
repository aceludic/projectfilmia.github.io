import { GoogleGenAI } from "@google/genai";

// Create a single, shared instance of the GoogleGenAI client to be used throughout the app.
// This is a best practice to ensure stable and efficient API communication.
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
