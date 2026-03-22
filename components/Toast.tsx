"use client";

import { useEffect } from "react";

export function Toast({
  message,
  onDismiss,
}: {
  message: string | null;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, 2800);
    return () => clearTimeout(t);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div
      role="status"
      className="pointer-events-none fixed bottom-6 left-1/2 z-[100] max-w-sm -translate-x-1/2 rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2.5 text-center text-sm text-[var(--text-primary)] shadow-lg md:left-auto md:right-6 md:translate-x-0"
    >
      {message}
    </div>
  );
}
