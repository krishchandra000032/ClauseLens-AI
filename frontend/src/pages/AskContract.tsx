import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import type { ChatMessage } from "../types";
import { getChatHistory, askQuestion } from "../services/api";

const SUGGESTED_QUESTIONS = [
  "What is the termination notice period?",
  "What penalties apply if I resign early?",
  "Is there a non-compete clause?",
  "Who owns intellectual property?",
  "What happens after termination?",
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

function UserBubble({ msg }: { msg: ChatMessage }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <div
        className="chat-user"
        style={{
          maxWidth: "72%",
          padding: "11px 16px",
          fontFamily: "'Inter', sans-serif",
          fontSize: 14,
          lineHeight: 1.6,
        }}
      >
        {msg.content}
      </div>
    </div>
  );
}

function AssistantBubble({ msg, onCopy }: { msg: ChatMessage; onCopy: (text: string) => void }) {
  const [copied, setCopied] = useState(false);
  const [helpful, setHelpful] = useState<null | boolean>(null);

  function copy(text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
    onCopy(text);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: "85%" }}>
      <div
        className="chat-ai"
        style={{
          padding: "14px 18px",
          fontFamily: "'Inter', sans-serif",
          fontSize: 14,
          lineHeight: 1.7,
          color: "#0F172A",
        }}
      >
        {/* AI indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <div
            style={{
              width: 20,
              height: 20,
              background: "linear-gradient(135deg, #1E3A8A, #6D28D9)",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="5" cy="5" r="2.5" fill="white" />
            </svg>
          </div>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              fontWeight: 700,
              color: "#6D28D9",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
            }}
          >
            ClauseLens AI
          </span>
        </div>
        {msg.content}
      </div>

      {/* Citation card */}
      {msg.citation && (
        <div
          style={{
            background: "#F8FAFF",
            border: "1px solid #C7D2FE",
            borderRadius: 10,
            padding: "12px 14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 14 }}>📌</span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                color: "#4338CA",
                letterSpacing: "0.07em",
                textTransform: "uppercase",
              }}
            >
              Source
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "#64748B",
                marginLeft: "auto",
              }}
            >
              Page {msg.citation.page} · {msg.citation.section}
            </span>
          </div>
          <blockquote
            style={{
              margin: 0,
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              color: "#334155",
              fontStyle: "italic",
              lineHeight: 1.6,
              padding: "8px 12px",
              background: "#FFFFFF",
              borderRadius: 6,
              border: "1px solid #E0E7FF",
            }}
          >
            {msg.citation.excerpt}
          </blockquote>

          {/* Actions */}
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            <ActionBtn
              onClick={() => copy(msg.content)}
              label={copied ? "Copied!" : "Copy answer"}
            />
            <ActionBtn
              onClick={() => copy(`Page ${msg.citation!.page} · ${msg.citation!.section}\n${msg.citation!.excerpt}`)}
              label="Copy citation"
            />
            <ActionBtn onClick={() => {}} label="View source" />
            <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
              <FeedbackBtn
                active={helpful === true}
                onClick={() => setHelpful(true)}
                label="👍"
              />
              <FeedbackBtn
                active={helpful === false}
                onClick={() => setHelpful(false)}
                label="👎"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "4px 10px",
        borderRadius: 6,
        border: "1px solid #E2E8F0",
        background: "white",
        color: "#475569",
        fontSize: 12,
        fontWeight: 500,
        cursor: "pointer",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {label}
    </button>
  );
}

function FeedbackBtn({
  onClick,
  label,
  active,
}: {
  onClick: () => void;
  label: string;
  active: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "4px 8px",
        borderRadius: 6,
        border: `1px solid ${active ? "#BFDBFE" : "#E2E8F0"}`,
        background: active ? "#EFF6FF" : "white",
        cursor: "pointer",
        fontSize: 13,
      }}
    >
      {label}
    </button>
  );
}

