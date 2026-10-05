import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import RiskBadge from "../components/RiskBadge";
import RiskCard from "../components/RiskCard";
import RiskScoreRing from "../components/RiskScoreRing";
import EmptyState from "../components/EmptyState";

import type { Document, AnalysisResult, Risk } from "../types";

import {
  getDocument,
  getAnalysis,
  getRisks,
  downloadSummaryPdf,
} from "../services/api";


function DocSubNav({
  id,
  active,
}: {
  id: string;
  active: string;
}) {
  const tabs = [
    {
      label: "Analysis",
      to: `/documents/${id}/analysis`,
    },
    {
      label: "Clauses",
      to: `/documents/${id}/clauses`,
    },
    {
      label: "Ask Contract",
      to: `/documents/${id}/ask`,
    },
    {
      label: "Viewer",
      to: `/documents/${id}/viewer`,
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: 2,
        borderBottom: "1px solid #E2E8F0",
        background: "#FFFFFF",
        padding: "0 24px",
      }}
    >
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
              borderBottom: `2px solid ${
                isActive ? "#1E3A8A" : "transparent"
              }`,
              transition: "all 0.15s",
            }}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}


export default function Analysis() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const [doc, setDoc] = useState<Document | null>(null);

  const [analysis, setAnalysis] =
    useState<AnalysisResult | null>(null);

  const [risks, setRisks] = useState<Risk[]>([]);

  const [loading, setLoading] = useState(true);

  // PDF download state
  const [isDownloading, setIsDownloading] =
    useState(false);

  const [downloadError, setDownloadError] =
    useState("");


  /*
   * Load document + analysis + risks
   */
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    Promise.all([
      getDocument(id),
      getAnalysis(id),
      getRisks(id),
    ])
      .then(([d, a, r]) => {
        setDoc(d);
        setAnalysis(a);
        setRisks(r);
      })
      .catch((error) => {
        console.error(
          "Failed to load analysis:",
          error
        );

        setDoc(null);
        setAnalysis(null);
        setRisks([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);


  /*
   * Download Contract Analysis PDF
   */
  const handleDownloadPdf = async () => {
    if (!id || isDownloading) {
      return;
    }

    try {
      setIsDownloading(true);
      setDownloadError("");

      await downloadSummaryPdf(id);
    } catch (error) {
      console.error(
        "PDF download failed:",
        error
      );

      if (error instanceof Error) {
        setDownloadError(error.message);
      } else {
        setDownloadError(
          "Failed to download the contract analysis PDF."
        );
      }
    } finally {
      setIsDownloading(false);
    }
  };


  /*
   * Loading state
   */
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "50vh",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            border: "3px solid #E2E8F0",
            borderTopColor: "#1E3A8A",
            borderRadius: "50%",
            animation:
              "spin 0.7s linear infinite",
          }}
        />

        <style>
          {`
            @keyframes spin {
              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
      </div>
    );
  }


  /*
   * Analysis not found
   */
  if (!doc || !analysis) {
    return (
      <EmptyState
        title="Analysis not found"
        description="We could not load the analysis for this document."
        action={
          <button
            onClick={() =>
              navigate("/documents")
            }
            style={{
              padding: "8px 20px",
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
            Back to Documents
          </button>
        }
      />
    );
  }


  /*
   * Risk groups
   */
  const highRisks = risks.filter(
    (r) => r.severity === "high"
  );

  const medRisks = risks.filter(
    (r) => r.severity === "medium"
  );

  const lowRisks = risks.filter(
    (r) => r.severity === "low"
  );


  /*
   * Prevent division by zero
   */
  const totalRiskCount =
    analysis.risksCount || risks.length || 0;


  return (
    <div>

      {/* =====================================================
          DOCUMENT HEADER
          ===================================================== */}

      <div
        style={{
          background: "#FFFFFF",
          borderBottom:
            "1px solid #E2E8F0",
          padding: "16px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >

            {/* Document information */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >

              <Link
                to="/documents"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily:
                    "'Inter', sans-serif",
                  fontSize: 13,
                  color: "#64748B",
                  textDecoration:
                    "none",
                  fontWeight: 500,
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M9 2L4 7l5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                Documents
              </Link>

              <span
                style={{
                  color: "#CBD5E1",
                }}
              >
                /
              </span>

              <div>

                <span
                  style={{
                    fontFamily:
                      "'DM Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: 15,
                    color: "#0F172A",
                  }}
                >
                  {doc.filename}
                </span>

                <span
                  style={{
                    marginLeft: 10,
                    fontFamily:
                      "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: "#94A3B8",
                  }}
                >
                  {doc.fileType} ·{" "}
                  {new Date(
                    doc.uploadDate
                  ).toLocaleDateString(
                    "en-GB",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </span>

              </div>

            </div>


            {/* Header actions */}

            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >

              {/* Download button */}

              <button
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                title={
                  downloadError ||
                  "Download contract analysis PDF"
                }
                style={{
                  padding:
                    "7px 14px",
                  borderRadius: 8,
                  border:
                    "1px solid #E2E8F0",
                  background:
                    isDownloading
                      ? "#F8FAFC"
                      : "white",
                  color:
                    isDownloading
                      ? "#94A3B8"
                      : "#334155",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor:
                    isDownloading
                      ? "not-allowed"
                      : "pointer",
                  fontFamily:
                    "'Inter', sans-serif",
                  display: "flex",
                  alignItems:
                    "center",
                  gap: 7,
                  opacity:
                    isDownloading
                      ? 0.75
                      : 1,
                }}
              >

                {isDownloading ? (
                  <>
                    <span
                      style={{
                        width: 13,
                        height: 13,
                        border:
                          "2px solid #CBD5E1",
                        borderTopColor:
                          "#1E3A8A",
                        borderRadius:
                          "50%",
                        animation:
                          "downloadSpin 0.7s linear infinite",
                      }}
                    />

                    Generating PDF...
                  </>
                ) : (
                  <>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                    >
                      <path
                        d="M6.5 1v8M3 6l3.5 3.5L10 6"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <path
                        d="M1.5 11.5h10"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                      />
                    </svg>

                    Download PDF
                  </>
                )}

              </button>


              {/* Re-analyze */}

              <button
                style={{
                  padding:
                    "7px 14px",
                  borderRadius: 8,
                  border:
                    "1px solid #1E3A8A",
                  background:
                    "white",
                  color: "#1E3A8A",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily:
                    "'Inter', sans-serif",
                }}
              >
                Re-analyze
              </button>

            </div>

          </div>


          {/* Download error */}

          {downloadError && (
            <div
              style={{
                marginTop: 10,
                padding:
                  "9px 12px",
                background:
                  "#FEF2F2",
                border:
                  "1px solid #FECACA",
                borderRadius: 8,
                color: "#B91C1C",
                fontFamily:
                  "'Inter', sans-serif",
                fontSize: 12,
              }}
            >
              <strong>
                PDF download failed:
              </strong>{" "}
              {downloadError}
            </div>
          )}

        </div>
      </div>


      {/* =====================================================
          DOCUMENT SUB NAVIGATION
          ===================================================== */}

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <DocSubNav
          id={id!}
          active="Analysis"
        />
      </div>


      {/* =====================================================
          MAIN BODY
          ===================================================== */}

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "32px 24px",
        }}
      >

        {/* ===================================================
            SUMMARY ROW
            =================================================== */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr auto",
            gap: 24,
            marginBottom: 40,
            alignItems:
              "start",
          }}
        >

          {/* =================================================
              LEFT SIDE
              ================================================= */}

          <div>

            <h2
              style={{
                fontFamily:
                  "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: 22,
                color: "#0F172A",
                margin:
                  "0 0 20px",
                letterSpacing:
                  "-0.3px",
              }}
            >
              Contract Overview
            </h2>


            {/* ===============================================
                STAT CARDS
                =============================================== */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 14,
              }}
            >

              {[
                {
                  label:
                    "Overall Risk",

                  value:
                    analysis.overallRisk.toUpperCase(),

                  color:
                    analysis.overallRisk ===
                    "high"
                      ? "#DC2626"
                      : analysis.overallRisk ===
                        "medium"
                      ? "#D97706"
                      : "#059669",

                  bg:
                    analysis.overallRisk ===
                    "high"
                      ? "#FEF2F2"
                      : analysis.overallRisk ===
                        "medium"
                      ? "#FFFBEB"
                      : "#ECFDF5",
                },

                {
                  label:
                    "Risk Score",
                  value:
                    `${analysis.riskScore} / 100`,
                  color:
                    "#0F172A",
                  bg:
                    "#F8FAFC",
                },

                {
                  label:
                    "Clauses Found",
                  value:
                    analysis.clausesCount,
                  color:
                    "#1E3A8A",
                  bg:
                    "#EFF6FF",
                },

                {
                  label:
                    "Risks Detected",
                  value:
                    analysis.risksCount,
                  color:
                    "#DC2626",
                  bg:
                    "#FEF2F2",
                },

              ].map((card) => (

                <div
                  key={card.label}
                  style={{
                    background:
                      card.bg,

                    border:
                      `1px solid ${
                        card.bg ===
                        "#F8FAFC"
                          ? "#E2E8F0"
                          : card.bg
                      }`,

                    borderRadius: 12,

                    padding:
                      "16px 18px",
                  }}
                >

                  <div
                    style={{
                      fontFamily:
                        "'DM Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: 24,
                      color:
                        card.color,
                      lineHeight: 1,
                    }}
                  >
                    {card.value}
                  </div>

                  <div
                    style={{
                      fontFamily:
                        "'Inter', sans-serif",
                      fontSize: 12,
                      color:
                        "#64748B",
                      marginTop: 4,
                      fontWeight: 500,
                    }}
                  >
                    {card.label}
                  </div>

                </div>

              ))}

            </div>


            {/* ===============================================
                AI SUMMARY
                =============================================== */}

            <div
              style={{
                marginTop: 20,
                padding:
                  "16px 20px",
                background:
                  "#F8FAFF",
                border:
                  "1px solid #C7D2FE",
                borderRadius: 12,
              }}
            >

              <div
                style={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                  gap: 7,
                  marginBottom: 8,
                }}
              >

                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <circle
                    cx="7"
                    cy="7"
                    r="6"
                    fill="#6D28D9"
                    opacity="0.12"
                  />

                  <circle
                    cx="7"
                    cy="7"
                    r="3"
                    fill="#6D28D9"
                  />
                </svg>

                <span
                  style={{
                    fontFamily:
                      "'Inter', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    color:
                      "#5B21B6",
                    letterSpacing:
                      "0.07em",
                    textTransform:
                      "uppercase",
                  }}
                >
                  AI Summary
                </span>

              </div>


              <p
                style={{
                  fontFamily:
                    "'Inter', sans-serif",
                  fontSize: 14,
                  color:
                    "#334155",
                  lineHeight:
                    1.65,
                  margin: 0,
                }}
              >
                {analysis.summary}
              </p>

            </div>


            {/* ===============================================
                RISK DISTRIBUTION
                =============================================== */}

            <div
              style={{
                marginTop: 20,
              }}
            >

              <div
                style={{
                  fontFamily:
                    "'Inter', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  color:
                    "#475569",
                  marginBottom: 10,
                }}
              >
                Risk distribution
              </div>


              <div
                style={{
                  display:
                    "flex",
                  flexDirection:
                    "column",
                  gap: 7,
                }}
              >

                {[
                  {
                    label:
                      "High Risk",
                    count:
                      analysis.highRisks,
                    color:
                      "#DC2626",
                    track:
                      "#FEE2E2",
                  },

                  {
                    label:
                      "Medium Risk",
                    count:
                      analysis.mediumRisks,
                    color:
                      "#D97706",
                    track:
                      "#FEF3C7",
                  },

                  {
                    label:
                      "Low Risk",
                    count:
                      analysis.lowRisks,
                    color:
                      "#059669",
                    track:
                      "#D1FAE5",
                  },

                ].map((row) => (

                  <div
                    key={row.label}
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: 10,
                    }}
                  >

                    <span
                      style={{
                        width: 90,
                        fontFamily:
                          "'Inter', sans-serif",
                        fontSize: 12,
                        color:
                          "#64748B",
                      }}
                    >
                      {row.label}
                    </span>


                    <div
                      style={{
                        flex: 1,
                        height: 6,
                        background:
                          row.track,
                        borderRadius: 3,
                        overflow:
                          "hidden",
                      }}
                    >

                      <div
                        style={{
                          height:
                            "100%",

                          width:
                            totalRiskCount > 0
                              ? `${
                                  (row.count /
                                    totalRiskCount) *
                                  100
                                }%`
                              : "0%",

                          background:
                            row.color,

                          borderRadius: 3,

                          transition:
                            "width 0.6s ease",
                        }}
                      />

                    </div>


                    <span
                      style={{
                        fontFamily:
                          "'JetBrains Mono', monospace",
                        fontSize: 12,
                        color:
                          row.color,
                        fontWeight: 600,
                        width: 16,
                        textAlign:
                          "right",
                      }}
                    >
                      {row.count}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </div>


          {/* =================================================
              RISK SCORE RING
              ================================================= */}

          <div
            style={{
              display:
                "flex",
              flexDirection:
                "column",
              alignItems:
                "center",
              gap: 12,
            }}
          >

            <RiskScoreRing
              score={
                analysis.riskScore
              }
            />

            {doc.riskLevel && (
              <RiskBadge
                level={
                  doc.riskLevel
                }
              />
            )}

          </div>

        </div>


        {/* ===================================================
            RISK ANALYSIS
            =================================================== */}

        <div>

          <h2
            style={{
              fontFamily:
                "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: 20,
              color: "#0F172A",
              margin:
                "0 0 16px",
              letterSpacing:
                "-0.2px",
            }}
          >

            Risk Analysis

            <span
              style={{
                marginLeft: 10,
                fontFamily:
                  "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: 14,
                color:
                  "#94A3B8",
              }}
            >
              {risks.length}{" "}
              {risks.length === 1
                ? "risk"
                : "risks"}{" "}
              identified
            </span>

          </h2>


          {risks.length === 0 ? (

            <EmptyState
              title="No risks detected"
              description="Great news — our AI found no significant risks in this contract."
            />

          ) : (

            <div
              style={{
                display:
                  "flex",
                flexDirection:
                  "column",
                gap: 12,
              }}
            >

              {highRisks.map(
                (r) => (
                  <RiskCard
                    key={r.id}
                    risk={r}
                  />
                )
              )}

              {medRisks.map(
                (r) => (
                  <RiskCard
                    key={r.id}
                    risk={r}
                  />
                )
              )}

              {lowRisks.map(
                (r) => (
                  <RiskCard
                    key={r.id}
                    risk={r}
                  />
                )
              )}

            </div>

          )}

        </div>

      </div>


      {/* =====================================================
          ANIMATIONS
          ===================================================== */}

      <style>
        {`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes downloadSpin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>

    </div>
  );
}