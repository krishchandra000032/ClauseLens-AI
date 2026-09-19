from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import engine, Base
from app.database import models

from app.api.upload import router as upload_router
from app.api.chat import router as chat_router
from app.api.risks import router as risks_router
from app.api.clauses import router as clauses_router
from app.api.analysis import router as analysis_router
from app.api.documents import router as documents_router
from app.api.reports import router as reports_router

app = FastAPI(
    title="ClauseLens AI",
    description="OCR + RAG Legal Contract Assistant",
    version="1.0.0"
)

Base.metadata.create_all(
    bind=engine
)


@app.get("/")
def root():
    return {
        "message": "Welcome to ClauseLens AI",
        "status": "running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


app.include_router(
    upload_router
)
app.include_router(
    chat_router
)
app.include_router(
    risks_router
)
app.include_router(
    clauses_router
)
app.include_router(
    analysis_router
)
app.include_router(
    documents_router
)
app.include_router(
    reports_router
)

# The React development server runs on a different origin from FastAPI.
# Keep this explicit so browser requests to the API are permitted in development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