export default function AskContract() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    getChatHistory(id).then(setMessages).finally(() => setInitialLoading(false));
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(question: string) {
    if (!question.trim() || loading || !id) return;
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: question,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const resp = await askQuestion(id, question);
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: resp.answer,
        citation: resp.citation,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 60px)" }}>
      {/* Doc header */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", padding: "16px 24px", flexShrink: 0 }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <Link to="/documents" style={{ fontSize: 13, color: "#64748B", textDecoration: "none", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
            ← Documents
          </Link>
          <span style={{ color: "#CBD5E1" }}>/</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15, color: "#0F172A" }}>Ask Contract</span>
        </div>
      </div>

      <div style={{ flexShrink: 0, maxWidth: 860, margin: "0 auto", width: "100%", padding: "0 24px" }}>
        <DocSubNav id={id!} active="Ask Contract" />
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, overflow: "auto", padding: "0 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", paddingTop: 28, paddingBottom: 16 }}>
          {/* Header */}
          {messages.length === 0 && !initialLoading && (
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <h2
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 26,
                  color: "#0F172A",
                  margin: "0 0 8px",
                  letterSpacing: "-0.3px",
                }}
              >
                Ask Your Contract
              </h2>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 15,
                  color: "#64748B",
                  margin: "0 0 32px",
                }}
              >
                Ask questions about this document and get answers grounded in
                the contract.
              </p>
              {/* Suggested questions */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 20,
                      border: "1px solid #E2E8F0",
                      background: "white",
                      color: "#334155",
                      fontSize: 13,
                      cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "#EFF6FF";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "#BFDBFE";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "white";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0";
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {messages.map((msg) =>
              msg.role === "user" ? (
                <UserBubble key={msg.id} msg={msg} />
              ) : (
                <AssistantBubble key={msg.id} msg={msg} onCopy={() => {}} />
              )
            )}
            {loading && (
              <div style={{ display: "flex", gap: 5, padding: "10px 0" }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#CBD5E1",
                      animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
                <style>{`@keyframes bounce { 0%,80%,100%{transform:scale(0.8);opacity:0.4} 40%{transform:scale(1.2);opacity:1} }`}</style>
              </div>
            )}
          </div>
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Suggested questions (after first message) */}
      {messages.length > 0 && (
        <div style={{ padding: "8px 24px", background: "#FAFBFD", borderTop: "1px solid #F1F5F9", flexShrink: 0 }}>
          <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", gap: 7, flexWrap: "wrap" }}>
            {SUGGESTED_QUESTIONS.slice(0, 3).map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 14,
                  border: "1px solid #E2E8F0",
                  background: "white",
                  color: "#475569",
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div
        style={{
          padding: "16px 24px",
          background: "#FFFFFF",
          borderTop: "1px solid #E2E8F0",
          flexShrink: 0,
        }}
      >
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              gap: 10,
              border: "2px solid #E2E8F0",
              borderRadius: 14,
              padding: "6px 8px",
              background: "#FFFFFF",
              transition: "border-color 0.15s",
            }}
            onFocusCapture={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "#1E3A8A";
            }}
            onBlurCapture={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "#E2E8F0";
            }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="Ask anything about this contract…"
              rows={1}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                resize: "none",
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                color: "#0F172A",
                background: "transparent",
                padding: "6px 8px",
                lineHeight: 1.5,
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              style={{
                padding: "8px 16px",
                borderRadius: 10,
                background: input.trim() && !loading ? "#1E3A8A" : "#E2E8F0",
                color: input.trim() && !loading ? "white" : "#94A3B8",
                border: "none",
                cursor: input.trim() && !loading ? "pointer" : "default",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                alignSelf: "flex-end",
                transition: "all 0.15s",
              }}
            >
              Send
            </button>
          </div>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              color: "#94A3B8",
              textAlign: "center",
              margin: "8px 0 0",
            }}
          >
            ClauseLens AI provides informational analysis and is not a substitute for professional legal advice.
          </p>
        </div>
      </div>
    </div>
  );
}
