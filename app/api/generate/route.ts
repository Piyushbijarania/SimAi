import { SYSTEM_PROMPT } from "@/lib/geminiPrompt";
import { getCurrentUser } from "@/lib/auth";
import {
  DEFAULT_GEMINI_MODEL,
  geminiChatCompletion,
  geminiSseBodyToPlainText,
} from "@/lib/geminiStream";
import {
  DEFAULT_GROQ_MODEL,
  groqChatCompletion,
  groqSseBodyToPlainText,
} from "@/lib/groqStream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { prompt?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const prompt = body.prompt?.trim();
  if (!prompt) {
    return Response.json({ error: "Prompt required" }, { status: 400 });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY?.trim();
  const groqApiKey = process.env.GROQ_API_KEY?.trim();

  if (!geminiApiKey && !groqApiKey) {
    return Response.json(
      { error: "Server misconfiguration: missing GEMINI_API_KEY or GROQ_API_KEY" },
      { status: 500 }
    );
  }

  // Preferred provider: Gemini if key is provided
  if (geminiApiKey) {
    const modelId =
      process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;

    let geminiRes: Response;
    try {
      geminiRes = await geminiChatCompletion(
        geminiApiKey,
        modelId,
        SYSTEM_PROMPT,
        prompt
      );
    } catch (e) {
      console.error("Gemini fetch error:", e);
      return Response.json(
        { error: "Could not reach Google Gemini. Check network and GEMINI_API_KEY." },
        { status: 502 }
      );
    }

    if (!geminiRes.ok) {
      let message = geminiRes.statusText || "Gemini request failed";
      try {
        const j = await geminiRes.json();
        const m = j?.error?.message ?? j?.message;
        if (typeof m === "string") message = m;
      } catch {
        /* ignore */
      }

      const clientStatus =
        geminiRes.status === 401 || geminiRes.status === 403
          ? 502
          : geminiRes.status >= 500
            ? 502
            : geminiRes.status;

      return Response.json({ error: message }, { status: clientStatus });
    }

    if (!geminiRes.body) {
      return Response.json(
        { error: "Empty response from Gemini" },
        { status: 502 }
      );
    }

    const plainStream = geminiSseBodyToPlainText(geminiRes.body);

    return new Response(plainStream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // Fallback provider: Groq
  const modelId =
    process.env.GROQ_MODEL?.trim() || DEFAULT_GROQ_MODEL;

  let groqRes: Response;
  try {
    groqRes = await groqChatCompletion(
      groqApiKey!,
      modelId,
      SYSTEM_PROMPT,
      prompt
    );
  } catch (e) {
    console.error("Groq fetch error:", e);
    return Response.json(
      { error: "Could not reach Groq. Check network and GROQ_API_KEY." },
      { status: 502 }
    );
  }

  if (!groqRes.ok) {
    let message = groqRes.statusText || "Groq request failed";
    try {
      const j = await groqRes.json();
      const m = j?.error?.message ?? j?.message;
      if (typeof m === "string") message = m;
    } catch {
      /* ignore */
    }

    if (groqRes.status === 429) {
      return Response.json(
        {
          error:
            `Groq rate limit (model: ${modelId}). Wait and retry, or set GROQ_MODEL to a smaller model in .env.local. ` +
            "See https://console.groq.com/docs/rate-limits",
        },
        { status: 429 }
      );
    }

    const clientStatus =
      groqRes.status === 401 || groqRes.status === 403
        ? 502
        : groqRes.status >= 500
          ? 502
          : groqRes.status;

    return Response.json({ error: message }, { status: clientStatus });
  }

  if (!groqRes.body) {
    return Response.json(
      { error: "Empty response from Groq" },
      { status: 502 }
    );
  }

  const plainStream = groqSseBodyToPlainText(groqRes.body);

  return new Response(plainStream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
