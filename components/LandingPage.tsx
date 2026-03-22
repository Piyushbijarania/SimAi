import Link from "next/link";
import { Logo } from "@/components/Logo";

export function LandingPage() {
  return (
    <div className="min-h-full bg-[var(--bg)] text-[var(--text-primary)]">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
          <Logo href="/" />
          <nav className="flex items-center gap-3 md:gap-4">
            <a
              href="#features"
              className="hidden text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] sm:inline"
            >
              Features
            </a>
            <a
              href="#how"
              className="hidden text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] md:inline"
            >
              How it works
            </a>
            <Link
              href="/login"
              className="text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] active:scale-[0.98]"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="border-b border-[var(--border)] px-4 pb-20 pt-16 md:px-6 md:pb-28 md:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Interactive learning
            </p>
            <h1 className="mb-5 text-4xl font-semibold leading-tight tracking-tight md:text-5xl md:leading-tight">
              Describe it.
              <br />
              <span className="text-[var(--text-muted)]">See it.</span> Understand it.
            </h1>
            <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-[var(--text-muted)]">
              Turn a sentence into a live, interactive simulation in your browser—physics,
              math, algorithms, and more—then save and share with a link.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/login"
                className="w-full rounded-lg bg-[var(--accent)] px-8 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] active:scale-[0.98] sm:w-auto"
              >
                Start building free
              </Link>
              <a
                href="#features"
                className="w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-8 py-3 text-center text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)] active:scale-[0.98] sm:w-auto"
              >
                Explore features
              </a>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="border-b border-[var(--border)] px-4 py-20 md:px-6 md:py-24"
        >
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-3 text-center text-xs font-medium uppercase tracking-[0.15em] text-[var(--text-muted)]">
              Why SimAI
            </h2>
            <p className="mb-14 text-center text-2xl font-semibold tracking-tight md:text-3xl">
              Built for clarity—not slides
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Plain English in",
                  body: "Type what you want to explore. SimAI generates a self-contained HTML simulation with controls, animation, and a short explanation.",
                  icon: (
                    <path
                      d="M12 4v16m8-8H4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  ),
                },
                {
                  title: "Runs safely in-browser",
                  body: "Each simulation loads in a sandboxed preview. No installs, no plugins—just a focused environment to play with the idea.",
                  icon: (
                    <path
                      d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ),
                },
                {
                  title: "Save & share",
                  body: "Keep a personal gallery, open past sims anytime, and share a public link so anyone can view your creation—without signing up.",
                  icon: (
                    <path
                      d="M13.5 10.5L21 3m0 0h-6m6 0v6M8.5 13.5L1 21m0 0h6m-6 0v-6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ),
                },
              ].map((f) => (
                <article
                  key={f.title}
                  className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors hover:border-[var(--border-strong)] md:p-8"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] text-[var(--accent)]">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      {f.icon}
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                    {f.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="px-4 py-20 md:px-6 md:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-3 text-center text-xs font-medium uppercase tracking-[0.15em] text-[var(--text-muted)]">
              How it works
            </h2>
            <p className="mb-14 text-center text-2xl font-semibold tracking-tight md:text-3xl">
              Three steps. One tab.
            </p>
            <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
              {[
                {
                  step: "01",
                  title: "Sign in",
                  text: "Use Google, GitHub, or a dev login—no separate signup flow.",
                },
                {
                  step: "02",
                  title: "Describe your idea",
                  text: "Example: “double pendulum with chaos” or “compound interest with a chart.”",
                },
                {
                  step: "03",
                  title: "Interact & iterate",
                  text: "Tune sliders, reset, refine your prompt, then save or share a link.",
                },
              ].map((item) => (
                <li key={item.step} className="relative text-center md:text-left">
                  <span className="mb-3 block font-mono text-sm text-[var(--accent)]">
                    {item.step}
                  </span>
                  <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                    {item.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-y border-[var(--border)] bg-[var(--surface)] px-4 py-16 md:px-6 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-3 text-2xl font-semibold md:text-3xl">
              Ready to see your idea in motion?
            </h2>
            <p className="mb-8 text-[var(--text-muted)]">
              Open the builder and send your first prompt in seconds.
            </p>
            <Link
              href="/login"
              className="inline-flex rounded-lg bg-[var(--accent)] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] active:scale-[0.98]"
            >
              Go to SimAI
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] px-4 py-10 md:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <Logo href="/" className="opacity-90" />
          <p className="text-center text-xs text-[var(--text-hint)] sm:text-right">
            © {new Date().getFullYear()} SimAI. Built for educators, students, and the
            endlessly curious.
          </p>
        </div>
      </footer>
    </div>
  );
}
