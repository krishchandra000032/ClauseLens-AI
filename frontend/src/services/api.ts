import { getAccessToken } from "./auth";
import type {
  AnalysisResult as AppAnalysisResult,
  AskResponse as AppAskResponse,
  ChatMessage as AppChatMessage,
  Clause as AppClause,
  Document as AppDocument,
  Risk as AppRisk,
  RiskLevel,
} from "../types";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

function getApiHeaders(
  headers?: HeadersInit,
  accept = "application/json"
): Headers {
  const result = new Headers(headers);
  result.set("Accept", accept);

  const token = getAccessToken();

  if (token) {
    result.set("Authorization", `Bearer ${token}`);
  }

  return result;
}

/* =========================================================
   TYPES
========================================================= */

export interface UploadResponse {
  message: string;
  document: {
    id: string;
    filename: string;
    user_id: number;
    file_path: string;
    created_at?: string;
  };
}

export interface ProcessResponse {
  document_id: string;
  status?: string;
  message?: string;
  text?: string;
}

export interface Clause {
  id?: string;
  document_id?: string;
  clause_type?: string;
  title?: string;
  summary?: string;
  text?: string;
  page?: number;
  chunk_id?: string;
  key_points?: string[];
}

export interface Risk {
  id?: string;
  document_id?: string;
  risk_level?: string;
  score?: number;
  category?: string;
  title?: string;
  explanation?: string;
  reason?: string;
  text?: string;
  page?: number;
  chunk_id?: string;
}

export interface AnalysisResponse {
  document_id: string;
  overall_risk: string;
  risk_score: number;
  total_clauses: number;
  total_risks: number;
  high_risks?: number;
  medium_risks?: number;
  low_risks?: number;
  summary?: string;
  ai_summary?: string;
  clauses?: Clause[];
  risks?: Risk[];
}

export interface DocumentResponse {
  id?: string;
  document_id?: string;
  filename?: string;
  file_name?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  overall_risk?: string;
  risk_score?: number;
  total_clauses?: number;
  total_risks?: number;
  summary?: string;
}

export interface ChatRequest {
  question: string;
}

export interface ChatResponse {
  answer?: string;
  response?: string;
  message?: string;

  sources?: Array<{
    page?: number;
    text?: string;
    chunk_id?: string;
  }>;
}

interface BackendAnalysisSummary {
  document_id: string;
  overall_risk: string;
  risk_score: number;
  total_clauses: number;
  total_risks: number;
  high_risks?: number;
  medium_risks?: number;
  low_risks?: number;
  summary?: string;
}

function getRiskLevel(
  value?: string,
  score?: number
): RiskLevel {
  const normalized = value?.toLowerCase();

  if (
    normalized === "high" ||
    normalized === "medium" ||
    normalized === "low"
  ) {
    return normalized;
  }

  return (score ?? 0) >= 70
    ? "high"
    : (score ?? 0) >= 40
      ? "medium"
      : "low";
}

function toDocument(
  document: DocumentResponse,
  fileSize = 0,
  status?: AppDocument["status"]
): AppDocument {
  const filename =
    document.filename ||
    document.file_name ||
    "Untitled contract";

  const extension =
    filename.split(".").pop()?.toUpperCase();

  const resolvedStatus =
    status ||
    (
      document.status === "failed"
        ? "failed"
        : document.status === "pending"
          ? "pending"
          : document.status === "processing"
            ? "processing"
            : "completed"
    );

  return {
    id: document.id || document.document_id || "",
    filename,
    fileType:
      extension === "DOCX" || extension === "DOC"
        ? extension
        : "PDF",
    fileSize,
    uploadDate:
      document.created_at ||
      document.updated_at ||
      new Date().toISOString(),
    status: resolvedStatus,
    riskScore: document.risk_score,
    riskLevel: document.overall_risk
      ? getRiskLevel(
          document.overall_risk,
          document.risk_score
        )
      : undefined,
    clausesCount: document.total_clauses,
    risksCount: document.total_risks,
  };
}

