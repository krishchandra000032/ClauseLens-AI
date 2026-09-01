import type { ProcessingStep } from "../types";

interface ProgressStepperProps {
  steps: ProcessingStep[];
}

export default function ProgressStepper({ steps }: ProgressStepperProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {steps.map((step, i) => {
        const isDone = step.status === "done";
        const isActive = step.status === "active";

        return (
          <div key={step.id} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            {/* Line + icon column */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isDone ? "#D1FAE5" : isActive ? "#EFF6FF" : "#F1F5F9",
                  border: `2px solid ${isDone ? "#059669" : isActive ? "#1E3A8A" : "#E2E8F0"}`,
                  flexShrink: 0,
                  zIndex: 1,
                  position: "relative",
                }}
              >
                {isDone ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2.5 7l3 3 6-6"
                      stroke="#059669"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : isActive ? (
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      border: "2px solid #1E3A8A",
                      borderTopColor: "transparent",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#CBD5E1",
                    }}
                  />
                )}
              </div>
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  style={{
                    width: 2,
                    height: 28,
                    background: isDone ? "#A7F3D0" : "#E2E8F0",
                    marginTop: 0,
                  }}
                />
              )}
            </div>

            {/* Label */}
            <div style={{ paddingTop: 5, paddingBottom: i < steps.length - 1 ? 12 : 0 }}>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  fontWeight: isActive ? 600 : isDone ? 500 : 400,
                  color: isDone ? "#059669" : isActive ? "#0F172A" : "#94A3B8",
                }}
              >
                {step.label}
              </span>
              {isActive && (
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    color: "#64748B",
                    marginTop: 2,
                  }}
                >
                  In progress…
                </div>
              )}
            </div>
          </div>
        );
      })}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
