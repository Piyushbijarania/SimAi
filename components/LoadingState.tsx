export function LoadingState() {
  return (
    <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-4 p-8">
      <div className="relative h-14 w-14">
        <div
          className="absolute inset-0 rounded-full border-2 border-[var(--border)] border-t-[var(--accent)] animate-spin"
          style={{ animationDuration: "0.9s" }}
        />
      </div>
      <p className="text-sm text-[var(--text-muted)]">Building simulation…</p>
    </div>
  );
}
