import { useState, useRef, useCallback } from "react";

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  loading?: boolean;
}

const ACCEPTED = [".pdf", ".docx", ".doc"];

export default function UploadDropzone({ onFileSelect, loading }: UploadDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !loading && inputRef.current?.click()}
      style={{
        border: `2px dashed ${dragging ? "#1E3A8A" : "#CBD5E1"}`,
        borderRadius: 16,
        background: dragging ? "#EFF6FF" : "#FAFBFD",
        padding: "48px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        cursor: loading ? "default" : "pointer",
        transition: "all 0.2s",
        textAlign: "center",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
        }}
      />

      {/* Document icon */}
      <div
        style={{
          width: 60,
          height: 60,
          background: "#EFF6FF",
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="4" y="2" width="16" height="21" rx="2" fill="#BFDBFE" />
          <rect x="4" y="2" width="16" height="21" rx="2" stroke="#1E3A8A" strokeWidth="1.5" />
          <path d="M8 9h8M8 13h8M8 17h5" stroke="#1E3A8A" strokeWidth="1.5" strokeLinecap="round" />
          <path
            d="M17 3l7 7"
            stroke="#1E3A8A"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path d="M17 3v6a1 1 0 001 1h6" fill="#BFDBFE" stroke="#1E3A8A" strokeWidth="1.3" />
        </svg>
      </div>

      <div>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: 16,
            color: "#0F172A",
            margin: 0,
          }}
        >
          Drop your contract here
        </p>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            color: "#64748B",
            margin: "4px 0 0",
          }}
        >
          Upload PDF, DOCX, or scanned documents
        </p>
      </div>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
        style={{
          padding: "9px 20px",
          borderRadius: 8,
          background: "#1E3A8A",
          color: "white",
          border: "none",
          fontSize: 14,
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
          cursor: "pointer",
          pointerEvents: loading ? "none" : "auto",
          opacity: loading ? 0.6 : 1,
        }}
      >
        Browse Files
      </button>

      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 12,
          color: "#94A3B8",
          margin: 0,
        }}
      >
        Supported formats: PDF, DOCX, DOC &nbsp;·&nbsp; Maximum 50 MB
      </p>
    </div>
  );
}
