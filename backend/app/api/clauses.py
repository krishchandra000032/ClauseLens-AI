from fastapi import APIRouter, HTTPException
from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Clause
from app.services.clause_service import (
    extract_clauses
)


router = APIRouter(
    prefix="/documents",
    tags=["Clause Extraction"]
)


@router.post("/{document_id}/extract-clauses")
async def extract_document_clauses(
    document_id: str
):
    try:

        clauses = extract_clauses(
            document_id
        )

        return {
            "document_id": document_id,
            "total_clauses": len(clauses),
            "clauses": clauses
        }

    except Exception as e:

        print(
            "\n========== CLAUSE ERROR =========="
        )

        print(
            repr(e)
        )

        print(
            "==================================\n"
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/{document_id}/clauses")
def get_saved_clauses(
    document_id: str,
    db: Session = Depends(get_db)
):

    clauses = (
        db.query(Clause)
        .filter(
            Clause.document_id == document_id
        )
        .order_by(
            Clause.page.asc()
        )
        .all()
    )

    return {
        "document_id": document_id,
        "total_clauses": len(clauses),
        "clauses": [
            {
                "id": clause.id,
                "clause_type": clause.clause_type,
                "title": clause.title,
                "summary": clause.summary,
                "page": clause.page,
                "chunk_id": clause.chunk_id,
                "text": clause.text
            }
            for clause in clauses
        ]
    }