import { GoogleGenAI } from "@google/genai";
import { Message, Role } from "../types";

// We use the same model for both agents, but with different system instructions.
// Researcher uses googleSearch to get real info.
// Reviewer uses pure logic to critique.

const MODEL_NAME = "gemini-2.5-flash"; 

const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateResearcherResponse = async (
  topic: string,
  history: Message[]
): Promise<string> => {
  const client = createClient();
  
  // Filter history to simple format for context
  const context = history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');

  const systemInstruction = `
    You are the RESEARCHER, an autonomous AI agent in a multi-agent system.
    Your goal is to draft a comprehensive, actionable plan for the user's topic: "${topic}".
    
    Directives:
    1. If this is the first turn, create a detailed initial draft plan.
    2. If you have received a critique from the REVIEWER, you must refine your plan based on their feedback.
    3. Use formatting (Markdown headers, bullet points) to make it readable.
    4. Be specific. Avoid vague statements.
    5. If you need current information, you have access to Google Search (grounding).
    
    Do NOT roleplay as the Reviewer. Only output your research/plan.
  `;

  try {
    const response = await client.models.generateContent({
      model: MODEL_NAME,
      contents: `Current Context:\n${context}\n\nTask: Provide the next iteration of the plan or the initial draft.`,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }], // Researcher can search
        temperature: 0.7,
      },
    });

    return response.text || "I was unable to generate a plan.";
  } catch (error) {
    console.error("Researcher Error:", error);
    return "Error generating research content.";
  }
};

export const generateReviewerResponse = async (
  topic: string,
  history: Message[]
): Promise<string> => {
  const client = createClient();
  
  const context = history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');

  const systemInstruction = `
    You are the REVIEWER, an autonomous AI agent.
    Your goal is to critique the RESEARCHER's plan for the topic: "${topic}".
    
    Directives:
    1. Analyze the latest plan provided by the RESEARCHER.
    2. Identify gaps, vague points, safety concerns, or lack of actionable steps.
    3. Provide constructive feedback.
    4. If the plan is excellent and needs no further changes, start your response with "FINAL:".
    5. Be concise and strict but polite.
    
    Do NOT rewrite the plan yourself. Only provide the critique.
  `;

  try {
    const response = await client.models.generateContent({
      model: MODEL_NAME,
      contents: `Current Context:\n${context}\n\nTask: Provide your critique.`,
      config: {
        systemInstruction,
        temperature: 0.5, // Lower temperature for more analytical output
      },
    });

    return response.text || "I have no comments.";
  } catch (error) {
    console.error("Reviewer Error:", error);
    return "Error generating review.";
  }
};