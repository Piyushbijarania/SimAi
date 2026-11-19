import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const err = searchParams.error;
  const devPassword = process.env.DEV_ADMIN_PASSWORD;
  const devLoginReady =
    typeof devPassword === "string" && devPassword.length >= 8;

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-16">
      <div className="mb-10 text-center">
        <div className="mb-3 flex justify-center">
          <Logo className="text-xl" />
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          Describe it. See it. Understand it.
        </p>
      </div>

      <div
        className="w-full max-w-[400px] rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--surface)] p-10"
        style={{ padding: "2.5rem" }}
      >
        <h1 className="mb-1 text-center text-xl font-semibold text-[var(--text-primary)]">
          Sign in to SimAI
        </h1>
        <p className="mb-8 text-center text-sm text-[var(--text-muted)]">
          Build and save interactive simulations powered by AI
        </p>

        {err === "auth_failed" && (
          <div
            className="mb-6 rounded-[var(--radius-md)] border border-[var(--danger)]/40 bg-[var(--danger)]/10 px-3 py-2 text-center text-sm text-[var(--danger)]"
            role="alert"
          >
            Authentication failed. Please try again.
          </div>
        )}
        {(err === "missing_params" || err === "unknown_provider") && (
          <div
            className="mb-6 rounded-[var(--radius-md)] border border-[var(--danger)]/40 bg-[var(--danger)]/10 px-3 py-2 text-center text-sm text-[var(--danger)]"
            role="alert"
          >
            Something went wrong. Please try again.
          </div>
        )}
        {err === "dev_bad_password" && (
          <div
            className="mb-6 rounded-[var(--radius-md)] border border-[var(--danger)]/40 bg-[var(--danger)]/10 px-3 py-2 text-center text-sm text-[var(--danger)]"
            role="alert"
          >
            Wrong admin password.
          </div>
        )}
        {err === "dev_disabled" && (
          <div
            className="mb-6 rounded-[var(--radius-md)] border border-[var(--danger)]/40 bg-[var(--danger)]/10 px-3 py-2 text-center text-sm text-[var(--danger)]"
            role="alert"
          >
            Dev admin login is not configured. Set{" "}
            <code className="text-xs">DEV_ADMIN_PASSWORD</code> (8+ characters)
            in <code className="text-xs">.env.local</code> and restart the dev
            server.
          </div>
        )}
        {err === "dev_db" && (
          <div
            className="mb-6 rounded-[var(--radius-md)] border border-[var(--danger)]/40 bg-[var(--danger)]/10 px-3 py-2 text-center text-sm text-[var(--danger)]"
            role="alert"
          >
            Could not reach the database. Check{" "}
            <code className="text-xs">DATABASE_URL</code> and run{" "}
            <code className="text-xs">npm run db:push</code>.
          </div>
        )}

        {devLoginReady ? (
          <div className="mb-8 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] p-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
              Local testing
            </p>
            <p className="mb-4 text-xs text-[var(--text-hint)]">
              Sign in without OAuth. Do not use in production; remove{" "}
              <code className="text-[10px]">DEV_ADMIN_PASSWORD</code> when you
              deploy.
            </p>
            <form action="/auth/dev-login" method="post" className="flex flex-col gap-3">
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="Admin password"
                className="h-11 w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-hint)] focus:border-[var(--accent)] focus:outline-none"
              />
              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center rounded-lg bg-[var(--accent)] text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] active:scale-[0.98]"
              >
                Admin login (dev)
              </button>
            </form>
          </div>
        ) : (
          <p className="mb-8 rounded-[var(--radius-md)] border border-dashed border-[var(--border)] bg-[var(--bg)] px-3 py-3 text-center text-xs text-[var(--text-hint)]">
            To test without OAuth, add{" "}
            <code className="text-[10px] text-[var(--text-muted)]">
              DEV_ADMIN_PASSWORD
            </code>{" "}
            (at least 8 characters) to{" "}
            <code className="text-[10px] text-[var(--text-muted)]">
              .env.local
            </code>{" "}
            and restart <code className="text-[10px]">npm run dev</code>.
          </p>
        )}

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--border)]" />
          <span className="shrink-0 text-xs text-[var(--text-hint)]">
            OAuth (configure later)
          </span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <div className="flex flex-col gap-3">
          <a
            href="/auth/login/github"
            className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-[var(--border-strong)] bg-white text-sm font-medium text-[#1a1a2e] transition-colors hover:bg-gray-50 active:scale-[0.98]"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-[#181717]"
              aria-hidden
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Continue with GitHub
          </a>
        </div>

        <p className="mt-8 text-center text-xs text-[var(--text-hint)]">
          By signing in you agree to our{" "}
          <Link href="#" className="text-[var(--accent)] hover:underline">
            Terms of Service
          </Link>
        </p>
      </div>
    </div>
  );
}
