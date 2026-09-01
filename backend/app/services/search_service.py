from app.services.vector_service import (
    collection,
    create_embedding
)


def search_contract(
    document_id: str,
    question: str,
    top_k: int = 5
):
    """
    Search the contract for the most relevant
    chunks using semantic similarity.
    """

    if not question.strip():
        return []

    # Create embedding for question
    question_embedding = create_embedding(
        question
    )

    # Search ChromaDB
    results = collection.query(
        query_embeddings=[
            question_embedding
        ],
        n_results=top_k,
        where={
            "document_id": document_id
        }
    )

    documents = results.get(
        "documents",
        [[]]
    ) or [[]][0]
    documents = documents[0] if documents else []

    metadatas = results.get(
        "metadatas",
        [[]]
    ) or [[]][0]
    metadatas = metadatas[0] if metadatas else []

    distances = results.get(
         "distances",
        [[]]
    ) or [[]][0]
    distances = distances[0] if distances else []

    search_results = []

    for i in range(len(documents)):

        metadata = metadatas[i]

        search_results.append({
            "text": documents[i],

            "document_id": metadata.get(
                "document_id"
            ),

            "chunk_id": metadata.get(
                "chunk_id"
            ),

            "page_number": metadata.get(
                "page_number"
            ),

            "distance": distances[i]
        })

    return search_results