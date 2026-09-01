import json

from app.services.vector_service import collection
from app.services.llm_service import client, MODEL_NAME


def extract_clauses(document_id: str):
    """
    Extract structured legal clauses from a contract.
    """

    # ============================================
    # Get chunks for this document
    # ============================================

    results = collection.get(
        where={
            "document_id": document_id
        }
    )

    documents = results.get("documents") or []
    metadatas = results.get("metadatas") or []

    if not documents:
        return []


    clauses = []


    # ============================================
    # Analyze each chunk
    # ============================================

    for text, metadata in zip(
        documents,
        metadatas
    ):

        prompt = f"""
You are ClauseLens AI, a legal contract
clause extraction assistant.

Analyze the contract text below and determine
whether it contains a meaningful contractual
clause.

If it does, extract the clause information.

Possible clause types include:

- Employment
- Compensation
- Probation
- Transfer
- Duties
- Confidentiality
- Intellectual Property
- Non-Compete
- Termination
- Financial Penalty
- Training
- Leave
- Liability
- Indemnification
- Dispute Resolution
- Arbitration
- Governing Law
- Other

IMPORTANT:

1. Use ONLY the supplied text.
2. Do not invent missing information.
3. Preserve important contractual details.
4. Do not provide legal advice.
5. Return valid JSON only.

Return this format:

{{
    "is_clause": true,
    "clause_type": "Termination",
    "title": "Termination by Employee",
    "summary": "Short summary of the clause.",
    "key_points": [
        "Important point 1",
        "Important point 2"
    ]
}}

If the text does not contain a meaningful
contractual clause, return:

{{
    "is_clause": false,
    "clause_type": "",
    "title": "",
    "summary": "",
    "key_points": []
}}

CONTRACT TEXT:

{text}
"""


        # ========================================
        # Ask Groq
        # ========================================

        response = client.chat.completions.create(
            model=MODEL_NAME,

            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a precise contract "
                        "clause extraction assistant."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            reasoning_effort="medium",

            temperature=0.1,

            max_tokens=600
        )


        content = (
            response
            .choices[0]
            .message
            .content
        )


        # ========================================
        # Parse JSON
        # ========================================

        if not content:
            continue

        try:

            result = json.loads(content)

        except json.JSONDecodeError:

            continue


        # ========================================
        # Keep actual clauses
        # ========================================

        if result.get("is_clause"):

            clauses.append({

                "clause_type": result.get(
                    "clause_type",
                    "Other"
                ),

                "title": result.get(
                    "title",
                    ""
                ),

                "summary": result.get(
                    "summary",
                    ""
                ),

                "key_points": result.get(
                    "key_points",
                    []
                ),

                # Source information
                "page": metadata.get(
                    "page_number"
                ),

                "chunk_id": metadata.get(
                    "chunk_id"
                ),

                "text": text

            })


    return clauses