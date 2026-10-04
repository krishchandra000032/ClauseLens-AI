from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.services.pdf_service import generate_summary_pdf

from app.database.database import SessionLocal
from app.database.models import Document


router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.get(
    "/{document_id}/summary",
    summary="Download Contract Analysis Summary",
    description="Generates and downloads a PDF containing the contract analysis summary.",
    responses={
        200: {
            "description": "Contract analysis PDF",
            "content": {
                "application/pdf": {
                    "schema": {
                        "type": "string",
                        "format": "binary"
                    }
                }
            }
        },
        404: {
            "description": "Document not found"
        }
    }
)
def download_summary(document_id: str):

    db = SessionLocal()

    try:

        document = (
            db.query(Document)
            .filter(Document.id == document_id)
            .first()
        )

        if not document:
            raise HTTPException(
                status_code=404,
                detail="Document not found"
            )

        # Build analysis data
        analysis = {
            "overall_risk": getattr(
                document,
                "overall_risk",
                "N/A"
            ),

            "risk_score": getattr(
                document,
                "risk_score",
                0
            ),

            "total_clauses": getattr(
                document,
                "total_clauses",
                0
            ),

            "total_risks": getattr(
                document,
                "total_risks",
                0
            ),

            "summary": getattr(
                document,
                "summary",
                "No summary available."
            ),

            "risks": [],

            "clauses": []
        }

        # Generate PDF
        pdf = generate_summary_pdf(
            getattr(
                document,
                "filename",
                "Contract"
            ),
            analysis
        )

        filename = "ClauseLens_Contract_Analysis_Summary.pdf"

        # Return PDF as downloadable file
        return StreamingResponse(
            pdf,
            media_type="application/pdf",
            headers={
                "Content-Disposition": (
                    f'attachment; filename="{filename}"'
                )
            }
        )

    finally:
        db.close()