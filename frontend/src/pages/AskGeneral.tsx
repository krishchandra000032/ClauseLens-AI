import { useNavigate } from "react-router-dom";
import type { Document } from "../types";
import { useState, useEffect } from "react";
import { listDocuments } from "../services/api";
import EmptyState from "../components/EmptyState";

export default function AskGeneral() {
  const navigate = useNavigate();
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listDocuments()
      .then((d) => setDocs(d.filter((doc) => doc.status === "completed")))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "64px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: 32,
            color: "#0F172A",
            margin: "0 0 10px",
            letterSpacing: "-0.5px",
          }}
        >
          Ask Your Contract
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 16,
            color: "#64748B",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          Select a contract to start asking questions.
        </p>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2].map((i) => (
            <div key={i} style={{ height: 72, background: "#F1F5F9", borderRadius: 12, animation: "pulse 1.5s ease-in-out infinite" }} />
          ))}
        </div>
      ) : docs.length === 0 ? (
        <EmptyState
          title="No analyzed contracts"
          description="Upload and analyze a contract before using the Ask feature."
          action={
            <button
              onClick={() => navigate("/")}
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
          }
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {docs.map((doc) => (
            <button
              key={doc.id}
              onClick={() => navigate(`/documents/${doc.id}/ask`)}
              style={{
                padding: "16px 20px",
                borderRadius: 12,
                border: "1px solid #E2E8F0",
                background: "#FFFFFF",
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 14,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#BFDBFE";
                (e.currentTarget as HTMLButtonElement).style.background = "#F8FCFF";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0";
                (e.currentTarget as HTMLButtonElement).style.background = "#FFFFFF";
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "#EFF6FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="2" y="1" width="11" height="15" rx="1.5" stroke="#1E3A8A" strokeWidth="1.3" />
                  <path d="M4.5 6h6M4.5 9h6M4.5 12h3" stroke="#1E3A8A" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#0F172A",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {doc.filename}
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    color: "#94A3B8",
                    marginTop: 2,
                  }}
                >
                  {doc.clausesCount} clauses · {doc.risksCount} risks
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M5 8h6M8 5l3 3-3 3" stroke="#94A3B8" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
