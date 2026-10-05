import os
import shutil
from uuid import uuid4

import fitz
from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
)
from sqlalchemy.orm import Session
from app.services.vector_service import collection, store_chunks
from app.api.auth import get_current_user
from app.database.database import get_db
from app.database.models import Document as DocumentModel, User


router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)

UPLOAD_DIR = "uploads"

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".docx",
    ".png",
    ".jpg",
    ".jpeg",
}


def process_pdf(document_id: str, file_path: str):
    chunks = []

    pdf = fitz.open(file_path)
    chunk_id = 0

    try:
        for page_index in range(pdf.page_count):
            page_number = page_index + 1
            page = pdf.load_page(page_index)
            page_text = page.get_text("text")
            if not isinstance(page_text, str):
                raise TypeError("Expected text extracted from PDF page")
            text = page_text.strip()

            if not text:
                continue

            words = text.split()
            chunk_size = 250

            for i in range(0, len(words), chunk_size):
                chunk_text = " ".join(words[i : i + chunk_size]).strip()

                if not chunk_text:
                    continue

                chunks.append(
                    {
                        "chunk_id": str(chunk_id),
                        "text": chunk_text,
                        "page_number": page_number,
                    }
                )
                chunk_id += 1
    finally:
        pdf.close()

    return store_chunks(document_id, chunks)


# ============================================================
# UPLOAD DOCUMENT
# ============================================================


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Filename is missing",
        )

    original_filename = file.filename
    extension = os.path.splitext(original_filename)[1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file type. "
                "Allowed: PDF, DOCX, PNG, JPG, JPEG"
            ),
        )

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    document_id = str(uuid4())
    stored_filename = f"{document_id}{extension}"
    file_path = os.path.join(UPLOAD_DIR, stored_filename)
    total_chunks = 0

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        document = DocumentModel(
            id=document_id,
            user_id=current_user.id,
            filename=original_filename,
            file_path=file_path,
        )

        db.add(document)
        db.commit()
        db.refresh(document)

        if extension == ".pdf":
            total_chunks = process_pdf(document_id, file_path)

        print(f"STORED {total_chunks} CHUNKS FOR DOCUMENT {document_id}")
        print("CHROMA COUNT:", collection.count())

        return {
            "message": "Document uploaded successfully",
            "document": {
                "id": str(document.id),
                "filename": document.filename,
                "user_id": document.user_id,
                "file_path": document.file_path,
                "created_at": (
                    document.created_at.isoformat()
                    if document.created_at is not None
                    else None
                ),
            },
        }

    except Exception as e:
        db.rollback()

        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except OSError:
                pass

        print("UPLOAD ERROR:", repr(e))

        raise HTTPException(
            status_code=500,
            detail=f"Could not upload document: {str(e)}",
        )


# ============================================================
# GET ALL DOCUMENTS
# ============================================================


@router.get("")
def get_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    documents = (
        db.query(DocumentModel)
        .filter(DocumentModel.user_id == current_user.id)
        .order_by(DocumentModel.created_at.desc())
        .all()
    )

    result = []

    for document in documents:
        created_at = document.created_at
        result.append(
            {
                "id": str(document.id),
                "filename": document.filename,
                "user_id": document.user_id,
                "file_path": document.file_path,
                "created_at": (
                    created_at.isoformat()
                    if created_at is not None
                    else None
                ),
            }
        )

    return result


# ============================================================
# GET SINGLE DOCUMENT
# ============================================================


@router.get("/{document_id}")
def get_document(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    print("=" * 40)
    print("GET DOCUMENT")
    print("Document ID:", document_id)
    print("Current User ID:", current_user.id)
    print("=" * 40)

    document = (
        db.query(DocumentModel)
        .filter(
            DocumentModel.id == document_id,
            DocumentModel.user_id == current_user.id,
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    created_at = document.created_at

    return {
        "id": str(document.id),
        "filename": document.filename,
        "user_id": document.user_id,
        "file_path": document.file_path,
        "status": "completed",
        "created_at": (
            created_at.isoformat()
            if created_at is not None
            else None
        ),
    }


# ============================================================
# DELETE DOCUMENT
# ============================================================


@router.delete("/{document_id}")
def delete_document(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    document = (
        db.query(DocumentModel)
        .filter(
            DocumentModel.id == document_id,
            DocumentModel.user_id == current_user.id,
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    file_path = document.file_path

    try:
        db.delete(document)
        db.commit()

        if file_path is not None and os.path.exists(str(file_path)):
            try:
                os.remove(str(file_path))
            except OSError as e:
                print("FILE DELETE ERROR:", repr(e))

        return {"message": "Document deleted successfully"}

    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Could not delete document: {str(e)}",
        )