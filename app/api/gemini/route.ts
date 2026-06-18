import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API KEY MISSING" }, { status: 500 });
    }

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
      
      Return ONLY a raw JSON object in this exact format. Do not use markdown blocks or formatting wrappers:
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

    // Direct fetch to openrouter endpoint to bypass Google's rate-limiting layer
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens: 4000, // Forces OpenRouter to accept the free tier allocation
        response_format: { type: "json_object" }
      })
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Proxy Gateway Error: ${response.status} - ${errText}`);
    }

    const jsonRes = await response.json();
    let cleanText = jsonRes.choices[0].message.content.trim();
    
    // Clean out any accidental markdown tags if present
    cleanText = cleanText.replace(/```json/gi, '').replace(/```/g, '').trim();

    return NextResponse.json(JSON.parse(cleanText));

  } catch (error: unknown) {
    console.error("ENGINE CRASH:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to process target workflow.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}