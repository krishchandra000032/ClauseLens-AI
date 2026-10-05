import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BarChart3, FileText, Files, LayoutDashboard, LogOut, Menu, MessageCircleQuestion, Settings2, X } from "lucide-react";
import { clearAccessToken } from "../services/auth";

const navLinks = [
  { label: "Dashboard", to: "/app", icon: LayoutDashboard },
  { label: "Documents", to: "/documents", icon: Files },
  { label: "Analysis", to: "/analysis", icon: BarChart3 },
  { label: "Ask", to: "/ask", icon: MessageCircleQuestion },
  { label: "Settings", to: "/settings", icon: Settings2 },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  function signOut() {
    clearAccessToken();
    navigate("/login", { replace: true });
  }

  function isActive(to: string) {
    if (to === "/app") return location.pathname === "/app";
    if (to === "/analysis") return location.pathname === "/analysis" || location.pathname.endsWith("/analysis");
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper text-ink">
      <div className="h-2 bg-ink" />
      <div className="mx-auto flex min-h-16 max-w-[1400px] items-center gap-4 px-5 sm:px-8">
        <Link to="/app" className="flex shrink-0 items-center gap-2 font-display text-lg tracking-tight" aria-label="ClauseLens dashboard">
          <span className="grid h-8 w-8 place-items-center bg-ink text-paper"><FileText size={17} /></span>
          <span>CL<span className="text-blaze">/</span>AI</span>
        </Link>

        <nav aria-label="Workspace navigation" className="hidden flex-1 items-center gap-1 lg:flex">
          {navLinks.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors xl:px-4 xl:text-[11px] ${
                isActive(to) ? "bg-ink text-paper" : "text-ink/70 hover:bg-ink/5 hover:text-ink"
              }`}
            >
              <Icon size={14} /> {label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={signOut}
          className="ml-auto hidden items-center gap-2 border border-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] hover:bg-ink hover:text-paper sm:flex"
        >
          <LogOut size={14} /> Sign out
        </button>
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
          className="ml-auto grid h-10 w-10 place-items-center border border-rule lg:hidden"
        >
          {mobileOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      {mobileOpen && (
        <nav aria-label="Mobile workspace navigation" className="border-t border-rule px-5 py-3 sm:px-8 lg:hidden">
          {navLinks.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 font-mono text-xs uppercase tracking-[0.1em] ${
                isActive(to) ? "bg-ink text-paper" : "text-ink/70 hover:bg-ink/5"
              }`}
            >
              <Icon size={16} /> {label}
            </Link>
          ))}
          <button type="button" onClick={signOut} className="mt-2 flex w-full items-center gap-3 border-t border-rule px-3 py-3 font-mono text-xs uppercase tracking-[0.1em]">
            <LogOut size={16} /> Sign out
          </button>
        </nav>
      )}
    </header>
  );
}
