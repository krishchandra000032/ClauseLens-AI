from app.services.vector_service import store_chunks
from app.services.vector_service import collection


test_chunks = [
    {
        "chunk_id": "test_1",
        "page_number": 1,
        "text": (
            "The employee must provide "
            "30 days written notice before "
            "terminating the agreement."
        )
    }
]


document_id = "test_document"


stored = store_chunks(
    document_id,
    test_chunks
)


print(
    f"Stored {stored} chunk(s)"
)


print(
    f"Total ChromaDB records: "
    f"{collection.count()}"
)