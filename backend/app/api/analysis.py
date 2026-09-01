from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.services.analysis_service import (
    analyze_contract
)
from app.database.database import get_db
from app.database.models import Clause, Document, Risk


router = APIRouter(
    prefix="/documents",
    tags=["Contract Analysis"]
)


@router.get("/{document_id}/analysis")
def get_analysis(document_id: str, db: Session = Depends(get_db)):
    """Return persisted analysis in the shape used by the web client."""
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    risks = db.query(Risk).filter(Risk.document_id == document_id).all()
    score = round(sum(risk.score or 0 for risk in risks) / len(risks)) if risks else 0
    overall_risk = "high" if score >= 70 else "medium" if score >= 40 else "low"

    return {
        "document_id": document_id,
        "overall_risk": overall_risk,
        "risk_score": score,
        "total_clauses": db.query(Clause).filter(Clause.document_id == document_id).count(),
        "total_risks": len(risks),
        "high_risks": sum(risk.risk_level.lower() == "high" for risk in risks),
        "medium_risks": sum(risk.risk_level.lower() == "medium" for risk in risks),
        "low_risks": sum(risk.risk_level.lower() == "low" for risk in risks),
        "summary": "Analysis is based on the clauses and risks extracted from this contract.",
    }


@router.post("/{document_id}/analyze")
async def analyze_document(
    document_id: str
):

    try:

        result = analyze_contract(
            document_id
        )

        return result

    except Exception as e:

        print(
            "\n========== ANALYSIS ERROR =========="
        )

        print(
            repr(e)
        )

        print(
            "====================================\n"
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
