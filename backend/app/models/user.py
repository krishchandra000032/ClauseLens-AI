import uuid

from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func

from app.database.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        nullable=False,
        index=True
    )

    password_hash = Column(
        String,
        nullable=False
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )