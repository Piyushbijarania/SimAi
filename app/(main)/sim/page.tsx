import { Suspense } from "react";
import { SimWorkspace } from "./SimWorkspace";

function SimFallback() {
  return (
    <div className="flex h-[calc(100vh-52px)] items-center justify-center text-sm text-[var(--text-muted)]">
      Loading…
    </div>
  );
}

export default function SimPage() {
  return (
    <Suspense fallback={<SimFallback />}>
      <SimWorkspace />
    </Suspense>
  );
}
