import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import RiskBadge from "../components/RiskBadge";

function DocSubNav({ id, active }: { id: string; active: string }) {
  const tabs = [
    { label: "Analysis", to: `/documents/${id}/analysis` },
    { label: "Clauses", to: `/documents/${id}/clauses` },
    { label: "Ask Contract", to: `/documents/${id}/ask` },
    { label: "Viewer", to: `/documents/${id}/viewer` },
  ];
  return (
    <div style={{ display: "flex", gap: 2, borderBottom: "1px solid #E2E8F0", background: "#FFFFFF", padding: "0 24px" }}>
      {tabs.map((t) => {
        const isActive = active === t.label;
        return (
          <Link
            key={t.to}
            to={t.to}
            style={{
              padding: "12px 16px",
              fontSize: 14,
              fontWeight: 500,
              fontFamily: "'Inter', sans-serif",
              textDecoration: "none",
              color: isActive ? "#1E3A8A" : "#64748B",
              borderBottom: `2px solid ${isActive ? "#1E3A8A" : "transparent"}`,
            }}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}

const MOCK_PAGES = [
  "This Employment Agreement is entered into as of the 1st of November 2024, between TechCorp Limited, a company incorporated in England and Wales with company number 12345678 (the “Employer”), and the undersigned employee (the “Employee”).",
  "1. Position and Duties\nThe Employee is engaged as a Software Engineer and shall report to the Head of Engineering. The Employee's principal duties shall include software development, code reviews, technical documentation, and such other duties as may reasonably be assigned.\n\n2. Place of Work\nThe Employee shall primarily work at the Employer's offices at 100 Tech Street, London EC1A 1BB, with the option to work remotely up to three days per week subject to the Employer's remote working policy.",
  "3. Commencement and Probation\nThe employment shall commence on the 4th of November 2024. The first six months shall constitute a probationary period during which either party may terminate this Agreement by giving one week's written notice.\n\n4. Compensation\nThe Employee shall receive a base salary of sixty-five thousand pounds (£65,000) per annum, payable monthly. Salary reviews shall occur annually at the discretion of the Board.",
  "8. Termination\n8.1 Notice Period: Either party may terminate this Agreement by giving three (3) months written notice.\n\n8.2 Early Termination Penalty: Should the Employee voluntarily terminate this Agreement prior to the completion of twenty-four (24) months of continuous service, the Employee shall be liable to pay to the Employer a sum equivalent to three (3) months gross salary as liquidated damages...",
  "5. Confidentiality\n5.1 The Employee agrees to keep strictly confidential all information, data, know-how, processes, trade secrets, business plans, financial information, customer lists and any other information relating to the Employer's business, whether or not marked as confidential, both during the term of employment and for an indefinite period thereafter.",
];

interface PanelClause {
  title: string;
  riskLevel: "high" | "medium" | "low";
  explanation: string;
  citation: string;
  summary: string;
}

const PANEL_CLAUSES: PanelClause[] = [
  {
    title: "Early Termination Penalty",
    riskLevel: "high",
    explanation:
      "If you resign before completing two years, you must pay three months of gross salary as liquidated damages.",
    citation: "Page 4 · Section 8.2",
    summary:
      "This penalty clause is unusually strong and may be disproportionate. Seek legal advice before signing.",
  },
  {
    title: "Confidentiality Obligation",
    riskLevel: "medium",
    explanation:
      "Perpetual obligation to keep all company information confidential with no expiry date.",
    citation: "Page 3 · Section 5.1",
    summary:
      "The indefinite duration of this clause may restrict your ability to discuss your experience freely.",
  },
];

export default function DocumentViewer() {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState(4);
  const [selectedClause, setSelectedClause] = useState<PanelClause>(PANEL_CLAUSES[0]);
  const totalPages = 12;

  const pageText = MOCK_PAGES[Math.min(page - 1, MOCK_PAGES.length - 1)];
  const isHighlightPage = page === 4;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 60px)" }}>
      {/* Header */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", padding: "12px 24px", flexShrink: 0 }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <Link to="/documents" style={{ fontSize: 13, color: "#64748B", textDecoration: "none", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
            ← Documents
          </Link>
          <span style={{ color: "#CBD5E1" }}>/</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15, color: "#0F172A" }}>
            Document Viewer
          </span>
        </div>
      </div>

      <div style={{ flexShrink: 0, maxWidth: 1300, margin: "0 auto", width: "100%", padding: "0 24px" }}>
        <DocSubNav id={id!} active="Viewer" />
      </div>

      {/* Split view */}
      <div style={{ flex: 1, overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 360px", maxWidth: 1300, margin: "0 auto", width: "100%", padding: "0 24px 24px" }}>
        {/* Left — PDF preview */}
        <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", paddingRight: 16 }}>
          {/* Page controls */}
          <div
            style={{
              padding: "10px 0 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#64748B" }}>
              Employment Agreement - Software Engineer.pdf
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 7,
                  border: "1px solid #E2E8F0",
                  background: "white",
                  cursor: page === 1 ? "default" : "pointer",
                  opacity: page === 1 ? 0.4 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#475569",
                }}
              >
                ‹
              </button>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#64748B", minWidth: 70, textAlign: "center" }}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 7,
                  border: "1px solid #E2E8F0",
                  background: "white",
                  cursor: page === totalPages ? "default" : "pointer",
                  opacity: page === totalPages ? 0.4 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#475569",
                }}
              >
                ›
              </button>
            </div>
          </div>

          {/* Page content */}
          <div
            style={{
              flex: 1,
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: 12,
              padding: "40px 48px",
              overflow: "auto",
              boxShadow: "0 4px 20px rgba(15,23,42,0.06)",
            }}
          >
            {/* Page number */}
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: "#CBD5E1",
                textAlign: "center",
                marginBottom: 32,
                letterSpacing: "0.08em",
              }}
            >
              PAGE {page}
            </div>

            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                lineHeight: 1.8,
                color: "#1E293B",
                whiteSpace: "pre-wrap",
              }}
            >
              {isHighlightPage ? (
                <>
                  {pageText.split("8.2 Early Termination Penalty:")[0]}
                  <span
                    style={{
                      background: "#FEF08A",
                      borderRadius: 3,
                      padding: "1px 2px",
                    }}
                  >
                    8.2 Early Termination Penalty: Should the Employee voluntarily terminate this Agreement prior to the completion of twenty-four (24) months of continuous service, the Employee shall be liable to pay to the Employer a sum equivalent to three (3) months gross salary as liquidated damages...
                  </span>
                </>
              ) : (
                pageText
              )}
            </div>
          </div>
        </div>

        {/* Right — AI analysis panel */}
        <div style={{ overflow: "auto", paddingTop: 52 }}>
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "14px 16px",
                borderBottom: "1px solid #F1F5F9",
                background: "#FAFBFD",
              }}
            >
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#94A3B8",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Flagged on this page
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {PANEL_CLAUSES.map((c) => (
                  <button
                    key={c.title}
                    onClick={() => setSelectedClause(c)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: `1px solid ${selectedClause.title === c.title ? "#BFDBFE" : "#E2E8F0"}`,
                      background: selectedClause.title === c.title ? "#EFF6FF" : "white",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: c.riskLevel === "high" ? "#DC2626" : "#D97706",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13,
                        fontWeight: 500,
                        color: selectedClause.title === c.title ? "#1E3A8A" : "#334155",
                      }}
                    >
                      {c.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected clause details */}
            <div style={{ padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <RiskBadge level={selectedClause.riskLevel} />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: "#94A3B8",
                    marginLeft: "auto",
                  }}
                >
                  {selectedClause.citation}
                </span>
              </div>
              <h3
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 16,
                  color: "#0F172A",
                  margin: "0 0 10px",
                }}
              >
                {selectedClause.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13.5,
                  color: "#334155",
                  lineHeight: 1.65,
                  margin: "0 0 12px",
                }}
              >
                {selectedClause.explanation}
              </p>
              <div
                style={{
                  padding: "10px 12px",
                  background: "#F8FAFF",
                  border: "1px solid #C7D2FE",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    marginBottom: 5,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5" fill="#6D28D9" opacity="0.15" />
                    <circle cx="6" cy="6" r="2.5" fill="#6D28D9" />
                  </svg>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#5B21B6",
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                    }}
                  >
                    AI Summary
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12.5,
                    color: "#334155",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {selectedClause.summary}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
