import type {
  Document,
  Risk,
  Clause,
  AnalysisResult,
  ChatMessage,
} from "../types";

export const mockDocuments: Document[] = [
  {
    id: "doc-001",
    filename: "Employment Agreement - Software Engineer.pdf",
    fileType: "PDF",
    fileSize: 384512,
    uploadDate: "2024-11-14T09:22:00Z",
    status: "completed",
    riskScore: 78,
    riskLevel: "high",
    clausesCount: 14,
    risksCount: 5,
  },
  {
    id: "doc-002",
    filename: "SaaS Subscription Agreement.pdf",
    fileType: "PDF",
    fileSize: 256000,
    uploadDate: "2024-11-12T14:05:00Z",
    status: "completed",
    riskScore: 45,
    riskLevel: "medium",
    clausesCount: 11,
    risksCount: 3,
  },
  {
    id: "doc-003",
    filename: "Freelance Services Contract.docx",
    fileType: "DOCX",
    fileSize: 128000,
    uploadDate: "2024-11-10T11:30:00Z",
    status: "completed",
    riskScore: 22,
    riskLevel: "low",
    clausesCount: 8,
    risksCount: 1,
  },
];

export const mockAnalysis: AnalysisResult = {
  documentId: "doc-001",
  overallRisk: "high",
  riskScore: 78,
  clausesCount: 14,
  risksCount: 5,
  highRisks: 2,
  mediumRisks: 2,
  lowRisks: 1,
  summary:
    "This employment agreement contains several clauses that may significantly disadvantage the employee. Key concerns include an early termination penalty, a broad post-employment restriction, and an IP assignment clause that extends to personal projects.",
};

export const mockRisks: Risk[] = [
  {
    id: "risk-001",
    documentId: "doc-001",
    title: "Early Termination Penalty",
    category: "Termination",
    severity: "high",
    explanation:
      "If you resign before completing two years of service, you are required to pay back three months of gross salary as a liquidated damages penalty.",
    pageNumber: 4,
    whyRisky:
      "Liquidated damages clauses of this magnitude are disproportionate and potentially unenforceable in many jurisdictions. This clause creates a significant financial barrier to leaving the role and effectively traps the employee. Courts in several jurisdictions have struck down similar clauses as penalties rather than genuine pre-estimates of loss.",
    clauseText:
      "Should the Employee voluntarily terminate this Agreement prior to the completion of twenty-four (24) months of continuous service, the Employee shall be liable to pay to the Employer a sum equivalent to three (3) months gross salary as liquidated damages...",
  },
  {
    id: "risk-002",
    documentId: "doc-001",
    title: "Post-Employment Restriction",
    category: "Non-Compete",
    severity: "high",
    explanation:
      "You are barred from working for any competitor or starting a competing business for 24 months after leaving, covering the entire industry sector.",
    pageNumber: 6,
    whyRisky:
      "A 24-month non-compete of this breadth is unusually restrictive and may severely limit your career options. While enforceability varies by jurisdiction, this clause could expose you to costly litigation even if ultimately unenforceable. The geographic and industry scope is broader than is typically reasonable.",
    clauseText:
      "For a period of twenty-four (24) months following termination, the Employee shall not directly or indirectly engage in, or have any interest in, any business that competes with or is similar to the Employer's business within the applicable territory...",
  },
  {
    id: "risk-003",
    documentId: "doc-001",
    title: "Broad Confidentiality Obligation",
    category: "Confidentiality",
    severity: "medium",
    explanation:
      "The confidentiality obligation covers an unusually broad scope of information with no expiry date, extending indefinitely after your employment ends.",
    pageNumber: 3,
    whyRisky:
      "Perpetual confidentiality obligations that cover broad categories of information can create ambiguity about what you may discuss in future roles. While protecting genuine trade secrets is legitimate, this clause's indefinite duration and broad scope may constrain your professional activities beyond what is reasonable.",
    clauseText:
      "The Employee agrees to keep strictly confidential all information, data, know-how, processes, trade secrets, business plans, financial information, customer lists and any other information relating to the Employer's business...",
  },
  {
    id: "risk-004",
    documentId: "doc-001",
    title: "Intellectual Property Ownership",
    category: "Intellectual Property",
    severity: "medium",
    explanation:
      "The IP assignment clause may extend to work you do outside of working hours and using personal equipment if it is related to the company's business area.",
    pageNumber: 5,
    whyRisky:
      "This clause could potentially claim ownership of side projects, open-source contributions, or personal inventions if the company argues they relate to its business. This is particularly concerning for software engineers who may work on personal coding projects. Consider negotiating an explicit carve-out for personal projects completed outside work hours.",
    clauseText:
      "All inventions, improvements, designs, software, algorithms, works of authorship, or other intellectual property created by the Employee, whether or not during working hours or using Company resources, that relate to the Company's business activities...",
  },
  {
    id: "risk-005",
    documentId: "doc-001",
    title: "Training Cost Recovery",
    category: "Compensation",
    severity: "low",
    explanation:
      "If you leave within 12 months of completing company-funded training, you must repay a pro-rated portion of the training costs.",
    pageNumber: 7,
    whyRisky:
      "While training repayment clauses are relatively common, the 12-month recovery period and the definition of \"company-funded training\" may be interpreted broadly. Ensure you understand what training is covered before accepting sponsored certifications or courses.",
    clauseText:
      "In the event the Employee resigns within twelve (12) months of completing any training programme funded by the Employer, the Employee shall repay to the Employer a pro-rated portion of the training costs...",
  },
];

