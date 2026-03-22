"use client";

const EXAMPLES = [
  "Double pendulum chaos simulation",
  "SIR epidemic spread model",
  "Compound interest calculator with animated chart",
];

export function ExampleChips({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 px-3 pb-2">
      {EXAMPLES.map((ex) => (
        <button
          key={ex}
          type="button"
          onClick={() => onPick(ex)}
          className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] active:scale-[0.98]"
        >
          {ex}
        </button>
      ))}
    </div>
  );
}
