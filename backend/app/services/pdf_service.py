from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak
)
from reportlab.lib.units import mm
from io import BytesIO


def generate_summary_pdf(document_name, analysis):
    """
    Generate a PDF summary for a contract analysis.
    """

    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "TitleCustom",
        parent=styles["Title"],
        fontSize=22,
        leading=26,
        alignment=TA_CENTER,
        spaceAfter=15,
    )

    heading_style = ParagraphStyle(
        "HeadingCustom",
        parent=styles["Heading2"],
        fontSize=15,
        leading=18,
        spaceBefore=12,
        spaceAfter=8,
    )

    normal_style = ParagraphStyle(
        "NormalCustom",
        parent=styles["BodyText"],
        fontSize=10,
        leading=15,
    )

    story = []

    story.append(
        Paragraph("ClauseLens AI", title_style)
    )

    story.append(
        Paragraph(
            "Contract Analysis Summary",
            styles["Heading1"]
        )
    )

    story.append(
        Paragraph(
            f"<b>Document:</b> {document_name}",
            normal_style
        )
    )

    story.append(Spacer(1, 12))

    story.append(
        Paragraph("Contract Overview", heading_style)
    )

    overview_data = [
        ["Overall Risk", analysis.get("overall_risk", "N/A")],
        ["Risk Score", f'{analysis.get("risk_score", 0)} / 100'],
        ["Clauses Found", str(analysis.get("total_clauses", 0))],
        ["Risks Detected", str(analysis.get("total_risks", 0))],
    ]

    overview_table = Table(
        overview_data,
        colWidths=[70 * mm, 80 * mm]
    )

    overview_table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F1F5F9")),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
            ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
            ("PADDING", (0, 0), (-1, -1), 8),
        ])
    )

    story.append(overview_table)

    story.append(Spacer(1, 15))

    story.append(
        Paragraph("AI Summary", heading_style)
    )

    summary = analysis.get(
        "summary",
        analysis.get(
            "ai_summary",
            "No AI summary available."
        )
    )

    story.append(
        Paragraph(
            str(summary),
            normal_style
        )
    )

    story.append(
        Paragraph("Identified Risks", heading_style)
    )

    risks = analysis.get("risks", [])

    if risks:

        for index, risk in enumerate(risks, 1):

            if isinstance(risk, dict):

                risk_title = risk.get(
                    "title",
                    risk.get("name", f"Risk {index}")
                )

                description = risk.get(
                    "description",
                    risk.get("details", "")
                )

                severity = risk.get(
                    "severity",
                    risk.get("risk_level", "")
                )

                text = (
                    f"<b>{index}. {risk_title}</b><br/>"
                    f"<b>Severity:</b> {severity}<br/>"
                    f"{description}"
                )

            else:
                text = f"<b>{index}.</b> {str(risk)}"

            story.append(
                Paragraph(text, normal_style)
            )

            story.append(Spacer(1, 8))

    else:

        story.append(
            Paragraph(
                "No potentially risky clauses were identified.",
                normal_style
            )
        )

    story.append(
        Paragraph("Extracted Clauses", heading_style)
    )

    clauses = analysis.get("clauses", [])

    if clauses:

        for index, clause in enumerate(clauses, 1):

            if isinstance(clause, dict):

                clause_name = clause.get(
                    "title",
                    clause.get(
                        "name",
                        f"Clause {index}"
                    )
                )

                description = clause.get(
                    "description",
                    clause.get("text", "")
                )

                page = clause.get(
                    "page",
                    ""
                )

                text = (
                    f"<b>{index}. {clause_name}</b><br/>"
                    f"{description}"
                )

                if page:
                    text += f"<br/><b>Page:</b> {page}"

            else:

                text = (
                    f"<b>{index}.</b> {str(clause)}"
                )

            story.append(
                Paragraph(text, normal_style)
            )

            story.append(Spacer(1, 8))

    else:

        story.append(
            Paragraph(
                "No clauses were extracted.",
                normal_style
            )
        )
    story.append(Spacer(1, 20))

    story.append(
        Paragraph(
            "<b>Disclaimer</b>",
            heading_style
        )
    )

    story.append(
        Paragraph(
            "ClauseLens AI provides automated informational "
            "contract analysis and does not constitute legal advice. "
            "Important contractual decisions should be reviewed "
            "with a qualified legal professional.",
            normal_style
        )
    )
    doc.build(story)

    buffer.seek(0)

    return buffer