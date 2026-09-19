from fastapi import APIRouter, HTTPException

from app.services.search_service import search_contract
from app.services.llm_service import generate_answer


router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


@router.post("/")
async def chat(
    document_id: str,
    question: str
):

    try:


        results = search_contract(
            document_id=document_id,
            question=question,
            top_k=5
        )


        if not results:

            raise HTTPException(
                status_code=404,
                detail=(
                    "No relevant information found "
                    "in this contract."
                )
            )

        context_parts = []

        for result in results:

            context_parts.append(
                f"""
SOURCE:
Chunk ID: {result.get("chunk_id", "N/A")}
Page: {result.get("page_number", "N/A")}

TEXT:
{result.get("text", "")}
"""
            )


        context = "\n".join(
            context_parts
        )

        llm_result = generate_answer(
            question=question,
            context=context
        )

        if isinstance(llm_result, str):
            answer_text = llm_result.strip()
        elif isinstance(llm_result, dict):
            if "answer" not in llm_result:
                raise HTTPException(
                    status_code=500,
                    detail="The model did not return a valid answer."
                )
            answer_text = llm_result.get("answer")
        else:
            raise HTTPException(
                status_code=500,
                detail="The model did not return a valid answer."
            )

        if not isinstance(answer_text, str) or not answer_text.strip():
            raise HTTPException(
                status_code=500,
                detail="The model returned an empty answer."
            )

        citations = []

        for result in results:

            citations.append({
                "page": result.get(
                    "page_number",
                    "N/A"
                ),

                "chunk_id": result.get(
                    "chunk_id",
                    "N/A"
                ),

                "excerpt": result.get(
                    "text",
                    ""
                )
            })


        return {
            "question": question,
            "answer": answer_text,
            "citations": citations
        }


    except HTTPException:

        raise


    except Exception as e:

        print(
            "CHAT ERROR:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )