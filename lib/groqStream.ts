export const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";

export const DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile";

export async function groqChatCompletion(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string
): Promise<Response> {
  return fetch(GROQ_CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      stream: true,
      temperature: 0.7,
    }),
  });
}

/** Turn Groq/OpenAI SSE chunks into plain UTF-8 text stream. */
export function groqSseBodyToPlainText(
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
            if (line === "data: [DONE]") continue;
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6);
            try {
              const json = JSON.parse(payload) as {
                choices?: Array<{ delta?: { content?: string | null } }>;
              };
              const content = json.choices?.[0]?.delta?.content;
              if (content) {
                controller.enqueue(encoder.encode(content));
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
