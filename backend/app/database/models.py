from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.database.database import Base


# ============================================================
# USER
# ============================================================

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    email: Mapped[str] = mapped_column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    password_hash: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    documents = relationship(
        "Document",
        back_populates="user",
        cascade="all, delete-orphan"
    )


# ============================================================
# DOCUMENT
# ============================================================

class Document(Base):
    __tablename__ = "documents"

    id = Column(
        String,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
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

    user = relationship(
        "User",
        back_populates="documents"
    )


# ============================================================
# CLAUSE
# ============================================================

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


# ============================================================
# RISK
# ============================================================

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