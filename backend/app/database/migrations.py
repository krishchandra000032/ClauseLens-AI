from sqlalchemy import inspect, text

from app.database.database import engine


def run_migrations():
    """
    Additive, idempotent schema upgrades for existing SQLite databases.
    create_all() creates missing tables but never alters existing ones.
    """

    inspector = inspect(engine)

    if "documents" not in inspector.get_table_names():
        return

    columns = {
        col["name"] for col in inspector.get_columns("documents")
    }

    with engine.begin() as conn:

        if "user_id" not in columns:
            conn.execute(text(
                "ALTER TABLE documents "
                "ADD COLUMN user_id INTEGER REFERENCES users(id)"
            ))
            print("[migrations] Added documents.user_id")

        conn.execute(text(
            "CREATE INDEX IF NOT EXISTS ix_documents_user_id "
            "ON documents (user_id)"
        ))