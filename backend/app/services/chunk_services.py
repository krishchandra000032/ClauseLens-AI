from langchain_text_splitters import RecursiveCharacterTextSplitter

CHUNK_SIZE = 800
CHUNK_OVERLAP = 150

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=CHUNK_SIZE,
    chunk_overlap=CHUNK_OVERLAP,
    separators=[
        "\n\n",
        "\n",
        ". ",
        " ",
        ""
    ]
)


def create_chunks(pages: list) -> list:
 
    chunks = []

    chunk_counter = 1

    for page in pages:

        page_number = page.get("page_number")
        page_text = page.get("text", "")

        if not page_text.strip():
            continue

        page_chunks = text_splitter.split_text(
            page_text
        )

        for chunk_text in page_chunks:

            chunk = {
                "chunk_id": f"chunk_{chunk_counter}",
                "page_number": page_number,
                "text": chunk_text.strip()
            }

            chunks.append(chunk)

            chunk_counter += 1

    return chunks