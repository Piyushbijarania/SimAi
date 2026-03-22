"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { JWTPayload } from "@/lib/auth";

export function UserMenu({ user }: { user: JWTPayload }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface)] transition-colors hover:bg-[var(--surface-hover)] active:scale-[0.98]"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
      >
        {user.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatar}
            alt=""
            width={32}
            height={32}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="text-xs font-medium text-[var(--text-muted)]">
            {user.name.slice(0, 1).toUpperCase()}
          </span>
        )}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-[60] mt-2 min-w-[220px] rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] py-1 shadow-none"
        >
          <div className="border-b border-[var(--border)] px-3 py-2">
            <p className="truncate text-sm font-medium text-[var(--text-primary)]">
              {user.name}
            </p>
            <p className="truncate text-xs text-[var(--text-muted)]">
              {user.email}
            </p>
          </div>
          <Link
            href="/gallery"
            role="menuitem"
            className="block px-3 py-2 text-sm text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)]"
            onClick={() => setOpen(false)}
          >
            Your Gallery
          </Link>
          <a
            href="/auth/logout"
            role="menuitem"
            className="block px-3 py-2 text-sm text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)]"
          >
            Sign out
          </a>
        </div>
      )}
    </div>
  );
}
