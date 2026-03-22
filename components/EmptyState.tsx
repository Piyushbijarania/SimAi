export function EmptyState() {
  return (
    <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--border-strong)] px-6 py-8">
        <p className="text-sm font-medium text-[var(--text-primary)]">
          No simulation yet
        </p>
        <p className="mt-1 max-w-xs text-xs text-[var(--text-muted)]">
          Describe a concept on the left. A live preview will appear here.
        </p>
      </div>
    </div>
  );
}
