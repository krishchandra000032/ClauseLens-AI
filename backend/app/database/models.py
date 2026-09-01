from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    Integer,
    String,
    Text,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database.database import Base


# ============================================
# Documents
# ============================================

class Document(Base):

    __tablename__ = "documents"

    id = Column(
        String,
        primary_key=True,
        index=True
    )

    filename = Column(
        String,
        nullable=False
    )

    file_path = Column(
        String,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    # Relationships

    clauses = relationship(
        "Clause",
        back_populates="document",
        cascade="all, delete-orphan"
    )

    risks = relationship(
        "Risk",
        back_populates="document",
        cascade="all, delete-orphan"
    )


# ============================================
# Clauses
# ============================================

class Clause(Base):

    __tablename__ = "clauses"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    document_id = Column(
        String,
        ForeignKey("documents.id"),
        nullable=False
    )

    clause_type = Column(
        String
    )

    title = Column(
        String
    )

    summary = Column(
        Text
    )

    page = Column(
        Integer
    )

    chunk_id = Column(
        String
    )

    text = Column(
        Text
    )

    document = relationship(
        "Document",
        back_populates="clauses"
    )


# ============================================
# Risks
# ============================================

class Risk(Base):

    __tablename__ = "risks"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    document_id = Column(
        String,
        ForeignKey("documents.id"),
        nullable=False
    )

    risk_level = Column(
        String
    )

    score = Column(
        Integer
    )

    category = Column(
        String
    )

    title = Column(
        String
    )

    explanation = Column(
        Text
    )

    reason = Column(
        Text
    )

    page = Column(
        Integer
    )

    chunk_id = Column(
        String
    )

    text = Column(
        Text
    )

    document = relationship(
        "Document",
        back_populates="risks"
    )