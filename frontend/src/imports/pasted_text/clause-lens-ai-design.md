Design a modern, premium SaaS web application called “ClauseLens AI”.

ClauseLens AI is an AI-powered legal contract analysis platform that helps users understand contracts by extracting important clauses, identifying potentially risky terms, assigning an overall risk score, and answering questions about the contract with page-level citations.

Create a complete responsive desktop-first web interface with a professional legal-tech aesthetic.

DESIGN STYLE:
- Modern SaaS / LegalTech product
- Minimal, clean, sophisticated and trustworthy
- Light background with dark navy/charcoal typography
- Use subtle blue/purple accents for AI elements
- Use red for high-risk warnings, amber/yellow for medium risk, and green for low risk
- Rounded cards with subtle shadows
- Generous whitespace
- Professional typography
- Avoid excessive gradients and unnecessary decoration
- Use clear icons and visual hierarchy
- The interface should feel similar in quality to modern products such as Linear, Notion, Stripe and professional legal software

BRAND:
Logo: “ClauseLens AI”
Logo icon: a document combined with a lens or legal scale
Tagline: “Understand every clause. Spot every risk.”

CREATE THESE MAIN SCREENS:

1. LANDING / HOME DASHBOARD

Top navigation:
- ClauseLens AI logo
- Dashboard
- Documents
- Analysis
- Ask Contract
- Settings
- User profile

Main hero section:
Title:
“Understand your contracts with AI.”

Subtitle:
“Extract clauses, identify risky terms, and ask questions about your contracts with cited answers.”

Large drag-and-drop upload card:
- Document icon
- “Drop your contract here”
- “Upload PDF, DOCX, or scanned documents”
- Browse Files button
- Supported formats text
- Maximum file size indicator

Primary CTA:
“Analyze Contract”

Below the upload section show:
“Recent Documents”

Document cards containing:
- Contract filename
- Document type
- Upload date
- Analysis status
- Risk score
- Risk level
- View Analysis button

2. DOCUMENT ANALYSIS DASHBOARD

Header:
- Back to Documents
- Contract filename
- File type
- Upload date
- Download button
- Re-analyze button

Top summary cards:
- Overall Risk
- Risk Score
- Clauses Found
- Risks Detected

Example:
Overall Risk: HIGH
Risk Score: 78/100
Clauses: 14
Risks: 5

Create a large visual risk score indicator using a circular progress/ring design.

Risk distribution:
- High Risk
- Medium Risk
- Low Risk

Risk Analysis section:
Display risk cards.

Each risk card should include:
- Risk severity badge
- Risk title
- Risk category
- Short explanation
- Page number
- “View Clause” button
- “Why is this risky?” expandable section

Example risks:
- Early Termination Penalty
- Post-Employment Restriction
- Broad Confidentiality Obligation
- Intellectual Property Ownership
- Training Cost Recovery

3. CLAUSE EXPLORER

Create a dedicated section for extracted clauses.

Left sidebar:
- All Clauses
- Termination
- Compensation
- Confidentiality
- Intellectual Property
- Non-Compete
- Leave
- Dispute Resolution
- Other

Main area:
Clause cards containing:
- Clause title
- Clause category
- Short summary
- Risk indicator
- Page number
- Source reference
- Expand/View Details button

When expanded show:
- Full clause text
- AI summary
- Key points
- Risk assessment
- Page citation

4. ASK YOUR CONTRACT PAGE

Create a ChatGPT-style legal contract assistant interface.

Header:
“Ask Your Contract”

Subtitle:
“Ask questions about this document and get answers grounded in the contract.”

Chat area:
User message example:
“What happens if I leave the company before completing two years?”

AI response:
“The agreement states that an employee leaving before completing two years may be subject to an early-departure payment.”

Below the answer display a citation card:

📌 Source
Page 4
Section 8.2

Show a short highlighted contract excerpt.

Include:
- Copy answer
- Copy citation
- View source
- Helpful / Not helpful buttons

Bottom:
Large chat input:
“Ask anything about this contract...”
Send button

Include suggested questions:
- “What is the termination notice period?”
- “What penalties apply if I resign early?”
- “Is there a non-compete clause?”
- “Who owns intellectual property?”
- “What happens after termination?”

5. DOCUMENT VIEWER

Create a split-screen contract viewer.

Left side:
PDF/document preview with page navigation.

Right side:
AI analysis panel.

When a citation is selected, highlight the relevant text in the document.

Right panel:
- Clause information
- Risk level
- Explanation
- Citation
- AI summary

Include page navigation:
Previous page / Next page
Page 4 of 12

6. DOCUMENTS PAGE

Create a document management page.

Header:
“My Documents”

Search bar:
“Search contracts...”

Filters:
- All
- High Risk
- Medium Risk
- Low Risk
- Recently Analyzed

Document table/cards:
- Filename
- Date uploaded
- Risk score
- Risk level
- Clauses
- Risks
- Status
- Actions

Actions:
- View
- Analyze
- Delete

7. SETTINGS PAGE

Sections:
- Profile
- Appearance
- AI preferences
- Notifications
- Privacy
- Data management

Include clean form controls.

8. EMPTY STATES

Design polished empty states for:
- No documents
- No analysis
- No risks detected
- No search results
- No chat history

Example:
“No contracts yet”
“Upload your first contract to start analyzing clauses and risks.”

9. LOADING / PROCESSING STATES

Create a contract processing screen.

Show progress steps:

Uploading document
✓

Extracting text
✓

Running OCR
●

Creating embeddings
○

Analyzing clauses
○

Detecting risks
○

Preparing report
○

Show message:
“ClauseLens AI is analyzing your contract. This may take a moment.”

10. RESPONSIVE DESIGN

Create desktop and tablet/mobile variants.

Desktop:
1440px wide

Tablet:
768px

Mobile:
390px

Use responsive layouts, collapsible navigation, stacked cards and mobile-friendly chat.

COMPONENT SYSTEM:

Create reusable components:
- Navbar
- Sidebar
- Button
- Upload Dropzone
- Document Card
- Risk Card
- Clause Card
- Risk Badge
- Risk Score
- Citation Card
- Chat Message
- Chat Input
- Search Bar
- Filter
- Modal
- Toast
- Loading Indicator
- Progress Stepper
- Empty State

COLOR SYSTEM:

Primary:
Deep navy / charcoal

AI accent:
Professional blue/purple

Risk:
High = red
Medium = amber
Low = green

Background:
Off-white / very light gray

Text:
Dark charcoal

Use colors consistently and ensure WCAG-accessible contrast.

TYPOGRAPHY:

Use Inter or a similar modern sans-serif font.

Create a clear type scale:
- Large page headings
- Section headings
- Card titles
- Body text
- Caption/source text

IMPORTANT UX PRINCIPLES:

The user should understand the contract status immediately.

Prioritize:
1. Overall risk
2. Important risks
3. Important clauses
4. Source citations
5. Ask Contract

Every AI-generated legal answer must visually emphasize that it is grounded in the uploaded contract.

Citations should always be visible and easy to access.

Do not present ClauseLens AI as a replacement for a lawyer. Include a subtle disclaimer:
“ClauseLens AI provides informational analysis and is not a substitute for professional legal advice.”

Create a cohesive, polished, production-quality Figma design system with reusable components, consistent spacing, typography, icons, states, and responsive layouts.