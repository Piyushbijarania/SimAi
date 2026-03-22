"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { nanoid } from "nanoid";
import { Logo } from "@/components/Logo";
import { ChatPanel } from "@/components/ChatPanel";
import { ChatInput } from "@/components/ChatInput";
import { SimFrame } from "@/components/SimFrame";
import { ExampleChips } from "@/components/ExampleChips";
import { ShareModal } from "@/components/ShareModal";
import { Toast } from "@/components/Toast";
import type { ChatMessage } from "@/lib/types";
import { extractHtmlFromStream, truncate } from "@/lib/utils";

type SimWorkspaceProps = {
  initialPrompt?: string | null;
  initialHtml?: string | null;
};

export function SimWorkspace({
  initialPrompt = null,
  initialHtml = null,
}: SimWorkspaceProps) {
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q");

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [html, setHtml] = useState<string | null>(initialHtml);
  const [title, setTitle] = useState(
    initialPrompt ? truncate(initialPrompt, 48) : ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [saveEnabled, setSaveEnabled] = useState(false);
  const [lastPrompt, setLastPrompt] = useState<string | null>(
    initialPrompt ?? null
  );
  const [shareOpen, setShareOpen] = useState(false);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const autoRunRef = useRef(false);

  const runGeneration = useCallback(async (prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed) return;

    setSaveEnabled(false);
    setIsLoading(true);
    setTitle(truncate(trimmed, 48));

    const userMsg: ChatMessage = {
      id: nanoid(),
      role: "user",
      content: trimmed,
      createdAt: Date.now(),
    };
    const assistId = nanoid();
    const assistMsg: ChatMessage = {
      id: assistId,
      role: "assistant",
      content: "",
      createdAt: Date.now(),
      status: "generating",
    };

    setMessages((prev) => [...prev, userMsg, assistMsg]);

    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed }),
        signal: ac.signal,
      });

      if (!res.ok) {
        let errText = "Generation failed. Try again.";
        try {
          const j = await res.json();
          if (j?.error && typeof j.error === "string") errText = j.error;
        } catch {
          /* ignore */
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistId
              ? {
                  ...m,
                  status: "error" as const,
                  errorText: errText,
                }
              : m
          )
        );
        setHtml(null);
        setIsLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const dec = new TextDecoder();
      let full = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        full += dec.decode(value, { stream: true });
      }

      const extracted = extractHtmlFromStream(full);
      const useHtml =
        extracted &&
        (extracted.includes("<html") || extracted.includes("<!DOCTYPE"))
          ? extracted
          : null;

      if (!useHtml || !useHtml.trim()) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistId
              ? {
                  ...m,
                  status: "error" as const,
                  errorText:
                    "Could not generate simulation. Try rephrasing.",
                }
              : m
          )
        );
        setHtml(null);
      } else {
        setHtml(useHtml);
        setLastPrompt(trimmed);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistId
              ? { ...m, status: "ready" as const, content: "" }
              : m
          )
        );
        setSaveEnabled(true);
      }
    } catch (e) {
      if (ac.signal.aborted) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistId
              ? { ...m, status: "cancelled" as const, content: "" }
              : m
          )
        );
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistId
              ? {
                  ...m,
                  status: "error" as const,
                  errorText: "Generation failed. Try again.",
                }
              : m
          )
        );
        setHtml(null);
      }
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (initialHtml && initialPrompt) {
      setHtml(initialHtml);
      setTitle(truncate(initialPrompt, 48));
      setLastPrompt(initialPrompt);
      setSaveEnabled(true);
    }
  }, [initialHtml, initialPrompt]);

  useEffect(() => {
    if (autoRunRef.current) return;
    const q = qParam?.trim();
    if (q) {
      autoRunRef.current = true;
      setInput("");
      void runGeneration(q);
    }
  }, [qParam, runGeneration]);

  const onAbort = () => {
    abortRef.current?.abort();
  };

  const onNew = () => {
    abortRef.current?.abort();
    setMessages([]);
    setInput("");
    setHtml(null);
    setTitle("");
    setIsLoading(false);
    setSaveEnabled(false);
    setLastPrompt(null);
    setShareOpen(false);
    setSavedSlug(null);
  };

  const onSaveShare = async () => {
    if (!html || !lastPrompt) return;
    try {
      const res = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: lastPrompt, html }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error ?? "Save failed");
      }
      const data = await res.json();
      setSavedSlug(data.slug as string);
      setShareOpen(true);
      setToast("Simulation saved!");
    } catch (e) {
      console.error(e);
    }
  };

  const openFullscreen = () => {
    if (!html) return;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), 120_000);
  };

  return (
    <div className="relative flex min-h-[calc(100vh-52px)] flex-col md:h-[calc(100vh-52px)] md:flex-row md:min-h-0">
      <section className="flex min-h-[min(420px,55vh)] w-full flex-col border-b border-[var(--border)] md:min-h-0 md:w-[38%] md:max-w-none md:border-b-0 md:border-r md:border-[var(--border)]">
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-[var(--border)] px-3">
          <Logo />
          <button
            type="button"
            onClick={onNew}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)] active:scale-[0.98]"
          >
            New
          </button>
        </div>
        <ExampleChips
          onPick={(text) => {
            setInput(text);
          }}
        />
        <ChatPanel messages={messages} />
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={() => {
            const p = input;
            setInput("");
            void runGeneration(p);
          }}
          onAbort={onAbort}
          disabled={false}
          generating={isLoading}
        />
      </section>

      <section className="flex min-h-[min(480px,50vh)] flex-1 flex-col md:h-full md:min-h-0 md:w-[62%]">
        <div className="flex h-11 shrink-0 items-center justify-between gap-2 border-b border-[var(--border)] px-3">
          <p className="min-w-0 flex-1 truncate text-xs text-[var(--text-muted)]">
            {title || "No prompt yet"}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              disabled={!saveEnabled}
              onClick={() => void onSaveShare()}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]"
              title={!saveEnabled ? "Generate a simulation first" : undefined}
            >
              Save &amp; Share
            </button>
            <button
              type="button"
              disabled={!html}
              onClick={openFullscreen}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]"
            >
              Fullscreen ↗
            </button>
          </div>
        </div>
        <div className="relative min-h-0 flex-1 bg-[var(--surface)]">
          <SimFrame html={html} isLoading={isLoading} />
        </div>
        <div className="flex h-6 shrink-0 items-center justify-end border-t border-[var(--border)] px-3 text-[10px] text-[var(--text-hint)]">
          Powered by Groq
        </div>
      </section>

      {savedSlug && lastPrompt && (
        <ShareModal
          open={shareOpen}
          slug={savedSlug}
          prompt={lastPrompt}
          onClose={() => setShareOpen(false)}
          onCopied={() => setToast("Link copied!")}
        />
      )}

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
