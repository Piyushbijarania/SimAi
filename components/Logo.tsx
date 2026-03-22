import Link from "next/link";

export function Logo({
  className = "",
  href = "/sim",
}: {
  className?: string;
  /** Use "/" on marketing pages; default "/sim" in the app shell */
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 text-[var(--text-primary)] transition-opacity hover:opacity-90 active:scale-[0.98] ${className}`}
    >
      <span className="flex shrink-0" aria-hidden>
        <svg
          width="28"
          height="28"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 16c2.5-6 6.5-10 14-10 5 0 8.5 2 11 5"
            stroke="var(--accent)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M2 22c3-4 7.5-6 14-6 6 0 10 2 14 6"
            stroke="var(--accent)"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>
      </span>
      <span className="text-lg font-semibold tracking-tight">SimAI</span>
    </Link>
  );
}
