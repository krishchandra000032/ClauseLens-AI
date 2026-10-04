import os
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.database.database import SessionLocal
from app.database.models import Document, User


router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected"
        )

    allowed_extensions = {
        ".pdf",
        ".doc",
        ".docx",
        ".png",
        ".jpg",
        ".jpeg"
    }

    extension = os.path.splitext(file.filename)[1].lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type"
        )

    document_id = str(uuid.uuid4())

    filename = file.filename
    saved_filename = f"{document_id}{extension}"

    file_path = os.path.join(
        UPLOAD_DIR,
        saved_filename
    )

    try:
        contents = await file.read()

        with open(file_path, "wb") as buffer:
            buffer.write(contents)

        document = Document(
            id=document_id,
            user_id=current_user.id,
            filename=filename,
            file_path=file_path
        )

        db.add(document)
        db.commit()
        db.refresh(document)

        return {
            "message": "Document uploaded successfully",
            "document": {
                "id": document.id,
                "filename": document.filename,
                "user_id": document.user_id,
                "file_path": document.file_path,
                "created_at": document.created_at
            }
        }

    except Exception as e:
        db.rollback()

        if os.path.exists(file_path):
            os.remove(file_path)

        print("DOCUMENT UPLOAD ERROR:", repr(e))

        raise HTTPException(
            status_code=500,
            detail="Failed to upload document"
        )


@router.get("")
def get_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    documents = (
        db.query(Document)
        .filter(
            Document.user_id == current_user.id
        )
        .order_by(
            Document.created_at.desc()
        )
        .all()
    )

    return [
        {
            "id": document.id,
            "filename": document.filename,
            "user_id": document.user_id,
            "file_path": document.file_path,
            "created_at": document.created_at
        }
        for document in documents
    ]


@router.get("/{document_id}")
def get_document(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.user_id == current_user.id
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    return {
        "id": document.id,
        "filename": document.filename,
        "user_id": document.user_id,
        "file_path": document.file_path,
        "created_at": document.created_at
    }


@router.delete("/{document_id}")
def delete_document(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.user_id == current_user.id
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    file_path = document.file_path

    try:
        db.delete(document)
        db.commit()

        if document.file_path is not None and isinstance(document.file_path, str):
            if os.path.exists(document.file_path):
                try:
                    os.remove(document.file_path)
                except Exception as e:
                    print("FILE DELETE ERROR:", repr(e))

        return {
            "message": "Document deleted successfully"
        }

    except Exception as e:
        db.rollback()

        print("DOCUMENT DELETE ERROR:", repr(e))

        raise HTTPException(
            status_code=500,
            detail="Failed to delete document"
        )