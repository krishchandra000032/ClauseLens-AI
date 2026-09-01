from app.services.search_service import search_contract


DOCUMENT_ID = "c853f2d2-fb54-4b71-be9c-d4b79b6d2ef5"


question = "What is the termination notice period?"


results = search_contract(
    document_id=DOCUMENT_ID,
    question=question,
    top_k=5
)


print("\n========== SEARCH RESULTS ==========\n")


for result in results:

    print(
        f"Page: {result['page_number']}"
    )

    print(
        f"Chunk: {result['chunk_id']}"
    )

    print(
        f"Distance: {result['distance']}"
    )

    print(
        f"Text: {result['text']}"
    )

    print(
        "\n-----------------------------------\n"
    )