import { useState } from "react";
import type { Clause } from "../types";
import RiskBadge from "./RiskBadge";

interface ClauseCardProps {
  clause: Clause;
}

const categoryColors: Record<string, string> = {
  Compensation: "#047857",
  Termination: "#1E40AF",
  Confidentiality: "#0369A1",
  "Intellectual Property": "#B45309",
  "Non-Compete": "#7C3AED",
  Leave: "#0F766E",
  "Dispute Resolution": "#1D4ED8",
  Other: "#64748B",
};

export default function ClauseCard({ clause }: ClauseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const catColor = categoryColors[clause.category] || "#64748B";

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 12,
        overflow: "hidden",
        transition: "box-shadow 0.15s",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 2px 12px rgba(15,23,42,0.06)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLDivElement).style.boxShadow = "none")
      }
    >
      {/* Header */}
      <div style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
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
                {clause.category}
              </span>
              <RiskBadge level={clause.riskLevel} size="sm" />
            </div>
            <h3
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: 15,
                color: "#0F172A",
                margin: 0,
              }}
            >
              {clause.title}
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
            pg {clause.pageNumber}
          </span>
        </div>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 13.5,
            color: "#475569",
            lineHeight: 1.6,
            margin: "10px 0 0",
          }}
        >
          {clause.summary}
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: "#94A3B8",
            }}
          >
            {clause.sourceReference}
          </span>
          <button
            onClick={() => setExpanded((v) => !v)}
            style={{
              padding: "5px 12px",
              borderRadius: 7,
              border: "1px solid #E2E8F0",
              background: expanded ? "#EFF6FF" : "transparent",
              color: "#1E3A8A",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            {expanded ? "Collapse" : "View Details"}
            <span style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
              ▾
            </span>
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div
          style={{
            borderTop: "1px solid #F1F5F9",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            background: "#FAFBFD",
          }}
        >
          {/* Full text */}
          <div>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: "#94A3B8",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Full Clause Text
            </div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13.5,
                color: "#334155",
                lineHeight: 1.7,
                margin: 0,
                padding: "12px 14px",
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: 8,
                fontStyle: "italic",
              }}
            >
              {clause.fullText}
            </p>
          </div>

          {/* Key points */}
          {clause.keyPoints && clause.keyPoints.length > 0 && (
            <div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#94A3B8",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Key Points
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                {clause.keyPoints.map((pt, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13.5,
                      color: "#334155",
                    }}
                  >
                    <span style={{ color: "#1E3A8A", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>·</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Risk assessment */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                color: "#64748B",
              }}
            >
              Risk assessment:
            </span>
            <RiskBadge level={clause.riskLevel} />
          </div>
        </div>
      )}
    </div>
  );
}
