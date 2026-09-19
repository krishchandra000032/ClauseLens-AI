from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Document, Clause, Risk
from app.services.vector_service import collection


router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)

@router.get("/")
def get_documents(
    db: Session = Depends(get_db)
):

    documents = (
        db.query(Document)
        .order_by(
            Document.created_at.desc()
        )
        .all()
    )

    return [
        {
            "id": document.id,
            "filename": document.filename,
            "file_path": document.file_path,
            "created_at": document.created_at
        }
        for document in documents
    ]

@router.get("/{document_id}")
def get_document(
    document_id: str,
    db: Session = Depends(get_db)
):

    document = (
        db.query(Document)
        .filter(
            Document.id == document_id
        )
        .first()
    )

    if not document:

        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )


    clause_count = (
        db.query(Clause)
        .filter(
            Clause.document_id == document_id
        )
        .count()
    )


    risk_count = (
        db.query(Risk)
        .filter(
            Risk.document_id == document_id
        )
        .count()
    )


    return {
        "id": document.id,
        "filename": document.filename,
        "file_path": document.file_path,
        "created_at": document.created_at,
        "total_clauses": clause_count,
        "total_risks": risk_count
    }

@router.delete("/{document_id}")
def delete_document(
    document_id: str,
    db: Session = Depends(get_db)
):

    document = (
        db.query(Document)
        .filter(
            Document.id == document_id
        )
        .first()
    )

    if not document:

        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    try:

        collection.delete(
            where={
                "document_id": document_id
            }
        )

    except Exception as e:

        print(
            "ChromaDB delete warning:",
            repr(e)
        )

    db.delete(document)

    db.commit()


    return {
        "message": "Document deleted successfully",
        "document_id": document_id
    }