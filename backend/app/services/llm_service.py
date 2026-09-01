import json
import os

from dotenv import load_dotenv
from groq import Groq


# ============================================
# Environment
# ============================================

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError(
        "GROQ_API_KEY is missing from .env"
    )


# ============================================
# Groq Client
# ============================================

client = Groq(
    api_key=GROQ_API_KEY
)

MODEL_NAME = "openai/gpt-oss-120b"


# ============================================
# Generate RAG Answer
# ============================================

def generate_answer(
    question: str,
    context: str
) -> dict:
    """
    Generate a grounded answer and identify
    the chunk IDs used as evidence.
    """

    prompt = f"""
You are ClauseLens AI, a legal contract
analysis assistant.

Answer the user's question using ONLY
the supplied contract context.

IMPORTANT RULES:

1. Do not use outside information.
2. Do not invent facts.
3. If the answer is not contained in the
   supplied context, say that you could not
   find the information.
4. Only cite chunks that directly support
   your answer.
5. Return valid JSON only.

Required JSON format:

{{
    "answer": "Your answer here",
    "source_chunk_ids": [
        "chunk_1",
        "chunk_5"
    ]
}}

CONTRACT CONTEXT:

{context}

USER QUESTION:

{question}
"""

    response = client.chat.completions.create(
        model=MODEL_NAME,

        messages=[
            {
                "role": "system",
                "content": (
                    "You are a careful legal "
                    "document analysis assistant."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],

        reasoning_effort="medium",

        temperature=0.1,

        max_tokens=1000
    )

    content = response.choices[0].message.content

    if content is None:
        content = ""

    try:
        result = json.loads(content)

        return {
            "answer": result.get(
                "answer",
                ""
            ),
            "source_chunk_ids": result.get(
                "source_chunk_ids",
                []
            )
        }

    except json.JSONDecodeError:

        return {
            "answer": content,
            "source_chunk_ids": []
        }