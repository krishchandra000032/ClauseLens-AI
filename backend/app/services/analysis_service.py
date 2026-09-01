from app.services.clause_service import extract_clauses
from app.services.risk_service import analyze_contract_risks

from app.database.database import SessionLocal
from app.database.models import Clause, Risk


def calculate_overall_score(risks: list) -> int:

    if not risks:
        return 0

    total = sum(
        risk.get("score", 0)
        for risk in risks
    )

    return round(
        total / len(risks)
    )


def get_overall_risk(score: int) -> str:

    if score >= 70:
        return "HIGH"

    if score >= 40:
        return "MEDIUM"

    return "LOW"


def save_clauses(
    db,
    document_id: str,
    clauses: list
):

    saved_clauses = []

    for clause in clauses:

        db_clause = Clause(

            document_id=document_id,

            clause_type=clause.get(
                "clause_type",
                "Other"
            ),

            title=clause.get(
                "title",
                ""
            ),

            summary=clause.get(
                "summary",
                ""
            ),

            page=clause.get(
                "page"
            ),

            chunk_id=clause.get(
                "chunk_id"
            ),

            text=clause.get(
                "text",
                ""
            )
        )

        db.add(db_clause)

        saved_clauses.append(
            db_clause
        )

    return saved_clauses


def save_risks(
    db,
    document_id: str,
    risks: list
):

    saved_risks = []

    for risk in risks:

        db_risk = Risk(

            document_id=document_id,

            risk_level=risk.get(
                "risk_level",
                "MEDIUM"
            ),

            score=risk.get(
                "score",
                60
            ),

            category=risk.get(
                "category",
                "Other"
            ),

            title=risk.get(
                "title",
                ""
            ),

            explanation=risk.get(
                "explanation",
                ""
            ),

            reason=risk.get(
                "reason",
                ""
            ),

            page=risk.get(
                "page"
            ),

            chunk_id=risk.get(
                "chunk_id"
            ),

            text=risk.get(
                "text",
                ""
            )
        )

        db.add(db_risk)

        saved_risks.append(
            db_risk
        )

    return saved_risks


def analyze_contract(
    document_id: str
):

    # ==========================================
    # 1. Extract clauses
    # ==========================================

    clauses = extract_clauses(
        document_id
    )


    # ==========================================
    # 2. Analyze risks
    # ==========================================

    risks = analyze_contract_risks(
        document_id
    )


    # ==========================================
    # 3. Calculate risk score
    # ==========================================

    risk_score = calculate_overall_score(
        risks
    )

    overall_risk = get_overall_risk(
        risk_score
    )


    # ==========================================
    # 4. Save results to SQLite
    # ==========================================

    db = SessionLocal()

    try:

        # Remove previous analysis
        # so repeated analysis doesn't
        # create duplicate records.

        db.query(Clause).filter(
            Clause.document_id == document_id
        ).delete()

        db.query(Risk).filter(
            Risk.document_id == document_id
        ).delete()


        # Save clauses
        save_clauses(
            db,
            document_id,
            clauses
        )


        # Save risks
        save_risks(
            db,
            document_id,
            risks
        )


        db.commit()


    except Exception:

        db.rollback()

        raise

    finally:

        db.close()


    # ==========================================
    # 5. Return analysis
    # ==========================================

    return {
        "document_id": document_id,

        "overall_risk": overall_risk,

        "risk_score": risk_score,

        "total_clauses": len(
            clauses
        ),

        "total_risks": len(
            risks
        ),

        "clauses": clauses,

        "risks": risks
    }