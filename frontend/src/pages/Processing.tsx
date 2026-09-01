import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProgressStepper from "../components/ProgressStepper";
import type { ProcessingStep } from "../types";
import { processDocument, triggerAnalysis } from "../services/api";

const STEPS: ProcessingStep[] = [
  { id: "upload", label: "Uploading document", status: "pending" },
  { id: "extract", label: "Extracting text", status: "pending" },
  { id: "ocr", label: "Running OCR", status: "pending" },
  { id: "embed", label: "Creating embeddings", status: "pending" },
  { id: "clauses", label: "Analyzing clauses", status: "pending" },
  { id: "risks", label: "Detecting risks", status: "pending" },
  { id: "report", label: "Preparing report", status: "pending" },
];

function advanceSteps(
  steps: ProcessingStep[],
  activeIdx: number
): ProcessingStep[] {
  return steps.map((s, i) => ({
    ...s,
    status: i < activeIdx ? "done" : i === activeIdx ? "active" : "pending",
  }));
}

export default function Processing() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [steps, setSteps] = useState<ProcessingStep[]>(advanceSteps(STEPS, 0));
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (!id) return;
    const documentId = id;
    let cancelled = false;

    async function runAnalysis() {
      try {
        await processDocument(documentId);
        if (!cancelled) setActiveIdx(3);
        await triggerAnalysis(documentId);
        if (!cancelled) setActiveIdx(STEPS.length);
      } catch (error) {
        console.error("Document processing failed", error);
      }
    }

    void runAnalysis();
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    if (activeIdx >= STEPS.length) {
      setTimeout(() => navigate(`/documents/${id}/analysis`), 800);
      return;
    }
    // The real API advances the final stages. These timings only animate the
    // upload/extraction portion while the backend is working.
    if (activeIdx >= 3) return;
    const delay = activeIdx === 0 ? 800 : 1000;
    const timer = setTimeout(() => {
      setActiveIdx((i) => i + 1);
      setSteps(advanceSteps(STEPS, activeIdx + 1));
    }, delay);
    return () => clearTimeout(timer);
  }, [activeIdx, id, navigate]);

  const percent = Math.round((activeIdx / STEPS.length) * 100);
  const done = activeIdx >= STEPS.length;

  return (
    <div
      style={{
        minHeight: "calc(100vh - 60px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: 20,
          padding: "48px 56px",
          width: "100%",
          maxWidth: 480,
          boxShadow: "0 8px 32px rgba(15,23,42,0.06)",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            width: 56,
            height: 56,
            background: "#1E3A8A",
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <rect x="3" y="1" width="15" height="20" rx="2" fill="white" opacity="0.25" />
            <rect x="3" y="1" width="15" height="20" rx="2" stroke="white" strokeWidth="1.5" />
            <path d="M7 7h7M7 11h7M7 15h4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="19" cy="19" r="5" fill="#1E3A8A" stroke="white" strokeWidth="1.5" />
            <path d="M22 22l2 2" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>

        <h2
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: 22,
            color: "#0F172A",
            margin: "0 0 6px",
            letterSpacing: "-0.3px",
          }}
        >
          {done ? "Analysis complete!" : "Analyzing your contract…"}
        </h2>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            color: "#64748B",
            margin: "0 0 32px",
            lineHeight: 1.55,
          }}
        >
          {done
            ? "Your contract has been analyzed. Redirecting to results."
            : "ClauseLens AI is analyzing your contract. This may take a moment."}
        </p>

        {/* Progress bar */}
        <div
          style={{
            height: 4,
            background: "#E2E8F0",
            borderRadius: 2,
            marginBottom: 32,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${percent}%`,
              background: done ? "#059669" : "#1E3A8A",
              borderRadius: 2,
              transition: "width 0.5s ease",
            }}
          />
        </div>

        <ProgressStepper steps={steps} />

        {!done && (
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              color: "#94A3B8",
              margin: "28px 0 0",
              textAlign: "center",
            }}
          >
            This typically takes 15–30 seconds for most contracts.
          </p>
        )}
      </div>
    </div>
  );
}