function toRisk(
  documentId: string,
  risk: Risk
): AppRisk {
  return {
    id:
      risk.id ||
      `${documentId}-${risk.title || "risk"}`,
    documentId,
    title:
      risk.title ||
      risk.category ||
      "Potential risk",
    category: risk.category || "Other",
    severity: getRiskLevel(
      risk.risk_level,
      risk.score
    ),
    explanation:
      risk.explanation ||
      risk.reason ||
      "",
    pageNumber: risk.page || 0,
    whyRisky:
      risk.reason ||
      risk.explanation ||
      "",
    clauseText: risk.text,
  };
}

function toClause(
  documentId: string,
  clause: Clause
): AppClause {
  const validCategories = [
    "Termination",
    "Compensation",
    "Confidentiality",
    "Intellectual Property",
    "Non-Compete",
    "Leave",
    "Dispute Resolution",
    "Other",
  ];

  const category = validCategories.includes(
    clause.clause_type || ""
  )
    ? clause.clause_type as AppClause["category"]
    : "Other";

  return {
    id:
      clause.id ||
      `${documentId}-${clause.title || "clause"}`,
    documentId,
    title: clause.title || category,
    category,
    summary: clause.summary || "",
    fullText: clause.text || "",
    riskLevel: "low",
    pageNumber: clause.page || 0,
    sourceReference: clause.chunk_id || "",
    keyPoints: clause.key_points || [],
  };
}

/* =========================================================
   ERROR HANDLER
========================================================= */

