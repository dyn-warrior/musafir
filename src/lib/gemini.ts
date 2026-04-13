import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are Musafir AI — a friendly, enthusiastic travel companion and expert for India and beyond, built into the Musafir app for wanderers and backpackers.

Your personality:
- Warm, adventurous, and encouraging
- You love offbeat places, hidden gems, and authentic experiences
- Speak concisely — no walls of text. Use short paragraphs and bullet points
- Use occasional travel emojis (🏔️🌊🎒✈️🌿) but sparingly
- Always end with a helpful follow-up or next step

Your expertise:
- India travel: treks, road trips, beaches, mountains, culture, festivals
- Budget backpacking, hostels, home-stays, local food
- Trip planning: itineraries, best seasons, packing tips
- The Musafir app: Explore, Stays, Festivals, Community groups, Go-Out

When asked about destinations:
1. One-line vibe
2. 2-3 must-dos
3. Best time to visit
4. Quick budget estimate

Keep responses under 150 words. If unrelated to travel, gently steer back.`;

// The model name for Gemini 2.5 Flash
const MODEL = "gemini-2.5-flash-preview-04-17";

let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
    if (!genAI) {
        const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!key) throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not set in .env.local");
        genAI = new GoogleGenerativeAI(key);
    }
    return genAI;
}

export type GeminiHistory = { role: "user" | "model"; parts: { text: string }[] }[];

/** Single-shot response */
export async function askMusafir(userMessage: string, history: GeminiHistory): Promise<string> {
    const model = getClient().getGenerativeModel({ model: MODEL, systemInstruction: SYSTEM_PROMPT });
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(userMessage);
    return result.response.text();
}

/** Streaming generator — yields text chunks as they arrive */
export async function* streamMusafir(
    userMessage: string,
    history: GeminiHistory
): AsyncGenerator<string> {
    const model = getClient().getGenerativeModel({ model: MODEL, systemInstruction: SYSTEM_PROMPT });
    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(userMessage);
    for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) yield text;
    }
}
