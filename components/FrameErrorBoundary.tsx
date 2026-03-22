"use client";

import React, { type ReactNode } from "react";

type FrameErrorBoundaryProps = {
  children: ReactNode;
};

type FrameErrorBoundaryState = { hasError: boolean };

export class FrameErrorBoundary extends React.Component<
  FrameErrorBoundaryProps,
  FrameErrorBoundaryState
> {
  constructor(props: FrameErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): FrameErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Simulation frame error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2 p-8 text-center">
          <p className="text-sm font-medium text-[var(--danger)]">
            The simulation preview crashed.
          </p>
          <p className="max-w-sm text-xs text-[var(--text-muted)]">
            Try generating again or adjust your prompt. If this keeps happening,
            the model output may contain unsupported code for the sandbox.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
