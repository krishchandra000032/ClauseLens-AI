import { useState } from "react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: 20,
      }}
    >
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #F1F5F9",
          background: "#FAFBFD",
        }}
      >
        <h2
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: 16,
            color: "#0F172A",
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>
      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
        {children}
      </div>
    </div>
  );
}

function FormField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 16, alignItems: "start" }}>
      <div>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            fontWeight: 500,
            color: "#0F172A",
          }}
        >
          {label}
        </div>
        {hint && (
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              color: "#94A3B8",
              marginTop: 2,
              lineHeight: 1.4,
            }}
          >
            {hint}
          </div>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Input({
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "9px 12px",
        border: "1px solid #E2E8F0",
        borderRadius: 8,
        fontSize: 14,
        fontFamily: "'Inter', sans-serif",
        color: "#0F172A",
        background: "#FFFFFF",
        outline: "none",
      }}
    />
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        background: checked ? "#1E3A8A" : "#CBD5E1",
        border: "none",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s",
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "white",
          position: "absolute",
          top: 3,
          left: checked ? 23 : 3,
          transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      />
    </button>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "9px 12px",
        border: "1px solid #E2E8F0",
        borderRadius: 8,
        fontSize: 14,
        fontFamily: "'Inter', sans-serif",
        color: "#0F172A",
        background: "#FFFFFF",
        outline: "none",
        cursor: "pointer",
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export default function Settings() {
  const [name, setName] = useState("Jane Doe");
  const [email, setEmail] = useState("jane.doe@example.com");
  const [organisation, setOrganisation] = useState("Acme Legal Ltd");
  const [emailNotif, setEmailNotif] = useState(true);
  const [analysisAlerts, setAnalysisAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [language, setLanguage] = useState("en");
  const [riskSensitivity, setRiskSensitivity] = useState("balanced");
  const [citationDetail, setCitationDetail] = useState("section");
  const [saved, setSaved] = useState(false);

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: 32 }}>
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
          Settings
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            color: "#64748B",
            margin: 0,
          }}
        >
          Manage your account, preferences, and AI settings.
        </p>
      </div>

      <Section title="Profile">
        <FormField label="Full name">
          <Input value={name} onChange={setName} placeholder="Your name" />
        </FormField>
        <FormField label="Email address">
          <Input value={email} onChange={setEmail} type="email" placeholder="you@example.com" />
        </FormField>
        <FormField label="Organisation" hint="Used to personalise your analysis context.">
          <Input value={organisation} onChange={setOrganisation} placeholder="Your company or firm" />
        </FormField>
      </Section>

      <Section title="AI Preferences">
        <FormField
          label="Risk sensitivity"
          hint="How aggressively ClauseLens flags potential risks."
        >
          <Select
            value={riskSensitivity}
            onChange={setRiskSensitivity}
            options={[
              { value: "conservative", label: "Conservative — flag more risks" },
              { value: "balanced", label: "Balanced (recommended)" },
              { value: "lenient", label: "Lenient — flag fewer risks" },
            ]}
          />
        </FormField>
        <FormField
          label="Citation detail"
          hint="How precise source citations should be."
        >
          <Select
            value={citationDetail}
            onChange={setCitationDetail}
            options={[
              { value: "page", label: "Page number only" },
              { value: "section", label: "Page and section (recommended)" },
              { value: "paragraph", label: "Paragraph level" },
            ]}
          />
        </FormField>
        <FormField
          label="Analysis language"
          hint="Language for AI-generated explanations."
        >
          <Select
            value={language}
            onChange={setLanguage}
            options={[
              { value: "en", label: "English" },
              { value: "fr", label: "French" },
              { value: "de", label: "German" },
              { value: "es", label: "Spanish" },
            ]}
          />
        </FormField>
      </Section>

      <Section title="Notifications">
        <FormField label="Email notifications" hint="Receive emails when analysis is complete.">
          <Toggle checked={emailNotif} onChange={setEmailNotif} />
        </FormField>
        <FormField label="High-risk alerts" hint="Get notified when a high-risk contract is detected.">
          <Toggle checked={analysisAlerts} onChange={setAnalysisAlerts} />
        </FormField>
        <FormField label="Weekly digest" hint="Receive a weekly summary of your contract activity.">
          <Toggle checked={weeklyDigest} onChange={setWeeklyDigest} />
        </FormField>
      </Section>

      <Section title="Privacy & Data">
        <FormField
          label="Data retention"
          hint="Uploaded contracts are retained for 90 days by default."
        >
          <Select
            value="90"
            onChange={() => {}}
            options={[
              { value: "30", label: "30 days" },
              { value: "90", label: "90 days" },
              { value: "365", label: "1 year" },
              { value: "-1", label: "Until manually deleted" },
            ]}
          />
        </FormField>
        <FormField label="Delete all documents" hint="Permanently remove all uploaded contracts and analyses.">
          <button
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #FECACA",
              background: "#FEF2F2",
              color: "#DC2626",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Delete all data
          </button>
        </FormField>
      </Section>

      {/* Save */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <button
          style={{
            padding: "10px 20px",
            borderRadius: 9,
            border: "1px solid #E2E8F0",
            background: "white",
            color: "#475569",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Discard
        </button>
        <button
          onClick={save}
          style={{
            padding: "10px 24px",
            borderRadius: 9,
            background: saved ? "#059669" : "#1E3A8A",
            color: "white",
            border: "none",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "-0.2px",
            transition: "background 0.2s",
          }}
        >
          {saved ? "Saved ✓" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
