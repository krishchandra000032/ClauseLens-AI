import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import engine, Base
from app.database import models
from app.database.migrations import run_migrations

from app.api.chat import router as chat_router
from app.api.risks import router as risks_router
from app.api.clauses import router as clauses_router
from app.api.analysis import router as analysis_router
from app.api.documents import router as documents_router
from app.api.reports import router as reports_router
from app.api.auth import router as auth_router

app = FastAPI(
    title="ClauseLens AI",
    description="OCR + RAG Legal Contract Assistant",
    version="1.0.0"
)


Base.metadata.create_all(
    bind=engine
)

run_migrations()

default_frontend_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
configured_frontend_origins = os.getenv("FRONTEND_ORIGINS")
frontend_origins = (
    [origin.strip().rstrip("/") for origin in configured_frontend_origins.split(",") if origin.strip()]
    if configured_frontend_origins
    else default_frontend_origins
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_origins,
    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
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

app.include_router(chat_router)
app.include_router(risks_router)
app.include_router(clauses_router)
app.include_router(analysis_router)
app.include_router(documents_router)
app.include_router(reports_router)
app.include_router(auth_router)
