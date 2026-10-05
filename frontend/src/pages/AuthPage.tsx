import { useRef, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Check, Eye, FileText, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { loginUser, registerUser, saveAccessToken } from "../services/auth";

type AuthMode = "login" | "register";

function Shard() {
  return (
    <svg
      viewBox="0 0 600 800"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-y-0 right-0 h-full w-[70%]"
      aria-hidden="true"
    >
      <polygon points="230,0 400,0 600,110 600,800 70,800 0,330" className="fill-volt" />
    </svg>
  );
}

export default function AuthPage({ mode }: { mode: AuthMode }) {
  const isLogin = mode === "login";
  const location = useLocation();
  const navigate = useNavigate();
  const pending = useRef(false);
  const nameInput = useRef<HTMLInputElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function getReturnPath() {
    const state = location.state as {
      from?: { pathname?: string; search?: string; hash?: string };
    } | null;
    const from = state?.from;
    return from?.pathname
      ? `${from.pathname}${from.search || ""}${from.hash || ""}`
      : "/app";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    setError("");
    setNotice("");

    if (!isLogin && !name.trim()) {
      setError("Enter your name to create an account.");
      nameInput.current?.focus();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      emailInput.current?.focus();
      return;
    }
    if (!password) {
      setError("Enter your password.");
      passwordInput.current?.focus();
      return;
    }
    if (!isLogin && password.length < 8) {
      setError("Choose a password with at least 8 characters.");
      passwordInput.current?.focus();
      return;
    }
    if (!isLogin && password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    pending.current = true;
    setLoading(true);
    try {
      if (isLogin) {
        const token = await loginUser(email.trim(), password);
        saveAccessToken(token, rememberMe);
      } else {
        await registerUser(name.trim(), email.trim(), password);
        const token = await loginUser(email.trim(), password);
        saveAccessToken(token);
      }
      setPassword("");
      setConfirmPassword("");
      navigate(getReturnPath(), { replace: true });
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Unable to complete sign in. Please try again.");
    } finally {
      pending.current = false;
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-paper font-sans text-ink lg:grid-cols-[1.1fr_1fr]">
      <section className="relative flex min-h-[330px] flex-col overflow-hidden border-b border-rule px-6 py-7 sm:px-10 lg:min-h-screen lg:border-b-0 lg:border-r lg:px-14 lg:py-10 xl:px-24">
        <Link to="/" className="relative z-10 flex items-center gap-3 font-display text-xl tracking-tight" aria-label="ClauseLens AI home">
          <span className="grid h-10 w-10 place-items-center bg-ink text-paper"><FileText size={21} /></span>
          <span>ClauseLens<span className="ml-1 text-blaze">AI</span></span>
        </Link>
        <Shard />
        <div className="relative z-10 flex flex-1 flex-col justify-center py-9 lg:py-14">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/75 sm:text-xs sm:tracking-[0.4em]">
            {isLogin ? "Access · 02" : "Enrol · 03"}
          </p>
          <h1 className="my-6 font-display text-[clamp(48px,7vw,112px)] uppercase leading-[0.9] tracking-[-0.03em]">
            {isLogin ? "Welcome" : "Read"}
            <br />
            <span className="text-blaze">{isLogin ? "Back." : "Less."}</span>
            {!isLogin && <><br />Know more.</>}
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-ink/75 sm:text-lg">
            {isLogin
              ? "Understand your contracts, identify risks, and make better decisions with AI-powered intelligence."
              : "Create an account to review agreements, spot risks, and ask clear questions about the terms that matter."}
          </p>
          <div className="mt-7 max-w-md border-2 border-ink bg-paper p-4 shadow-[8px_8px_0_var(--color-ink)] sm:mt-10 sm:p-5">
            <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.12em] sm:text-xs sm:tracking-[0.15em]">
              <span>§ 7.2 Termination</span>
              <span className="shrink-0 bg-blaze px-2 py-1 text-paper">High risk</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink/80 sm:text-base">
              Either party may terminate <mark className="bg-volt px-1">without notice</mark> upon any material breach.
            </p>
          </div>
          <div className="mt-7 hidden flex-wrap gap-x-6 gap-y-3 font-mono text-[10px] uppercase tracking-[0.08em] text-ink/75 sm:flex sm:text-xs sm:tracking-[0.1em]">
            {["AI clause analysis", "Risk detection", "Cited answers"].map((feature) => (
              <span key={feature} className="flex items-center gap-2"><Check size={14} />{feature}</span>
            ))}
          </div>
        </div>
        <div className="relative z-10 hidden justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60 lg:flex">
          <span>Built for better-informed decisions.</span><span>§</span>
        </div>
      </section>

      <section className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:min-h-screen lg:px-12 xl:px-20">
        <div className="mx-auto w-full max-w-[460px]">
          <p className="mb-8 hidden items-center justify-end gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/65 sm:flex">
            <ShieldCheck size={14} /> Your contracts. Your confidence.
          </p>
          <div className="border-2 border-ink bg-paper p-6 shadow-[8px_8px_0_var(--color-ink)] sm:p-8">
            <div className="mb-5 grid h-11 w-11 place-items-center bg-volt text-ink"><FileText size={22} /></div>
            <div className="mb-7">
              <h2 className="font-display text-3xl uppercase tracking-tight sm:text-4xl">{isLogin ? "Sign in" : "Register"}</h2>
              <p className="mt-2 text-sm text-ink/70 sm:text-base">
                {isLogin ? "Pick up where you left off with your contracts." : "Create an account to analyse your first contract."}
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate aria-busy={loading} className="space-y-5">
              {!isLogin && (
                <label className="block font-mono text-[11px] uppercase tracking-[0.15em]" htmlFor="name">
                  Full name
                  <input
                    ref={nameInput}
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Ada Lovelace"
                    value={name}
                    disabled={loading}
                    onChange={(event) => setName(event.target.value)}
                    className="mt-2 block h-12 w-full border-2 border-ink bg-white px-3 font-sans text-base normal-case tracking-normal outline-none placeholder:text-ink/35 focus:shadow-[4px_4px_0_var(--color-blaze)] disabled:opacity-60"
                  />
                </label>
              )}
              <label className="block font-mono text-[11px] uppercase tracking-[0.15em]" htmlFor="email">
                Email address
                <input
                  ref={emailInput}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  disabled={loading}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 block h-12 w-full border-2 border-ink bg-white px-3 font-sans text-base normal-case tracking-normal outline-none placeholder:text-ink/35 focus:shadow-[4px_4px_0_var(--color-blaze)] disabled:opacity-60"
                />
              </label>
              <label className="block font-mono text-[11px] uppercase tracking-[0.15em]" htmlFor="password">
                Password
                <span className="relative mt-2 block">
                  <input
                    ref={passwordInput}
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    placeholder={isLogin ? "Enter your password" : "At least 8 characters"}
                    value={password}
                    disabled={loading}
                    onChange={(event) => setPassword(event.target.value)}
                    className="block h-12 w-full border-2 border-ink bg-white px-3 pr-14 font-sans text-base normal-case tracking-normal outline-none placeholder:text-ink/35 focus:shadow-[4px_4px_0_var(--color-blaze)] disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-0 grid w-12 place-items-center text-ink/60 hover:text-blaze"
                  >
                    <Eye size={18} />
                  </button>
                </span>
              </label>
              {!isLogin && (
                <label className="block font-mono text-[11px] uppercase tracking-[0.15em]" htmlFor="confirmPassword">
                  Confirm password
                  <span className="relative mt-2 block">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      disabled={loading}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      className="block h-12 w-full border-2 border-ink bg-white px-3 pr-12 font-sans text-base normal-case tracking-normal outline-none placeholder:text-ink/35 focus:shadow-[4px_4px_0_var(--color-blaze)] disabled:opacity-60"
                    />
                    <LockKeyhole size={17} aria-hidden="true" className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/50" />
                  </span>
                </label>
              )}

              {isLogin && (
                <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.08em] sm:text-xs">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={rememberMe} disabled={loading} onChange={(event) => setRememberMe(event.target.checked)} className="h-4 w-4 accent-[#17140F]" /> Remember me</label>
                  <button type="button" onClick={() => setNotice("Password recovery is not available yet. Contact your administrator for help accessing your account.")} className="underline underline-offset-4">Forgot password?</button>
                </div>
              )}

              {error && <p className="border-l-4 border-blaze bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</p>}
              {notice && <p className="border-l-4 border-ink bg-volt/35 px-4 py-3 text-sm" role="status">{notice}</p>}

              <button type="submit" disabled={loading} className="flex h-14 w-full items-center justify-between bg-ink px-5 font-mono text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:bg-blaze disabled:cursor-wait disabled:opacity-70 sm:text-sm sm:tracking-[0.2em]">
                {loading ? (isLogin ? "Signing in..." : "Creating account...") : (isLogin ? "Sign in" : "Create account")}
                {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-paper/40 border-t-paper" aria-hidden="true" /> : <ArrowRight size={19} />}
              </button>
            </form>

            <p className="mt-6 border-t border-rule pt-5 text-sm text-ink/75">
              {isLogin ? "New here? " : "Have an account? "}
              <Link
                to={isLogin ? "/register" : "/login"}
                state={location.state}
                className="inline-flex items-center gap-1 font-semibold text-blaze underline-offset-4 hover:underline"
              >
                {isLogin ? "Create an account" : "Sign in"} <ArrowRight size={14} />
              </Link>
            </p>
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60 sm:text-xs">
            <Sparkles size={14} /> Your contracts stay yours. Always.
          </p>
          <footer className="mt-8 flex flex-wrap justify-between gap-2 font-mono text-[9px] uppercase tracking-[0.1em] text-ink/55 sm:text-[10px] sm:tracking-[0.12em]">
            <span>© {new Date().getFullYear()} ClauseLens AI</span>
            <span>Contract intelligence, made clear.</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
