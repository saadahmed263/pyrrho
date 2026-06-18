import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API KEY MISSING: Check environment variables");

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // This exact string format is required for the v1beta endpoint structure
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const { context } = await req.json();

    const prompt = `
      You are an elite Behavioral Psychologist and Lead UX Researcher.
      A designer has provided raw context for a field study. You must act as the skeptic, extract the facts, and generate a HIGH-VOLUME, highly tactical interview guide.

      CRITICAL RESEARCH RULES:
      1. USE THE CRITICAL INCIDENT TECHNIQUE: Never ask "how do you usually do X". Ask "Tell me about the last time you did X." Force them to recall specific past events.
      2. BAN HYPOTHETICALS: Do not use words like "would," "typically," "feel," or "usually."
      3. USE OBSERVATIONAL PROBES: Ask the user to physically demonstrate a workflow.
      4. BAN THE WORD "WHY": Use "What led to..." or "Walk me through the steps that caused..."
      5. VOLUME MANDATE: You MUST generate a comprehensive study. Create at least 4 different themes. Every theme MUST have at least 4 to 5 Primary Questions. Do not be lazy. Give me a deep, thorough field guide.

      Context: ${context}
      
      Return ONLY a raw JSON object in this exact format. Do not use markdown blocks:
      {
        "guardrails": {
          "Who": "The specific user role",
          "Where": "The environment/system",
          "Goal": "The actual task",
          "Hack": "Any mentioned workarounds. If none, say 'None'"
        },
        "blind_spot": "Ask one blunt question aimed at the designer, challenging the biggest unverified assumption in their context.",
        "meta": {
          "estimated_time": "e.g., 60-90 mins"
        },
        "modules": [
          {
            "theme": "Theme Name",
            "questions": [
              {
                "primary": "The main behavioral question (past-tense or observational)?",
                "rationale": "The psychological reason for this framing",
                "off_track": ["Redirection prompt to bring them back to facts"],
                "follow_ups": ["Probe to dig deeper into the friction"]
              }
            ]
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    let text = await result.response.text();
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

    return NextResponse.json(JSON.parse(text));
  } catch (error: any) {
    console.error("ENGINE CRASH:", error);
    return NextResponse.json({ error: error.message || "Failed to process." }, { status: 500 });
  }
}