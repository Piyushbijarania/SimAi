export const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

export const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

export async function geminiChatCompletion(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string
): Promise<Response> {
  const modelName = model.startsWith("models/") ? model.replace("models/", "") : model;
  const url = `${GEMINI_BASE_URL}/${encodeURIComponent(modelName)}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
      },
    }),
  });
}

/** Turn Gemini SSE chunks into plain UTF-8 text stream. */
export function geminiSseBodyToPlainText(
  sseBody: ReadableStream<Uint8Array>
): ReadableStream<Uint8Array> {
  const reader = sseBody.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            return;
          }

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n");
          buffer = parts.pop() ?? "";

          for (const raw of parts) {
            const line = raw.trim();
            if (!line || line.startsWith(":")) continue;
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6);
            try {
              const json = JSON.parse(payload) as {
                candidates?: Array<{
                  content?: {
                    parts?: Array<{ text?: string }>;
                  };
                }>;
              };
              const textParts = json.candidates?.[0]?.content?.parts;
              if (Array.isArray(textParts)) {
                for (const part of textParts) {
                  if (part?.text) {
                    controller.enqueue(encoder.encode(part.text));
                  }
                }
              }
            } catch {
              /* incomplete line */
            }
          }
        }
      } catch (e) {
        controller.error(e);
      }
    },
    cancel() {
      reader.cancel();
    },
  });
}
