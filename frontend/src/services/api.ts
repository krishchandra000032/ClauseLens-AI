/**
 * ClauseLens AI — FastAPI service layer
 */

import type {
  Document,
  Risk,
  RiskLevel,
  Clause,
  AnalysisResult,
  ChatMessage,
  AskResponse,
} from "../types";
import {
  mockDocuments,
  mockRisks,
  mockClauses,
  mockAnalysis,
  mockChatHistory,
} from "../data/mockData";

const USE_MOCK = false;
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000").replace(/\/$/, "");

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

function delay(ms = 600) {
  return new Promise((r) => setTimeout(r, ms));
}

type BackendDocument = {
  id: string;
  filename: string;
  file_path?: string;
  created_at: string;
  total_clauses?: number;
  total_risks?: number;
};

function fileType(filename: string): Document["fileType"] {
  const extension = filename.split(".").pop()?.toUpperCase();
  return extension === "DOCX" || extension === "DOC" ? extension : "PDF";
}

function riskLevel(score?: number): RiskLevel | undefined {
  if (score === undefined) return undefined;
  return score >= 70 ? "high" : score >= 40 ? "medium" : "low";
}

function toDocument(document: BackendDocument): Document {
  return {
    id: document.id,
    filename: document.filename,
    fileType: fileType(document.filename),
    fileSize: 0,
    uploadDate: document.created_at,
    status: document.total_risks === undefined ? "processing" : "completed",
    clausesCount: document.total_clauses,
    risksCount: document.total_risks,
  };
}

// ── Documents ──────────────────────────────────────────────────────────────────

export async function listDocuments(): Promise<Document[]> {
  if (USE_MOCK) {
    await delay();
    return [...mockDocuments];
  }
  const documents = await request<BackendDocument[]>("/documents/");
  // The list endpoint is intentionally lightweight; hydrate each document so
  // the dashboard can show its saved clause/risk counts.
  const detailedDocuments = await Promise.all(
    documents.map((document) => request<BackendDocument>(`/documents/${document.id}`))
  );
  return detailedDocuments.map(toDocument);
}

export async function getDocument(id: string): Promise<Document> {
  if (USE_MOCK) {
    await delay(300);
    const doc = mockDocuments.find((d) => d.id === id) ?? mockDocuments[0];
    if (!doc) throw new Error("Document not found");
    return doc;
  }
  return toDocument(await request<BackendDocument>(`/documents/${id}`));
}

export async function uploadDocument(file: File): Promise<Document> {
  if (USE_MOCK) {
    await delay(1200);
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      filename: file.name,
      fileType: file.name.endsWith(".docx") ? "DOCX" : "PDF",
      fileSize: file.size,
      uploadDate: new Date().toISOString(),
      status: "processing",
    };
    mockDocuments.unshift(newDoc);
    return newDoc;
  }
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  const uploaded = await res.json() as { document_id: string; original_filename: string; created_at: string };
  return toDocument({
    id: uploaded.document_id,
    filename: uploaded.original_filename,
    created_at: uploaded.created_at,
  });
}

export async function deleteDocument(id: string): Promise<void> {
  if (USE_MOCK) {
    await delay(400);
    const idx = mockDocuments.findIndex((d) => d.id === id);
    if (idx !== -1) mockDocuments.splice(idx, 1);
    return;
  }
  await request(`/documents/${id}`, { method: "DELETE" });
}

// ── Analysis ───────────────────────────────────────────────────────────────────

export async function getAnalysis(documentId: string): Promise<AnalysisResult> {
  if (USE_MOCK) {
    await delay(400);
    return { ...mockAnalysis, documentId };
  }
  const result = await request<{
    document_id: string; overall_risk: RiskLevel; risk_score: number;
    total_clauses: number; total_risks: number; high_risks: number;
    medium_risks: number; low_risks: number; summary: string;
  }>(`/documents/${documentId}/analysis`);
  return {
    documentId: result.document_id,
    overallRisk: result.overall_risk,
    riskScore: result.risk_score,
    clausesCount: result.total_clauses,
    risksCount: result.total_risks,
    highRisks: result.high_risks,
    mediumRisks: result.medium_risks,
    lowRisks: result.low_risks,
    summary: result.summary,
  };
}

export async function triggerAnalysis(documentId: string): Promise<void> {
  if (USE_MOCK) {
    await delay(500);
    return;
  }
  await request(`/documents/${documentId}/analyze`, { method: "POST" });
}

export async function processDocument(documentId: string): Promise<void> {
  if (USE_MOCK) {
    await delay(500);
    return;
  }
  await request(`/documents/${documentId}/process`, { method: "POST" });
}

// ── Risks ──────────────────────────────────────────────────────────────────────

