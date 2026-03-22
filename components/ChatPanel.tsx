"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/lib/types";

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ChatPanel({ messages }: { messages: ChatMessage[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
      <div className="flex flex-col gap-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.role === "user" ? "flex justify-end" : "flex justify-start"
            }
          >
            <div
              className={
                m.role === "user"
                  ? "max-w-[92%] rounded-[var(--radius-md)] bg-[var(--accent-dim)] px-3 py-2 text-sm text-[var(--text-primary)] md:max-w-[85%]"
                  : "max-w-[92%] rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] md:max-w-[85%]"
              }
            >
              {m.role === "user" ? (
                <p className="whitespace-pre-wrap">{m.content}</p>
              ) : (
                <AssistantBody message={m} />
              )}
              <p className="mt-1.5 text-[10px] text-[var(--text-hint)]">
                {formatTime(m.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function AssistantBody({ message }: { message: ChatMessage }) {
  if (message.status === "generating") {
    return (
      <div className="flex items-center gap-2 text-[var(--text-muted)]">
        <span className="text-sm">Generating</span>
        <span className="flex gap-1" aria-hidden>
          <span className="simai-dot inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span className="simai-dot inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span className="simai-dot inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
        </span>
      </div>
    );
  }
  if (message.status === "ready") {
    return (
      <div className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
        <span
          className="inline-block h-2 w-2 rounded-full bg-[var(--success)]"
          aria-hidden
        />
        Simulation ready
      </div>
    );
  }
  if (message.status === "cancelled") {
    return (
      <p className="text-sm text-[var(--text-muted)]">Generation cancelled.</p>
    );
  }
  if (message.status === "error") {
    return (
      <p className="text-sm text-[var(--danger)]">
        {message.errorText ?? "Something went wrong."}
      </p>
    );
  }
  return <p className="whitespace-pre-wrap">{message.content}</p>;
}
