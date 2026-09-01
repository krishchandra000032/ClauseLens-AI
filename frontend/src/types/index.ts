export type RiskLevel = "high" | "medium" | "low";
export type DocumentStatus = "pending" | "processing" | "completed" | "failed";

export interface Document {
  id: string;
  filename: string;
  fileType: "PDF" | "DOCX" | "DOC";
  fileSize: number; // bytes
  uploadDate: string; // ISO string
  status: DocumentStatus;
  riskScore?: number; // 0-100
  riskLevel?: RiskLevel;
  clausesCount?: number;
  risksCount?: number;
}

export interface Risk {
  id: string;
  documentId: string;
  title: string;
  category: string;
  severity: RiskLevel;
  explanation: string;
  pageNumber: number;
  whyRisky: string;
  clauseText?: string;
}

export interface Clause {
  id: string;
  documentId: string;
  title: string;
  category: ClauseCategory;
  summary: string;
  fullText: string;
  riskLevel: RiskLevel;
  pageNumber: number;
  sourceReference: string;
  keyPoints?: string[];
}

export type ClauseCategory =
  | "All"
  | "Termination"
  | "Compensation"
  | "Confidentiality"
  | "Intellectual Property"
  | "Non-Compete"
  | "Leave"
  | "Dispute Resolution"
  | "Other";

export interface Citation {
  page: number;
  section: string;
  excerpt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citation?: Citation;
  timestamp: string;
}

export interface AnalysisResult {
  documentId: string;
  overallRisk: RiskLevel;
  riskScore: number;
  clausesCount: number;
  risksCount: number;
  highRisks: number;
  mediumRisks: number;
  lowRisks: number;
  summary: string;
}

export interface ProcessingStep {
  id: string;
  label: string;
  status: "done" | "active" | "pending";
}

export interface AskResponse {
  answer: string;
  citation: Citation;
}
