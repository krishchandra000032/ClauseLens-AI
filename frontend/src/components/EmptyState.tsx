interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 24px",
        textAlign: "center",
        gap: 12,
      }}
    >
      {icon && (
        <div
          style={{
            width: 56,
            height: 56,
            background: "#F1F5F9",
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 4,
          }}
        >
          {icon}
        </div>
      )}
      <h3
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          fontSize: 18,
          color: "#0F172A",
          margin: 0,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 14,
          color: "#64748B",
          margin: 0,
          maxWidth: 360,
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  );
}
