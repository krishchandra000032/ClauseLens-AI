import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Dashboard", to: "/" },
  { label: "Documents", to: "/documents" },
  { label: "Analysis", to: "/analysis" },
  { label: "Ask Contract", to: "/ask" },
  { label: "Settings", to: "/settings" },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(to: string) {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  }

  return (
    <header
      style={{
        background: "#FFFFFF",
        borderBottom: "1px solid #E2E8F0",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 24px",
          height: 60,
          display: "flex",
          alignItems: "center",
          gap: 32,
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              background: "#1E3A8A",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="1" width="11" height="14" rx="1.5" fill="white" opacity="0.3" />
              <rect x="2" y="1" width="11" height="14" rx="1.5" stroke="white" strokeWidth="1.2" />
              <line x1="4.5" y1="5" x2="10.5" y2="5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="4.5" y1="8" x2="10.5" y2="8" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="4.5" y1="11" x2="8" y2="11" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="13" cy="13" r="3.5" fill="#1E3A8A" stroke="white" strokeWidth="1.2" />
              <line x1="15.5" y1="15.5" x2="17" y2="17" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: "#0F172A",
              letterSpacing: "-0.3px",
            }}
          >
            ClauseLens{" "}
            <span style={{ color: "#1E3A8A" }}>AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            flex: 1,
          }}
          className="hidden-mobile"
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
                color: isActive(link.to) ? "#1E3A8A" : "#475569",
                background: isActive(link.to) ? "#EFF6FF" : "transparent",
                transition: "all 0.15s",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          {/* Notification */}
          <button
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: "1px solid #E2E8F0",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748B",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1.5a4.5 4.5 0 00-4.5 4.5v2.25L2 9.75V11h12v-1.25l-1.5-1.5V6A4.5 4.5 0 008 1.5z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path d="M6.5 11v.5a1.5 1.5 0 003 0V11" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
          {/* Avatar */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #1E3A8A, #6D28D9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            JD
          </div>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            style={{
              display: "none",
              width: 36,
              height: 36,
              borderRadius: 8,
              border: "1px solid #E2E8F0",
              background: "transparent",
              cursor: "pointer",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="show-mobile"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <line x1="2" y1="4" x2="14" y2="4" stroke="#475569" strokeWidth="1.4" strokeLinecap="round" />
              <line x1="2" y1="8" x2="14" y2="8" stroke="#475569" strokeWidth="1.4" strokeLinecap="round" />
              <line x1="2" y1="12" x2="14" y2="12" stroke="#475569" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            borderTop: "1px solid #E2E8F0",
            padding: "8px 24px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              style={{
                padding: "9px 12px",
                borderRadius: 6,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                color: isActive(link.to) ? "#1E3A8A" : "#475569",
                background: isActive(link.to) ? "#EFF6FF" : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
