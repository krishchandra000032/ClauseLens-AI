from io import BytesIO
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import (
    getSampleStyleSheet,
    ParagraphStyle
)
from reportlab.lib.units import mm

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    KeepTogether
)


def safe_text(value):
    if value is None:
        return ""

    return escape(str(value))


def generate_summary_pdf(document_name, analysis):
    buffer = BytesIO()

    doc = SimpleDocTemplate(

        buffer,

        pagesize=A4,

        rightMargin=18 * mm,
        leftMargin=18 * mm,

        topMargin=18 * mm,
        bottomMargin=18 * mm,

        title="ClauseLens AI Contract Analysis",
        author="ClauseLens AI"
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "ClauseLensTitle",

        parent=styles["Title"],

        fontSize=24,
        leading=28,

        alignment=TA_CENTER,

        spaceAfter=8
    )

    subtitle_style = ParagraphStyle(
        "ClauseLensSubtitle",

        parent=styles["Heading2"],

        fontSize=15,
        leading=19,

        alignment=TA_CENTER,

        spaceAfter=18
    )

    heading_style = ParagraphStyle(
        "SectionHeading",

        parent=styles["Heading2"],

        fontSize=15,
        leading=19,

        spaceBefore=14,
        spaceAfter=9
    )

    subheading_style = ParagraphStyle(
        "SubHeading",

        parent=styles["Heading3"],

        fontSize=11,
        leading=14,

        spaceBefore=8,
        spaceAfter=5
    )

    normal_style = ParagraphStyle(
        "NormalCustom",

        parent=styles["BodyText"],

        fontSize=9.5,
        leading=14,

        spaceAfter=5
    )

    small_style = ParagraphStyle(
        "Small",

        parent=styles["BodyText"],

        fontSize=8,
        leading=11
    )

    risk_style = ParagraphStyle(
        "RiskText",

        parent=normal_style,

        leftIndent=5,
        spaceAfter=5
    )

    overall_risk = analysis.get(
        "overall_risk",
        "N/A"
    )

    risk_score = analysis.get(
        "risk_score",
        0
    )

    total_clauses = analysis.get(
        "total_clauses",
        0
    )

    total_risks = analysis.get(
        "total_risks",
        0
    )

    summary = analysis.get(
        "summary",
        "No AI summary available."
    )

    risks = analysis.get(
        "risks",
        []
    )

    clauses = analysis.get(
        "clauses",
        []
    )

    story = []

    story.append(
        Spacer(1, 10 * mm)
    )

    story.append(
        Paragraph(
            "ClauseLens AI",
            title_style
        )
    )

    story.append(
        Paragraph(
            "Contract Analysis & Risk Summary",
            subtitle_style
        )
    )

    story.append(
        Paragraph(
            f"<b>Document:</b> "
            f"{safe_text(document_name)}",
            normal_style
        )
    )

    story.append(
        Spacer(1, 10)
    )

    story.append(
        Paragraph(
            "1. Contract Overview",
            heading_style
        )
    )

    overview_data = [

        [
            Paragraph(
                "<b>Overall Risk</b>",
                normal_style
            ),

            Paragraph(
                f"<b>{safe_text(overall_risk)}</b>",
                normal_style
            )
        ],

        [
            Paragraph(
                "<b>Risk Score</b>",
                normal_style
            ),

            Paragraph(
                f"{risk_score} / 100",
                normal_style
            )
        ],

        [
            Paragraph(
                "<b>Clauses Identified</b>",
                normal_style
            ),

            Paragraph(
                str(total_clauses),
                normal_style
            )
        ],

        [
            Paragraph(
                "<b>Potential Risks</b>",
                normal_style
            ),

            Paragraph(
                str(total_risks),
                normal_style
            )
        ]
    ]

    overview_table = Table(
        overview_data,

        colWidths=[
            70 * mm,
            80 * mm
        ]
    )

    overview_table.setStyle(
        TableStyle([

            (
                "BACKGROUND",
                (0, 0),
                (0, -1),
                colors.HexColor("#E2E8F0")
            ),

            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.5,
                colors.HexColor("#94A3B8")
            ),

            (
                "VALIGN",
                (0, 0),
                (-1, -1),
                "MIDDLE"
            ),

            (
                "PADDING",
                (0, 0),
                (-1, -1),
                8
            )
        ])
    )

    story.append(
        overview_table
    )

    story.append(
        Paragraph(
            "2. AI Contract Summary",
            heading_style
        )
    )

    story.append(
        Paragraph(
            safe_text(summary),
            normal_style
        )
    )

    story.append(
        Paragraph(
            "3. Identified Contract Risks",
            heading_style
        )
    )

    if not risks:

        story.append(
            Paragraph(
                "No potentially risky clauses were identified.",
                normal_style
            )
        )

    else:

        for index, risk in enumerate(
            risks,
            1
        ):

            if not isinstance(
                risk,
                dict
            ):

                risk = {
                    "title": f"Risk {index}",
                    "description": str(risk)
                }

            title = risk.get(
                "title",
                f"Risk {index}"
            )

            category = risk.get(
                "category",
                "Other"
            )

            severity = risk.get(
                "risk_level",
                risk.get(
                    "severity",
                    "N/A"
                )
            )

            score = risk.get(
                "score",
                0
            )

            explanation = risk.get(
                "explanation",
                risk.get(
                    "description",
                    ""
                )
            )

            reason = risk.get(
                "reason",
                ""
            )

            page = risk.get(
                "page",
                None
            )

            elements = []

            elements.append(
                Paragraph(
                    f"<b>{index}. "
                    f"{safe_text(title)}</b>",
                    subheading_style
                )
            )

            elements.append(
                Paragraph(
                    f"<b>Category:</b> "
                    f"{safe_text(category)}",
                    risk_style
                )
            )

            elements.append(
                Paragraph(
                    f"<b>Severity:</b> "
                    f"{safe_text(severity)}",
                    risk_style
                )
            )

            elements.append(
                Paragraph(
                    f"<b>Risk Score:</b> "
                    f"{score}/100",
                    risk_style
                )
            )

            if explanation:

                elements.append(
                    Paragraph(
                        f"<b>Explanation:</b> "
                        f"{safe_text(explanation)}",
                        risk_style
                    )
                )

            if reason:

                elements.append(
                    Paragraph(
                        f"<b>Reason:</b> "
                        f"{safe_text(reason)}",
                        risk_style
                    )
                )

            if page:

                elements.append(
                    Paragraph(
                        f"<b>Source Page:</b> "
                        f"{safe_text(page)}",
                        risk_style
                    )
                )

            story.append(
                KeepTogether(elements)
            )

            story.append(
                Spacer(1, 5)
            )

    story.append(
        PageBreak()
    )

    story.append(
        Paragraph(
            "4. Extracted Contract Clauses",
            heading_style
        )
    )

    if not clauses:

        story.append(
            Paragraph(
                "No clauses were extracted.",
                normal_style
            )
        )

    else:

        for index, clause in enumerate(
            clauses,
            1
        ):

            if not isinstance(
                clause,
                dict
            ):

                clause = {
                    "title": f"Clause {index}",
                    "text": str(clause)
                }

            clause_type = clause.get(
                "clause_type",
                "Other"
            )

            title = clause.get(
                "title",
                f"Clause {index}"
            )

            summary_text = clause.get(
                "summary",
                clause.get(
                    "description",
                    ""
                )
            )

            page = clause.get(
                "page",
                None
            )

            chunk_id = clause.get(
                "chunk_id",
                None
            )

            elements = []

            elements.append(
                Paragraph(
                    f"<b>{index}. "
                    f"{safe_text(title)}</b>",
                    subheading_style
                )
            )

            elements.append(
                Paragraph(
                    f"<b>Type:</b> "
                    f"{safe_text(clause_type)}",
                    normal_style
                )
            )

            if summary_text:

                elements.append(
                    Paragraph(
                        f"<b>Summary:</b> "
                        f"{safe_text(summary_text)}",
                        normal_style
                    )
                )

            if page:

                elements.append(
                    Paragraph(
                        f"<b>Page:</b> "
                        f"{safe_text(page)}",
                        small_style
                    )
                )

            if chunk_id:

                elements.append(
                    Paragraph(
                        f"<b>Chunk:</b> "
                        f"{safe_text(chunk_id)}",
                        small_style
                    )
                )

            story.append(
                KeepTogether(elements)
            )

            story.append(
                Spacer(1, 8)
            )

    story.append(
        PageBreak()
    )

    story.append(
        Paragraph(
            "5. Disclaimer",
            heading_style
        )
    )

    story.append(
        Paragraph(
            "ClauseLens AI provides automated "
            "informational contract analysis and "
            "does not constitute legal advice. "
            "The analysis is generated using automated "
            "document processing and artificial intelligence "
            "and may contain errors or omissions. "
            "Important contractual decisions should be "
            "reviewed by a qualified legal professional.",
            normal_style
        )
    )

    def add_page_number(canvas, doc):

        canvas.saveState()

        canvas.setFont(
            "Helvetica",
            8
        )

        canvas.setFillColor(
            colors.grey
        )

        canvas.drawCentredString(
            A4[0] / 2,
            10 * mm,
            f"ClauseLens AI • Page {doc.page}"
        )

        canvas.restoreState()

        doc.build(
        story,
        onFirstPage=add_page_number,
        onLaterPages=add_page_number
    )

    buffer.seek(0)

    return buffer