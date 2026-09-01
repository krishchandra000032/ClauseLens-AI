import type { RiskLevel } from "../types";

interface RiskBadgeProps {
  level: RiskLevel;
  size?: "sm" | "md";
}

const config: Record<RiskLevel, { label: string; color: string; bg: string; dot: string }> = {
  high: {
    label: "High Risk",
    color: "#DC2626",
    bg: "#FEF2F2",
    dot: "#DC2626",
  },
  medium: {
    label: "Medium Risk",
    color: "#B45309",
    bg: "#FEF3C7",
    dot: "#D97706",
  },
  low: {
    label: "Low Risk",
    color: "#065F46",
    bg: "#D1FAE5",
    dot: "#059669",
  },
};

export default function RiskBadge({ level, size = "md" }: RiskBadgeProps) {
  const c = config[level];
  const isSmall = size === "sm";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: isSmall ? 4 : 5,
        padding: isSmall ? "2px 7px" : "3px 9px",
        borderRadius: 20,
        background: c.bg,
        color: c.color,
        fontSize: isSmall ? 11 : 12,
        fontWeight: 600,
        fontFamily: "'Inter', sans-serif",
        letterSpacing: "0.01em",
        lineHeight: 1,
      }}
    >
      <span
        style={{
          width: isSmall ? 5 : 6,
          height: isSmall ? 5 : 6,
          borderRadius: "50%",
          background: c.dot,
          flexShrink: 0,
        }}
      />
      {c.label}
    </span>
  );
}
