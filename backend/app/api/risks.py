from fastapi import APIRouter, HTTPException
from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Risk
from app.services.risk_service import (
    analyze_contract_risks
)


router = APIRouter(
    prefix="/documents",
    tags=["Risk Analysis"]
)


@router.post("/{document_id}/analyze-risks")
async def analyze_risks(
    document_id: str
):

    try:

        risks = analyze_contract_risks(
            document_id
        )

        return {
            "document_id": document_id,
            "total_risks": len(risks),
            "risks": risks
        }

    except Exception as e:

        print(
            "\n========== RISK ERROR =========="
        )

        print(
            repr(e)
        )

        print(
            "================================\n"
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/{document_id}/risks")
def get_saved_risks(
    document_id: str,
    db: Session = Depends(get_db)
):

    risks = (
        db.query(Risk)
        .filter(
            Risk.document_id == document_id
        )
        .order_by(
            Risk.score.desc()
        )
        .all()
    )

    return {
        "document_id": document_id,
        "total_risks": len(risks),
        "risks": [
            {
                "id": risk.id,
                "risk_level": risk.risk_level,
                "score": risk.score,
                "category": risk.category,
                "title": risk.title,
                "explanation": risk.explanation,
                "reason": risk.reason,
                "page": risk.page,
                "chunk_id": risk.chunk_id,
                "text": risk.text
            }
            for risk in risks
        ]
    }   