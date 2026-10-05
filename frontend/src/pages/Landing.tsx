import { Link } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Documents", to: "/documents" },
  { label: "Analysis", to: "/analysis" },
  { label: "Clauses", to: "/documents" },
  { label: "Ask", to: "/ask" },
  { label: "Settings", to: "/settings" },
];

function Logo() {
  return (
    <Link
      to="/"
      aria-label="ClauseLens AI home"
      className="font-display text-[26px] leading-none tracking-tight"
    >
      CL<span className="text-blaze">/</span>AI
    </Link>
  );
}

function Shard({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 800"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-y-0 right-0 h-full ${className}`}
      aria-hidden="true"
    >
      <polygon points="230,0 400,0 600,110 600,800 70,800 0,330" className="fill-volt" />
    </svg>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-paper font-sans text-ink">
      <div className="h-3 bg-ink" />
      <header className="border-b border-rule">
        <div className="mx-auto flex max-w-[1500px] items-center gap-5 px-6 py-5 md:gap-8 md:px-12 xl:px-24">
          <Logo />
          <nav
            aria-label="Main navigation"
            className="hidden flex-1 flex-wrap items-center gap-x-1 gap-y-2 font-mono text-[11px] uppercase tracking-[0.1em] lg:flex xl:text-xs"
          >
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className={`px-3 py-2 transition-colors ${
                  label === "Home" ? "bg-ink text-paper" : "text-ink/75 hover:bg-ink/5"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex shrink-0 items-center gap-1 font-mono text-[11px] uppercase tracking-[0.08em] sm:gap-2 sm:text-xs">
            <Link to="/login" className="px-3 py-2 hover:bg-ink/5 sm:px-4">
              Sign in
            </Link>
            <Link to="/register" className="bg-blaze px-3 py-2 text-paper hover:bg-ink sm:px-4">
              Start <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <Shard className="w-[48%]" />
          <div className="relative mx-auto max-w-[1500px] px-6 pb-20 pt-14 md:px-12 md:pb-24 md:pt-16 xl:px-24">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink/80 sm:text-sm sm:tracking-[0.4em]">
              Contract intelligence · 2026
            </p>
            <h1 className="mt-10 font-display text-[clamp(64px,12vw,190px)] uppercase leading-[0.86] tracking-[-0.02em]">
              Clause
              <br />
              <span className="text-blaze">Lens</span> AI
            </h1>
            <p className="mt-10 max-w-[640px] text-[clamp(19px,2vw,30px)] leading-snug text-ink/80 sm:mt-12">
              Making legal documents understandable — turning lengthy contracts into clear,
              actionable information.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 font-mono text-xs uppercase tracking-[0.12em] sm:mt-12 sm:text-sm sm:tracking-[0.15em]">
              <Link to="/register" className="bg-ink px-6 py-4 text-paper hover:bg-blaze sm:px-7">
                Upload a contract <span aria-hidden="true">→</span>
              </Link>
              <Link to="/login" className="border-2 border-ink px-6 py-[14px] hover:bg-ink hover:text-paper sm:px-7">
                Sign in
              </Link>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-y-2 border-ink bg-ink text-paper">
          <div className="mx-auto grid max-w-[1500px] sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Upload", "PDF, DOCX or scan. Parsed in seconds."],
              ["02", "Analyse", "Every clause scored for risk and obligation."],
              ["03", "Explore", "Jump clause by clause in plain English."],
              ["04", "Ask", "Question the contract. Get cited answers."],
            ].map(([number, title, description]) => (
              <div key={number} className="border-paper/15 px-6 py-8 sm:border-r sm:px-8 lg:px-10">
                <span className="font-mono text-sm text-volt">{number} /</span>
                <h2 className="mt-4 font-display text-3xl uppercase">{title}</h2>
                <p className="mt-3 text-paper/70">{description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-[1500px] flex-wrap justify-between gap-3 px-6 py-8 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60 sm:text-xs sm:tracking-[0.15em] md:px-12 xl:px-24">
        <span>ClauseLens AI — not legal advice</span>
        <span>01 / 04</span>
      </footer>
    </div>
  );
}
