import chromadb
from sentence_transformers import SentenceTransformer

CHROMA_PATH = "chroma_db"

COLLECTION_NAME = "contract_chunks"

EMBEDDING_MODEL = "all-MiniLM-L6-v2"

chroma_client = chromadb.PersistentClient(
    path=CHROMA_PATH
)

collection = chroma_client.get_or_create_collection(
    name=COLLECTION_NAME
)

embedding_model = SentenceTransformer(
    EMBEDDING_MODEL
)

def create_embedding(text: str) -> list[float]:

    embedding = embedding_model.encode(
        text,
        convert_to_numpy=True
    )

    return embedding.tolist()


def store_chunks(
    document_id: str,
    chunks: list
):

    if not chunks:
        return 0

    ids = []
    documents = []
    metadatas = []
    embeddings = []

    for chunk in chunks:

        chunk_id = chunk["chunk_id"]

        text = chunk["text"]

        page_number = chunk["page_number"]


        embedding = create_embedding(
            text
        )


        ids.append(
            f"{document_id}_{chunk_id}"
        )


        documents.append(
            text
        )


        metadatas.append({
            "document_id": document_id,
            "chunk_id": chunk_id,
            "page_number": (
                page_number
                if page_number is not None
                else -1
            )
        })


        embeddings.append(
            embedding
        )

    collection.upsert(
        ids=ids,
        documents=documents,
        metadatas=metadatas,
        embeddings=embeddings
    )


    return len(chunks)