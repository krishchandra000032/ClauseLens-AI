import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UploadDropzone from "../components/UploadDropzone";
import DocumentCard from "../components/DocumentCard";
import EmptyState from "../components/EmptyState";
import type { Document } from "../types";
import { listDocuments, uploadDocument } from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [documentsError, setDocumentsError] = useState("");

  useEffect(() => {
    let active = true;
    listDocuments()
      .then((result) => { if (active) setDocuments(result); })
      .catch((failure: unknown) => {
        if (active) setDocumentsError(failure instanceof Error ? failure.message : "Unable to load your documents.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function handleUpload() {
    if (!selectedFile) return;
    setUploadError("");
    setUploading(true);
    try {
      const doc = await uploadDocument(selectedFile);
      navigate(`/processing/${doc.id}`);
    } catch (failure) {
      setUploadError(failure instanceof Error ? failure.message : "Unable to upload this contract.");
      setUploading(false);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      {/* Hero */}
      <div style={{ marginBottom: 40, textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 12px",
            background: "#EFF6FF",
            borderRadius: 20,
            marginBottom: 16,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" fill="#1E3A8A" opacity="0.15" />
            <circle cx="6" cy="6" r="2.5" fill="#1E3A8A" />
          </svg>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: "#1E3A8A",
              letterSpacing: "0.03em",
            }}
          >
            AI-Powered Contract Analysis
          </span>
        </div>
        <h1
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: 40,
            color: "#0F172A",
            margin: "0 0 12px",
            letterSpacing: "-0.8px",
            lineHeight: 1.15,
          }}
        >
          Understand your contracts
          <br />
          <span style={{ color: "#1E3A8A" }}>with AI.</span>
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 17,
            color: "#64748B",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          Extract clauses, identify risky terms, and ask questions about
          <br />
          your contracts with cited answers.
        </p>
      </div>

      {/* Upload area */}
      <div style={{ marginBottom: 16 }}>
        <UploadDropzone
          onFileSelect={(f) => { setSelectedFile(f); setUploadError(""); }}
          loading={uploading}
        />
        {uploadError && (
          <p role="alert" style={{ marginTop: 12, color: "#B91C1C", fontSize: 13 }}>
            {uploadError}
          </p>
        )}
        {selectedFile && (
          <div
            style={{
              marginTop: 12,
              padding: "10px 16px",
              background: "#EFF6FF",
              border: "1px solid #BFDBFE",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="9" height="12" rx="1" stroke="#1E3A8A" strokeWidth="1.2" />
                <path d="M3.5 4.5h4M3.5 7h4M3.5 9.5h2.5" stroke="#1E3A8A" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#1E3A8A",
                }}
              >
                {selectedFile.name}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: "#64748B",
                }}
              >
                {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
              </span>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#64748B",
                fontSize: 16,
              }}
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Analyze CTA */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 56 }}>
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          style={{
            padding: "13px 32px",
            borderRadius: 10,
            background: selectedFile && !uploading ? "#1E3A8A" : "#CBD5E1",
            color: "white",
            border: "none",
            fontSize: 15,
            fontWeight: 700,
            cursor: selectedFile && !uploading ? "pointer" : "default",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "-0.2px",
            transition: "background 0.15s, transform 0.1s",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
          onMouseEnter={(e) => {
            if (selectedFile && !uploading)
              (e.currentTarget as HTMLButtonElement).style.background = "#1e40af";
          }}
          onMouseLeave={(e) => {
            if (selectedFile && !uploading)
              (e.currentTarget as HTMLButtonElement).style.background = "#1E3A8A";
          }}
        >
          {uploading ? (
            <>
              <div
                style={{
                  width: 14,
                  height: 14,
                  border: "2px solid white",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                }}
              />
              Uploading…
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v8M5 5l3-3 3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Analyze Contract
            </>
          )}
        </button>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>

      {/* Recent documents */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <h2
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: 20,
              color: "#0F172A",
              margin: 0,
            }}
          >
            Recent Documents
          </h2>
          <a
            href="/documents"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              color: "#1E3A8A",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            View all →
          </a>
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  height: 160,
                  background: "#F1F5F9",
                  borderRadius: 12,
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        ) : documentsError ? (
          <div role="alert" style={{ padding: 20, border: "1px solid #FECACA", background: "#FEF2F2", color: "#991B1B", borderRadius: 10, fontSize: 14 }}>
            {documentsError}
          </div>
        ) : documents.length === 0 ? (
          <EmptyState
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="2" width="14" height="18" rx="2" stroke="#94A3B8" strokeWidth="1.5" />
                <path d="M7 8h6M7 12h6M7 16h4" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            }
            title="No contracts yet"
            description="Upload your first contract to start analyzing clauses and risks."
          />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {documents.slice(0, 6).map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 12,
          color: "#94A3B8",
          textAlign: "center",
          marginTop: 48,
          lineHeight: 1.5,
        }}
      >
        ClauseLens AI provides informational analysis and is not a substitute
        for professional legal advice.
      </p>
    </div>
  );
}
