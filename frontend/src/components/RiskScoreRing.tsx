import type { RiskLevel } from "../types";

interface RiskScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

function riskColor(score: number): { stroke: string; label: string; level: RiskLevel } {
  if (score >= 65) return { stroke: "#DC2626", label: "HIGH RISK", level: "high" };
  if (score >= 35) return { stroke: "#D97706", label: "MEDIUM RISK", level: "medium" };
  return { stroke: "#059669", label: "LOW RISK", level: "low" };
}

export default function RiskScoreRing({
  score,
  size = 180,
  strokeWidth = 14,
}: RiskScoreRingProps) {
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const { stroke, label } = riskColor(score);

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      {/* Center label */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: size * 0.21,
            fontWeight: 700,
            color: stroke,
            lineHeight: 1,
          }}
        >
          {score}
        </span>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: size * 0.075,
            color: "#94A3B8",
            fontWeight: 500,
            letterSpacing: "0.04em",
          }}
        >
          / 100
        </span>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: size * 0.065,
            color: stroke,
            fontWeight: 600,
            letterSpacing: "0.06em",
            marginTop: 2,
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
