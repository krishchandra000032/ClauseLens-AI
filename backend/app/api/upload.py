import os
import shutil
from uuid import uuid4

from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Document

from fastapi import (
    APIRouter,
    File,
    HTTPException,
    UploadFile
)

from app.services.document_processor import (
    extract_text_from_file
)

from app.services.chunk_services import (
    create_chunks
)

from app.services.vector_service import (
    store_chunks
)

router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)


UPLOAD_DIR = "uploads"


ALLOWED_EXTENSIONS = {
    ".pdf",
    ".docx",
    ".png",
    ".jpg",
    ".jpeg"
}


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    filename = file.filename

    if not filename:
        raise HTTPException(
            status_code=400,
            detail="Filename is missing"
        )

    extension = os.path.splitext(
        filename
    )[1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file type. "
                "Allowed: PDF, DOCX, PNG, JPG, JPEG"
            )
        )

    os.makedirs(
        UPLOAD_DIR,
        exist_ok=True
    )

    document_id = str(uuid4())

    stored_filename = (
        f"{document_id}{extension}"
    )

    file_path = os.path.join(
        UPLOAD_DIR,
        stored_filename
    )

    try:

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(
                file.file,
                buffer
            )
        document = Document(
            id=document_id,
            filename=filename,
            file_path=file_path,
        )
        db.add(document)
        db.commit()

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Could not save file: {str(e)}"
        )

    return {
        "message": "Document uploaded successfully",
        "document_id": document_id,
        "original_filename": filename,
        "stored_filename": stored_filename,
        "created_at": document.created_at,
    }


@router.post("/{document_id}/process")
async def process_document(
    document_id: str
):

    matching_files = []

    if os.path.exists(UPLOAD_DIR):

        for filename in os.listdir(UPLOAD_DIR):

            if filename.startswith(document_id):
                matching_files.append(filename)

    if not matching_files:

        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    filename = matching_files[0]

    file_path = os.path.join(
        UPLOAD_DIR,
        filename
    )

    try:

        result = extract_text_from_file(
            file_path
        )

        chunks = create_chunks(
            result["pages"]
        )

        stored_chunks = store_chunks(
            document_id,
            chunks
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Document processing failed: {str(e)}"
        )

    return {
    "message": "Document processed successfully",
    "document_id": document_id,
    "filename": filename,
    "total_chunks": len(chunks),
    "vectors_stored": stored_chunks
}

    
