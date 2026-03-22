export default function GalleryLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-8 w-48 animate-pulse rounded-md bg-[var(--surface)]" />
        <div className="h-10 w-36 animate-pulse rounded-lg bg-[var(--surface)]" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5"
          >
            <div className="mb-3 h-4 w-3/4 rounded bg-[var(--bg)]" />
            <div className="mb-2 h-3 w-1/2 rounded bg-[var(--bg)]" />
            <div className="mt-6 flex gap-2">
              <div className="h-8 w-16 rounded-lg bg-[var(--bg)]" />
              <div className="h-8 w-28 rounded-lg bg-[var(--bg)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
