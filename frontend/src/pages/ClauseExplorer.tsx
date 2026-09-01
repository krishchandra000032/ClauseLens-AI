import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ClauseCard from "../components/ClauseCard";
import EmptyState from "../components/EmptyState";
import type { Clause, ClauseCategory } from "../types";
import { getClauses } from "../services/api";

const CATEGORIES: ClauseCategory[] = [
  "All",
  "Termination",
  "Compensation",
  "Confidentiality",
  "Intellectual Property",
  "Non-Compete",
  "Leave",
  "Dispute Resolution",
  "Other",
];

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

export default function ClauseExplorer() {
  const { id } = useParams<{ id: string }>();
  const [clauses, setClauses] = useState<Clause[]>([]);
  const [category, setCategory] = useState<ClauseCategory>("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getClauses(id).then(setClauses).finally(() => setLoading(false));
  }, [id]);

  const filtered = clauses.filter((c) => {
    const catMatch = category === "All" || c.category === category;
    const searchMatch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.summary.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  const countFor = (cat: ClauseCategory) =>
    cat === "All" ? clauses.length : clauses.filter((c) => c.category === cat).length;

  return (
    <div>
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", padding: "16px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link to="/documents" style={{ fontSize: 13, color: "#64748B", textDecoration: "none", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
              ← Documents
            </Link>
            <span style={{ color: "#CBD5E1" }}>/</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15, color: "#0F172A" }}>
              Clause Explorer
            </span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <DocSubNav id={id!} active="Clauses" />
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "220px 1fr", gap: 24 }}>
        {/* Sidebar */}
        <aside>
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: 12,
              padding: "8px 0",
              position: "sticky",
              top: 80,
            }}
          >
            <div
              style={{
                padding: "8px 16px 10px",
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                color: "#94A3B8",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Categories
            </div>
            {CATEGORIES.map((cat) => {
              const count = countFor(cat);
              if (count === 0 && cat !== "All") return null;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    width: "100%",
                    padding: "8px 16px",
                    border: "none",
                    background: category === cat ? "#EFF6FF" : "transparent",
                    color: category === cat ? "#1E3A8A" : "#475569",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13.5,
                    fontWeight: category === cat ? 600 : 400,
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {cat}
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      color: category === cat ? "#1E3A8A" : "#94A3B8",
                      background: category === cat ? "#DBEAFE" : "#F1F5F9",
                      padding: "1px 6px",
                      borderRadius: 10,
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main */}
        <div>
          {/* Search */}
          <div style={{ position: "relative", marginBottom: 20 }}>
            <svg
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
            >
              <circle cx="6.5" cy="6.5" r="5" stroke="#94A3B8" strokeWidth="1.3" />
              <path d="M11 11l2.5 2.5" stroke="#94A3B8" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clauses…"
              style={{
                width: "100%",
                padding: "10px 14px 10px 36px",
                border: "1px solid #E2E8F0",
                borderRadius: 9,
                fontSize: 14,
                fontFamily: "'Inter', sans-serif",
                color: "#0F172A",
                background: "#FFFFFF",
                outline: "none",
              }}
            />
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ height: 100, background: "#F1F5F9", borderRadius: 12, animation: "pulse 1.5s ease-in-out infinite" }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              title={search ? "No matching clauses" : "No clauses in this category"}
              description={search ? `No clauses match "${search}".` : "This document does not have clauses in this category."}
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filtered.map((clause) => (
                <ClauseCard key={clause.id} clause={clause} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
