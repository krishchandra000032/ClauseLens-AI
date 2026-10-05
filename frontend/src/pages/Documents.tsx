import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DocumentCard from "../components/DocumentCard";
import EmptyState from "../components/EmptyState";
import type { Document, RiskLevel } from "../types";
import { listDocuments, deleteDocument } from "../services/api";

type Filter = "all" | "high" | "medium" | "low" | "recent";

export default function Documents() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    listDocuments().then(setDocuments).finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this document? This cannot be undone.")) return;
    setDeletingId(id);
    await deleteDocument(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    setDeletingId(null);
  }

  const filtered = documents.filter((d) => {
    const searchMatch =
      !search || d.filename.toLowerCase().includes(search.toLowerCase());
    const filterMatch =
      filter === "all" ||
      (filter === "recent" && true) ||
      d.riskLevel === filter;
    return searchMatch && filterMatch;
  });

  const sorted =
    filter === "recent"
      ? [...filtered].sort(
          (a, b) =>
            new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        )
      : filtered;

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "high", label: "High Risk" },
    { id: "medium", label: "Medium Risk" },
    { id: "low", label: "Low Risk" },
    { id: "recent", label: "Recently Analyzed" },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: 28,
              color: "#0F172A",
              margin: "0 0 4px",
              letterSpacing: "-0.4px",
            }}
          >
            My Documents
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              color: "#64748B",
              margin: 0,
            }}
          >
            {documents.length} contract{documents.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          onClick={() => navigate("/app")}
          style={{
            padding: "10px 20px",
            borderRadius: 9,
            background: "#1E3A8A",
            color: "white",
            border: "none",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          <span>+</span> Upload Contract
        </button>
      </div>

      {/* Search + filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <svg
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
          >
            <circle cx="6.5" cy="6.5" r="5" stroke="#94A3B8" strokeWidth="1.3" />
            <path d="M11 11l2.5 2.5" stroke="#94A3B8" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contracts…"
            style={{
              width: "100%",
              padding: "10px 14px 10px 36px",
              border: "1px solid #E2E8F0",
              borderRadius: 9,
              fontSize: 14,
              fontFamily: "'Inter', sans-serif",
              color: "#0F172A",
              background: "#FFFFFF",
              outline: "none",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: `1px solid ${filter === f.id ? "#1E3A8A" : "#E2E8F0"}`,
                background: filter === f.id ? "#EFF6FF" : "white",
                color: filter === f.id ? "#1E3A8A" : "#475569",
                fontSize: 13,
                fontWeight: filter === f.id ? 600 : 400,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table header */}
      {!loading && sorted.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 120px 100px 80px 70px 100px",
            padding: "8px 16px",
            borderRadius: 8,
            background: "#F8FAFC",
            marginBottom: 8,
          }}
        >
          {["Document", "Uploaded", "Risk Level", "Score", "Risks", "Actions"].map((h) => (
            <span
              key={h}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                color: "#94A3B8",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {h}
            </span>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: 64, background: "#F1F5F9", borderRadius: 10, animation: "pulse 1.5s ease-in-out infinite" }} />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <EmptyState
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="#94A3B8" strokeWidth="1.5" />
              <path d="M21 21l-4.35-4.35" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
          title={search ? "No matching contracts" : "No contracts yet"}
          description={
            search
              ? `No contracts matching "${search}". Try a different search.`
              : "Upload your first contract to start analyzing clauses and risks."
          }
          action={
            !search ? (
              <button
                onClick={() => navigate("/app")}
                style={{
                  padding: "9px 20px",
                  background: "#1E3A8A",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Upload Contract
              </button>
            ) : undefined
          }
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {sorted.map((doc) => (
            <TableRow
              key={doc.id}
              doc={doc}
              deleting={deletingId === doc.id}
              onView={() => navigate(`/documents/${doc.id}/analysis`)}
              onDelete={() => handleDelete(doc.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TableRow({
  doc,
  deleting,
  onView,
  onDelete,
}: {
  doc: Document;
  deleting: boolean;
  onView: () => void;
  onDelete: () => void;
}) {
  function riskColor(level?: RiskLevel) {
    if (level === "high") return "#DC2626";
    if (level === "medium") return "#D97706";
    return "#059669";
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 120px 100px 80px 70px 100px",
        alignItems: "center",
        padding: "12px 16px",
        borderRadius: 10,
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        opacity: deleting ? 0.5 : 1,
        transition: "box-shadow 0.15s",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(15,23,42,0.06)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLDivElement).style.boxShadow = "none")
      }
    >
      {/* Filename */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 7,
            background: doc.fileType === "PDF" ? "#FEF2F2" : "#EFF6FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              fontWeight: 700,
              color: doc.fileType === "PDF" ? "#DC2626" : "#1E40AF",
            }}
          >
            {doc.fileType}
          </span>
        </div>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 13.5,
            fontWeight: 500,
            color: "#0F172A",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {doc.filename}
        </span>
      </div>

      {/* Date */}
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#64748B" }}>
        {new Date(doc.uploadDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
      </span>

      {/* Risk level */}
      {doc.riskLevel ? (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            fontWeight: 600,
            color: riskColor(doc.riskLevel),
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: riskColor(doc.riskLevel),
              flexShrink: 0,
            }}
          />
          {doc.riskLevel.charAt(0).toUpperCase() + doc.riskLevel.slice(1)}
        </span>
      ) : (
        <span style={{ color: "#94A3B8", fontSize: 12 }}>—</span>
      )}

      {/* Score */}
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: riskColor(doc.riskLevel) }}>
        {doc.riskScore ?? "—"}
      </span>

      {/* Risks */}
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: doc.risksCount ? "#DC2626" : "#94A3B8", fontWeight: 600 }}>
        {doc.risksCount ?? "—"}
      </span>

      {/* Actions */}
      <div style={{ display: "flex", gap: 6 }}>
        <ActionBtn onClick={onView} label="View" primary />
        <ActionBtn onClick={onDelete} label={deleting ? "…" : "Delete"} danger />
      </div>
    </div>
  );
}

function ActionBtn({
  onClick,
  label,
  primary,
  danger,
}: {
  onClick: () => void;
  label: string;
  primary?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 10px",
        borderRadius: 6,
        border: `1px solid ${primary ? "#1E3A8A" : danger ? "#FECACA" : "#E2E8F0"}`,
        background: primary ? "#EFF6FF" : danger ? "#FEF2F2" : "white",
        color: primary ? "#1E3A8A" : danger ? "#DC2626" : "#475569",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {label}
    </button>
  );
}
