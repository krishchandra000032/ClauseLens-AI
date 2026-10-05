import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()


# ============================================================
# GROQ CONFIGURATION
# ============================================================

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

MODEL_NAME = os.getenv(
    "GROQ_MODEL",
    "openai/gpt-oss-120b"
)

if not GROQ_API_KEY:
    raise ValueError(
        "GROQ_API_KEY is missing from .env"
    )


client = OpenAI(
    api_key=GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1",
    timeout=120.0,
    max_retries=2
)


# ============================================================
# GENERATE ANSWER
# ============================================================

def generate_answer(
    context: str,
    question: str
):

    prompt = f"""
You are ClauseLens AI, an AI assistant specialized
in contract analysis.

Use ONLY the provided contract context to answer
the user's question.

Do not invent information.

If the answer is not present in the contract context,
clearly say that the information was not found.

CONTRACT CONTEXT:
{context}

QUESTION:
{question}

Instructions:

1. Give a clear and concise answer.
2. Use only information from the contract.
3. Do not hallucinate or invent clauses.
4. Mention the relevant page when available.
5. Explain why a clause may be important or risky.
"""


    response = client.chat.completions.create(

        model=MODEL_NAME,

        messages=[
            {
                "role": "system",
                "content": (
                    "You are a precise contract "
                    "analysis assistant."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],

        temperature=0.2,

        max_tokens=1200
    )


    return response.choices[0].message.content