export const mockClauses: Clause[] = [
  {
    id: "clause-001",
    documentId: "doc-001",
    title: "Compensation and Benefits",
    category: "Compensation",
    summary:
      "Base salary of £65,000 per annum paid monthly, with discretionary annual bonus of up to 15% of base salary based on performance.",
    fullText:
      "The Employee shall receive a base salary of sixty-five thousand pounds (£65,000) per annum, payable in equal monthly instalments on the last working day of each calendar month. The Employee will be eligible to participate in the Company discretionary annual bonus scheme, which provides for a bonus of up to 15% of base salary, subject to the achievement of individual and company performance targets as determined by the Board.",
    riskLevel: "low",
    pageNumber: 2,
    sourceReference: "Section 4.1 – 4.3",
    keyPoints: [
      "£65,000 base salary",
      "Discretionary bonus up to 15%",
      "Monthly payment schedule",
      "Bonus subject to Board discretion",
    ],
  },
  {
    id: "clause-002",
    documentId: "doc-001",
    title: "Early Termination Penalty",
    category: "Termination",
    summary:
      "Employee must pay 3 months gross salary if they resign before completing 2 years of service.",
    fullText:
      "Should the Employee voluntarily terminate this Agreement prior to the completion of twenty-four (24) months of continuous service, the Employee shall be liable to pay to the Employer a sum equivalent to three (3) months gross salary as liquidated damages, representing the Employer's reasonable pre-estimate of loss arising from such early departure, including but not limited to recruitment costs and loss of productivity.",
    riskLevel: "high",
    pageNumber: 4,
    sourceReference: "Section 8.2",
    keyPoints: [
      "24-month minimum service trigger",
      "3 months gross salary penalty",
      "Applies to voluntary resignation only",
      "Framed as liquidated damages",
    ],
  },
  {
    id: "clause-003",
    documentId: "doc-001",
    title: "Confidentiality Obligation",
    category: "Confidentiality",
    summary:
      "Perpetual obligation to keep all company information confidential, including business plans, customer data, and financial information.",
    fullText:
      "The Employee agrees to keep strictly confidential all information, data, know-how, processes, trade secrets, business plans, financial information, customer lists and any other information relating to the Employer's business, whether or not marked as confidential, both during the term of employment and for an indefinite period thereafter. This obligation survives termination of employment for any reason.",
    riskLevel: "medium",
    pageNumber: 3,
    sourceReference: "Section 5.1 – 5.4",
    keyPoints: [
      "Perpetual duration — no end date",
      "Broad scope of covered information",
      "Survives termination",
      "No carve-out for public information",
    ],
  },
  {
    id: "clause-004",
    documentId: "doc-001",
    title: "Intellectual Property Assignment",
    category: "Intellectual Property",
    summary:
      "All IP created during or potentially outside employment hours that relates to company business is automatically assigned to the employer.",
    fullText:
      "All inventions, improvements, designs, software, algorithms, works of authorship, or other intellectual property created by the Employee, whether or not during working hours or using Company resources, that relate to the Company's business activities, current or planned products, or research and development shall be the exclusive property of the Employer. The Employee hereby assigns all right, title and interest in such IP to the Employer.",
    riskLevel: "medium",
    pageNumber: 5,
    sourceReference: "Section 9.1 – 9.3",
    keyPoints: [
      "Includes work outside working hours",
      "Covers anything relating to company business",
      "Automatic assignment — no separate agreement needed",
      "No carve-out for personal projects",
    ],
  },
  {
    id: "clause-005",
    documentId: "doc-001",
    title: "Non-Compete Restriction",
    category: "Non-Compete",
    summary:
      "24-month industry-wide non-compete covering all competitors following termination.",
    fullText:
      "For a period of twenty-four (24) months following termination of this Agreement for any reason, the Employee shall not directly or indirectly engage in, be employed by, consult for, have an ownership interest in, or otherwise participate in any business that competes with or is substantially similar to the Employer's business, within the United Kingdom or any country in which the Employer operates.",
    riskLevel: "high",
    pageNumber: 6,
    sourceReference: "Section 12.1 – 12.2",
    keyPoints: [
      "24-month duration post-termination",
      "Covers direct and indirect involvement",
      "Broad geographic scope",
      "Applies regardless of reason for termination",
    ],
  },
  {
    id: "clause-006",
    documentId: "doc-001",
    title: "Notice Period",
    category: "Termination",
    summary:
      "Three months notice required from the employee; the employer may provide payment in lieu of notice.",
    fullText:
      "Either party may terminate this Agreement by giving three (3) months written notice to the other party. The Employer reserves the right to make a payment in lieu of notice equivalent to the Employee's base salary for the notice period. The Employee may not take other employment during the notice period without the Employer's prior written consent.",
    riskLevel: "low",
    pageNumber: 4,
    sourceReference: "Section 8.1",
    keyPoints: [
      "3 months notice by employee",
      "Employer can elect payment in lieu",
      "No employment during notice period",
    ],
  },
  {
    id: "clause-007",
    documentId: "doc-001",
    title: "Annual Leave Entitlement",
    category: "Leave",
    summary:
      "25 days annual leave plus public holidays, with a carry-over limit of 5 days into the next leave year.",
    fullText:
      "The Employee is entitled to 25 days paid annual leave per leave year in addition to the applicable public holidays. Annual leave must be taken within the leave year in which it accrues. A maximum of five (5) days unused leave may be carried forward to the following leave year with prior written approval from the line manager. Unused leave in excess of this carry-over allowance will be forfeited.",
    riskLevel: "low",
    pageNumber: 8,
    sourceReference: "Section 15.1 – 15.3",
    keyPoints: [
      "25 days plus public holidays",
      "Use-it-or-lose-it policy",
      "5-day carry-over maximum",
      "Forfeiture of excess unused leave",
    ],
  },
  {
    id: "clause-008",
    documentId: "doc-001",
    title: "Dispute Resolution",
    category: "Dispute Resolution",
    summary:
      "Employment disputes must first go through internal grievance procedures, then binding arbitration before any court proceedings.",
    fullText:
      "Any dispute arising under or in connection with this Agreement shall first be subject to the Employer's internal grievance procedure. If not resolved within 30 days, the parties agree to submit the dispute to binding arbitration administered by the Chartered Institute of Arbitrators under its Employment Arbitration Rules. The seat of arbitration shall be London, England.",
    riskLevel: "low",
    pageNumber: 11,
    sourceReference: "Section 19.1 – 19.3",
    keyPoints: [
      "Mandatory internal grievance first",
      "Binding arbitration required",
      "Court proceedings effectively limited",
      "London seat of arbitration",
    ],
  },
];

export const mockChatHistory: ChatMessage[] = [
  {
    id: "msg-001",
    role: "user",
    content: "What happens if I leave the company before completing two years?",
    timestamp: "2024-11-14T10:15:00Z",
  },
  {
    id: "msg-002",
    role: "assistant",
    content:
      "According to the agreement, if you voluntarily resign before completing 24 months of continuous service, you would be required to pay the company three months of your gross salary as liquidated damages. The contract characterises this as the employer's reasonable pre-estimate of loss from your early departure, covering recruitment and productivity costs. This is a significant financial penalty worth approximately £16,250 based on your stated salary.",
    citation: {
      page: 4,
      section: "Section 8.2",
      excerpt:
        '"Should the Employee voluntarily terminate this Agreement prior to the completion of twenty-four (24) months of continuous service, the Employee shall be liable to pay to the Employer a sum equivalent to three (3) months gross salary as liquidated damages..."',
    },
    timestamp: "2024-11-14T10:15:04Z",
  },
];
