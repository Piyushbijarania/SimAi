"use client";

import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { FrameErrorBoundary } from "@/components/FrameErrorBoundary";

interface SimFrameProps {
  html: string | null;
  isLoading: boolean;
}

export function SimFrame({ html, isLoading }: SimFrameProps) {
  if (isLoading) return <LoadingState />;
  if (!html) return <EmptyState />;

  return (
    <FrameErrorBoundary key={html.slice(0, 120)}>
      <iframe
        key={html}
        srcDoc={html}
        sandbox="allow-scripts"
        referrerPolicy="no-referrer"
        className="h-full w-full min-h-0 flex-1 border-0 bg-white"
        title="simulation"
      />
    </FrameErrorBoundary>
  );
}
