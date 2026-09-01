import { useState } from "react";
import type { Risk } from "../types";
import RiskBadge from "./RiskBadge";

interface RiskCardProps {
  risk: Risk;
}

const categoryColors: Record<string, string> = {
  Termination: "#1E40AF",
  "Non-Compete": "#7C3AED",
  Confidentiality: "#0369A1",
  "Intellectual Property": "#B45309",
  Compensation: "#047857",
};

export default function RiskCard({ risk }: RiskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const catColor = categoryColors[risk.category] || "#64748B";

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderLeft: `4px solid ${risk.severity === "high" ? "#DC2626" : risk.severity === "medium" ? "#D97706" : "#059669"}`,
        borderRadius: "0 12px 12px 0",
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <RiskBadge level={risk.severity} />
            <span
              style={{
                padding: "2px 8px",
                borderRadius: 4,
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                fontSize: 11,
                fontWeight: 500,
                color: catColor,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {risk.category}
            </span>
          </div>
          <h3
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: 16,
              color: "#0F172A",
              margin: "8px 0 0",
            }}
          >
            {risk.title}
          </h3>
        </div>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "#94A3B8",
            flexShrink: 0,
            padding: "2px 8px",
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: 6,
          }}
        >
          pg {risk.pageNumber}
        </span>
      </div>

      {/* Explanation */}
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 14,
          color: "#334155",
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        {risk.explanation}
      </p>

      {/* Clause text */}
      {risk.clauseText && (
        <blockquote
          style={{
            margin: 0,
            padding: "10px 14px",
            background: "#F8FAFC",
            borderLeft: "3px solid #CBD5E1",
            borderRadius: "0 8px 8px 0",
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            color: "#475569",
            lineHeight: 1.6,
            fontStyle: "italic",
          }}
        >
          {risk.clauseText.length > 180
            ? risk.clauseText.slice(0, 180) + "…"
            : risk.clauseText}
        </blockquote>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          style={{
            padding: "6px 14px",
            borderRadius: 7,
            border: "1px solid #E2E8F0",
            background: "transparent",
            color: "#1E3A8A",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          View Clause
        </button>
        <button
          onClick={() => setExpanded((v) => !v)}
          style={{
            padding: "6px 14px",
            borderRadius: 7,
            border: "none",
            background: "transparent",
            color: "#64748B",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          Why is this risky?
          <span style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
            ▾
          </span>
        </button>
      </div>

      {/* Expanded why risky */}
      {expanded && (
        <div
          style={{
            padding: "14px 16px",
            background: "#FFFBEB",
            border: "1px solid #FDE68A",
            borderRadius: 10,
            fontFamily: "'Inter', sans-serif",
            fontSize: 13.5,
            color: "#78350F",
            lineHeight: 1.65,
          }}
        >
          <div
            style={{
              fontWeight: 600,
              color: "#92400E",
              marginBottom: 6,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 1.5L13 12.5H1L7 1.5z"
                stroke="#D97706"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
              <line x1="7" y1="6" x2="7" y2="9" stroke="#D97706" strokeWidth="1.3" strokeLinecap="round" />
              <circle cx="7" cy="10.5" r="0.7" fill="#D97706" />
            </svg>
            Legal analysis
          </div>
          {risk.whyRisky}
        </div>
      )}
    </div>
  );
}
