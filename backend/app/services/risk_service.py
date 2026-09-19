import json

from app.services.vector_service import collection
from app.services.llm_service import client, MODEL_NAME


def analyze_contract_risks(
    document_id: str
):
    """
    Analyze all stored chunks of a contract
    and identify potentially risky clauses.
    """
    results = collection.get(
        where={
            "document_id": document_id
        }
    )

    documents = results.get(
        "documents",
        []
    )

    metadatas = results.get(
        "metadatas"
    ) or []

    if not documents:
        return []

    risks = []

    MAX_CHUNKS = 8

    for text, metadata in list(
        zip(documents, metadatas)
    )[:MAX_CHUNKS]:

        prompt = f"""
You are ClauseLens AI, a contract risk
analysis assistant.

Analyze the following contract clause.

Identify whether it contains a potentially
risky or unfavorable provision.

Possible risk levels:

LOW
MEDIUM
HIGH

Possible categories include:

- Termination
- Financial Penalty
- Non-Compete
- Confidentiality
- Intellectual Property
- Liability
- Indemnification
- Training Cost
- Employee Restriction
- Dispute Resolution
- Other

IMPORTANT:

1. Analyze ONLY the supplied clause.
2. Do not invent information.
3. Do not claim that a clause is legally
   invalid or enforceable.
4. Identify contractual risk or concern,
   not definitive legal conclusions.
5. Return valid JSON only.

Required format:

{{
    "is_risky": true,
    "risk_level": "HIGH",
    "category": "Financial Penalty",
    "title": "Early termination penalty",
    "explanation": "Brief explanation of why this provision may be unfavorable.",
    "reason": "Specific contractual feature creating the concern."
}}

If there is no meaningful risk:

{{
    "is_risky": false,
    "risk_level": "LOW",
    "category": "None",
    "title": "",
    "explanation": "",
    "reason": ""
}}

CONTRACT CLAUSE:

{text}
"""


        response = client.chat.completions.create(

            model=MODEL_NAME,

            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a careful contract "
                        "risk analysis assistant."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            temperature=0.1,

            max_tokens=600
        )


        content = (
            response
            .choices[0]
            .message
            .content
        )

        if not isinstance(content, str):
            continue

        try:

            result = json.loads(
                content
            )

        except json.JSONDecodeError:

            continue

        if result.get("is_risky"):

            risk_level = result.get(
                "risk_level",
                "MEDIUM"
            )

            # Convert risk level to score
            risk_scores = {
                "LOW": 30,
                "MEDIUM": 60,
                "HIGH": 90
            }

            score = risk_scores.get(
                risk_level,
                60
            )

            risks.append({
                "risk_level": risk_level,
                "score": score,
                "category": result.get(
                    "category",
                    "Other"
                ),
                "title": result.get(
                    "title",
                    ""
                ),
                "explanation": result.get(
                    "explanation",
                    ""
                ),
                "reason": result.get(
                    "reason",
                    ""
                ),
                "page": metadata.get(
                    "page_number"
                ),
                "chunk_id": metadata.get(
                    "chunk_id"
                ),
                "text": text
            })

    return risks