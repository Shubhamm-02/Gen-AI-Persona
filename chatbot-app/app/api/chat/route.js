import { GoogleGenerativeAI } from "@google/generative-ai";
import { personas } from "@/lib/prompts";

export async function POST(request) {
  try {
    const { message, persona, history } = await request.json();

    if (!message || !persona) {
      return Response.json(
        { error: "Message and persona are required." },
        { status: 400 }
      );
    }

    const personaData = personas[persona];
    if (!personaData) {
      return Response.json(
        { error: "Invalid persona selected." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "API key is not configured. Please set GOOGLE_API_KEY in your environment variables." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // Build conversation history for the API
    const contents = [];

    // Add conversation history
    if (history && history.length > 0) {
      for (const msg of history) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      }
    }

    // Add current message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const result = await model.generateContent({
      contents,
      systemInstruction: personaData.systemPrompt,
    });

    const response = result.response;
    const text = response.text();

    return Response.json({ reply: text });
  } catch (error) {
    console.error("API Error:", error);

    let errorMessage = "Something went wrong while generating a response. Please try again.";

    if (error.message?.includes("API_KEY")) {
      errorMessage = "Invalid API key. Please check your GOOGLE_API_KEY configuration.";
    } else if (error.message?.includes("SAFETY")) {
      errorMessage = "The response was blocked by safety filters. Please try rephrasing your question.";
    } else if (error.message?.includes("RATE_LIMIT") || error.status === 429) {
      errorMessage = "Rate limit reached. Please wait a moment and try again.";
    } else if (error.message?.includes("PERMISSION_DENIED") || error.status === 403) {
      errorMessage = "API access denied. Please verify your API key has the correct permissions.";
    }

    return Response.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