async function handleResponse<T>(
  response: Response
): Promise<T> {
  if (!response.ok) {
    let errorMessage =
      `Request failed with status ${response.status}`;

    try {
      const errorData = await response.json();

      if (errorData?.detail) {
        errorMessage =
          typeof errorData.detail === "string"
            ? errorData.detail
            : JSON.stringify(errorData.detail);
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // Response was not JSON
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

/* =========================================================
   GENERIC FETCH
========================================================= */

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: getApiHeaders(options.headers),
    }
  );

  return handleResponse<T>(response);
}

/* =========================================================
   UPLOAD DOCUMENT
========================================================= */

export async function uploadDocument(
  file: File
): Promise<AppDocument> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/documents/upload`,
    {
      method: "POST",
      body: formData,
      headers: getApiHeaders(),
    }
  );

  const uploaded =
    await handleResponse<UploadResponse>(response);

  return toDocument(
    {
      id: uploaded.document.id,
      filename: uploaded.document.filename,
      created_at: uploaded.document.created_at,
      status: "processing",
    },
    file.size,
    "processing"
  );
}

/* =========================================================
   DOCUMENTS
========================================================= */

export async function listDocuments(): Promise<AppDocument[]> {
  const documents =
    await apiFetch<DocumentResponse[]>(
      "/documents"
    );

  return documents.map((document) =>
    toDocument(document)
  );
}

export async function deleteDocument(
  documentId: string
): Promise<void> {
  await apiFetch<void>(
    `/documents/${encodeURIComponent(documentId)}`,
    {
      method: "DELETE",
    }
  );
}

/* =========================================================
   ANALYZE DOCUMENT
========================================================= */

export async function analyzeDocument(
  documentId: string
): Promise<AnalysisResponse> {
  return apiFetch<AnalysisResponse>(
    `/documents/${encodeURIComponent(documentId)}/analyze`,
    {
      method: "POST",
    }
  );
}

export async function triggerAnalysis(
  documentId: string
): Promise<void> {
  await analyzeDocument(documentId);
}

/* =========================================================
   GET DOCUMENT
========================================================= */

export async function getDocument(
  documentId: string
): Promise<AppDocument> {
  const [document, analysis] =
    await Promise.all([
      apiFetch<DocumentResponse>(
        `/documents/${encodeURIComponent(documentId)}`
      ),

      apiFetch<BackendAnalysisSummary>(
        `/documents/${encodeURIComponent(documentId)}/analysis`
      ).catch(() => null),
    ]);

  return toDocument({
    ...document,
    ...analysis,
  });
}

/* =========================================================
   GET ANALYSIS
========================================================= */

export async function getAnalysis(
  documentId: string
): Promise<AppAnalysisResult> {
  const result =
    await apiFetch<BackendAnalysisSummary>(
      `/documents/${encodeURIComponent(documentId)}/analysis`
    );

  return {
    documentId: result.document_id,
    overallRisk: getRiskLevel(
      result.overall_risk,
      result.risk_score
    ),
    riskScore: result.risk_score,
    clausesCount: result.total_clauses,
    risksCount: result.total_risks,
    highRisks: result.high_risks || 0,
    mediumRisks: result.medium_risks || 0,
    lowRisks: result.low_risks || 0,
    summary: result.summary || "",
  };
}

/* =========================================================
   GET CLAUSES
========================================================= */

export async function getClauses(
  documentId: string
): Promise<AppClause[]> {
  const response =
    await apiFetch<{ clauses: Clause[] }>(
      `/documents/${encodeURIComponent(documentId)}/clauses`
    );

  return (response.clauses || []).map(
    (clause) => toClause(documentId, clause)
  );
}

/* =========================================================
   GET RISKS
========================================================= */

export async function getRisks(
  documentId: string
): Promise<AppRisk[]> {
  const response =
    await apiFetch<{ risks: Risk[] }>(
      `/documents/${encodeURIComponent(documentId)}/risks`
    );

  return (response.risks || []).map(
    (risk) => toRisk(documentId, risk)
  );
}

/* =========================================================
   DOWNLOAD SUMMARY PDF
========================================================= */

export async function downloadSummaryPDF(
  documentId: string
): Promise<Blob> {
  const response = await fetch(
    `${API_BASE_URL}/reports/${documentId}/summary`,
    {
      method: "GET",
      headers: getApiHeaders(
        undefined,
        "application/pdf"
      ),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Unable to download PDF"
    );
  }

  return response.blob();
}

export async function downloadSummary(
  documentId: string
): Promise<void> {
  const blob =
    await downloadSummaryPDF(documentId);

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download =
    "ClauseLens_Contract_Analysis_Summary.pdf";

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}

export async function downloadSummaryPdf(
  documentId: string
): Promise<void> {
  return downloadSummary(documentId);
}

/* =========================================================
   ASK CONTRACT
========================================================= */

export async function askContract(
  documentId: string,
  question: string
): Promise<ChatResponse> {
  const result =
    await askQuestion(
      documentId,
      question
    );

  return {
    answer: result.answer,
    sources: result.citation
      ? [
          {
            page: result.citation.page,
            text: result.citation.excerpt,
            chunk_id: result.citation.section,
          },
        ]
      : [],
  };
}

export async function getChatHistory(
  _documentId: string
): Promise<AppChatMessage[]> {
  return [];
}

export async function askQuestion(
  documentId: string,
  question: string
): Promise<AppAskResponse> {
  const query = new URLSearchParams({
    document_id: documentId,
    question,
  });

  const result =
    await apiFetch<{
      answer: string;
      citations?: Array<{
        page?: number | string;
        chunk_id?: string;
        excerpt?: string;
      }>;
    }>(
      `/chat/?${query.toString()}`,
      {
        method: "POST",
      }
    );

  const citation =
    result.citations?.[0];

  const parsedPage =
    Number(citation?.page);

  return {
    answer: result.answer,
    citation: {
      page: Number.isFinite(parsedPage)
        ? parsedPage
        : 0,
      section:
        citation?.chunk_id ||
        "Contract",
      excerpt:
        citation?.excerpt ||
        "No source excerpt was returned.",
    },
  };
}

/* =========================================================
   HEALTH CHECK
========================================================= */

export async function checkBackend(): Promise<boolean> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/health`,
      {
        method: "GET",
      }
    );

    return response.ok;
  } catch {
    return false;
  }
}

/* =========================================================
   DEFAULT API OBJECT
========================================================= */

const api = {
  listDocuments,
  deleteDocument,
  uploadDocument,

  analyzeDocument,
  triggerAnalysis,

  getDocument,
  getAnalysis,

  getClauses,
  getRisks,

  downloadSummaryPDF,
  downloadSummary,
  downloadSummaryPdf,

  getChatHistory,
  askQuestion,
  askContract,

  checkBackend,
};

export default api;
