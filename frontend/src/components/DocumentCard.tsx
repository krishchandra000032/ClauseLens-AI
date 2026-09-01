import { useNavigate } from "react-router-dom";
import type { Document } from "../types";
import RiskBadge from "./RiskBadge";

interface DocumentCardProps {
  doc: Document;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fileTypeIcon(type: string) {
  const isPdf = type === "PDF";
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        background: isPdf ? "#FEF2F2" : "#EFF6FF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          fontWeight: 700,
          color: isPdf ? "#DC2626" : "#1E40AF",
          letterSpacing: "0.05em",
        }}
      >
        {type}
      </span>
    </div>
  );
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  completed: { label: "Analyzed", color: "#065F46", bg: "#D1FAE5" },
  processing: { label: "Processing", color: "#92400E", bg: "#FEF3C7" },
  pending: { label: "Pending", color: "#1E40AF", bg: "#DBEAFE" },
  failed: { label: "Failed", color: "#DC2626", bg: "#FEF2F2" },
};

export default function DocumentCard({ doc }: DocumentCardProps) {
  const navigate = useNavigate();
  const sc = statusConfig[doc.status] || statusConfig.pending;

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 12,
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        transition: "box-shadow 0.15s, border-color 0.15s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(15,23,42,0.08)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "#BFDBFE";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        (e.currentTarget as HTMLDivElement).style.borderColor = "#E2E8F0";
      }}
      onClick={() => doc.status === "completed" && navigate(`/documents/${doc.id}/analysis`)}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        {fileTypeIcon(doc.fileType)}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              color: "#0F172A",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {doc.filename}
          </p>
          <p
            style={{
              fontSize: 12,
              color: "#94A3B8",
              margin: "2px 0 0",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {formatDate(doc.uploadDate)}
          </p>
        </div>
        <span
          style={{
            padding: "2px 8px",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 600,
            color: sc.color,
            background: sc.bg,
            whiteSpace: "nowrap",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {sc.label}
        </span>
      </div>

      {/* Stats row */}
      {doc.status === "completed" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            paddingTop: 12,
            borderTop: "1px solid #F1F5F9",
          }}
        >
          {doc.riskLevel && <RiskBadge level={doc.riskLevel} size="sm" />}
          <div style={{ display: "flex", gap: 14, marginLeft: "auto" }}>
            {doc.clausesCount !== undefined && (
              <Stat label="Clauses" value={doc.clausesCount} />
            )}
            {doc.risksCount !== undefined && (
              <Stat label="Risks" value={doc.risksCount} color="#DC2626" />
            )}
            {doc.riskScore !== undefined && (
              <Stat label="Score" value={`${doc.riskScore}/100`} />
            )}
          </div>
        </div>
      )}

      {/* CTA */}
      {doc.status === "completed" && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/documents/${doc.id}/analysis`);
          }}
          style={{
            padding: "7px 14px",
            borderRadius: 8,
            background: "transparent",
            border: "1px solid #E2E8F0",
            color: "#1E3A8A",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#EFF6FF";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          View Analysis →
        </button>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  color = "#64748B",
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700,
          fontSize: 14,
          color,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 10,
          color: "#94A3B8",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
}