export async function getRisks(documentId: string): Promise<Risk[]> {
  if (USE_MOCK) {
    await delay(350);
    return mockRisks.filter((r) => r.documentId === "doc-001");
  }
  const response = await request<{ risks: Array<{
    id: number; risk_level: string; category: string; title: string;
    explanation: string; reason: string; page: number; text: string;
  }> }>(`/documents/${documentId}/risks`);
  return response.risks.map((risk) => ({
    id: String(risk.id), documentId, title: risk.title, category: risk.category,
    severity: risk.risk_level.toLowerCase() as RiskLevel,
    explanation: risk.explanation, whyRisky: risk.reason, pageNumber: risk.page,
    clauseText: risk.text,
  }));
}

// ── Clauses ────────────────────────────────────────────────────────────────────

export async function getClauses(documentId: string): Promise<Clause[]> {
  if (USE_MOCK) {
    await delay(350);
    return mockClauses.filter((c) => c.documentId === "doc-001");
  }
  const response = await request<{ clauses: Array<{
    id: number; clause_type: string; title: string; summary: string;
    page: number; text: string; chunk_id: string;
  }> }>(`/documents/${documentId}/clauses`);
  return response.clauses.map((clause) => ({
    id: String(clause.id), documentId, title: clause.title,
    category: clause.clause_type as Clause["category"], summary: clause.summary,
    fullText: clause.text, riskLevel: "low", pageNumber: clause.page,
    sourceReference: clause.chunk_id,
  }));
}

// ── Chat ───────────────────────────────────────────────────────────────────────

export async function getChatHistory(documentId: string): Promise<ChatMessage[]> {
  if (USE_MOCK) {
    await delay(300);
    return [...mockChatHistory];
  }
  // Chat history is currently client-side only; FastAPI exposes question answering.
  return [];
}

export async function askQuestion(
  documentId: string,
  question: string
): Promise<AskResponse> {
  if (USE_MOCK) {
    await delay(1400);
    const answers: Record<string, AskResponse> = {
      default: {
        answer:
          "Based on the contract, this is addressed in the relevant section. The agreement provides specific terms and conditions that govern this aspect of the employment relationship. I recommend reviewing the relevant clauses carefully and seeking professional legal advice if you have concerns.",
        citation: {
          page: 4,
          section: "Section 8.2",
          excerpt:
            '"The parties agree that the terms set out herein shall govern the employment relationship in its entirety..."',
        },
      },
    };
    const lq = question.toLowerCase();
    if (lq.includes("notice") || lq.includes("resign")) {
      return {
        answer:
          "The agreement requires three months written notice from the employee to terminate. The employer may elect to make a payment in lieu of notice instead of requiring you to work the full period. Note that you cannot take other employment during the notice period without the employer's written consent.",
        citation: {
          page: 4,
          section: "Section 8.1",
          excerpt:
            '"Either party may terminate this Agreement by giving three (3) months written notice to the other party..."',
        },
      };
    }
    if (lq.includes("non-compete") || lq.includes("competitor")) {
      return {
        answer:
          "Yes, there is a non-compete clause. You are prohibited from working for any competitor or starting a competing business for 24 months after termination, covering the entire UK and any country where the company operates. This is a broad restriction and you should seek legal advice about its enforceability.",
        citation: {
          page: 6,
          section: "Section 12.1",
          excerpt:
            '"For a period of twenty-four (24) months following termination... the Employee shall not directly or indirectly engage in... any business that competes..."',
        },
      };
    }
    if (lq.includes("ip") || lq.includes("intellectual property")) {
      return {
        answer:
          "The IP clause is broad and potentially concerning. It states that any inventions, software, or other IP you create that relates to the company's business — even outside working hours and using personal equipment — is automatically assigned to the employer. There is no carve-out for personal projects.",
        citation: {
          page: 5,
          section: "Section 9.1",
          excerpt:
            '"...whether or not during working hours or using Company resources, that relate to the Company\'s business activities... shall be the exclusive property of the Employer."',
        },
      };
    }
    if (lq.includes("leave") || lq.includes("holiday") || lq.includes("vacation")) {
      return {
        answer:
          "You are entitled to 25 days of paid annual leave per year, plus public holidays. You can carry over a maximum of 5 days to the following leave year with your line manager's approval. Any unused leave beyond this limit is forfeited at the end of the leave year.",
        citation: {
          page: 8,
          section: "Section 15.1",
          excerpt:
            '"The Employee is entitled to 25 days paid annual leave per leave year in addition to the applicable public holidays..."',
        },
      };
    }
    return answers.default;
  }
  const response = await request<{ answer: string; citations: Array<{
    page: number; chunk_id: string; excerpt: string;
  }> }>(`/chat/?document_id=${encodeURIComponent(documentId)}&question=${encodeURIComponent(question)}`, {
    method: "POST",
  });
  const citation = response.citations[0];
  return {
    answer: response.answer,
    citation: {
      page: citation?.page ?? 0,
      section: citation?.chunk_id ?? "Contract",
      excerpt: citation?.excerpt ?? "No source excerpt was returned.",
    },
  };
}
