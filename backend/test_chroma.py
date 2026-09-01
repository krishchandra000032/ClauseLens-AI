from app.services.vector_service import collection


print("ChromaDB connected successfully!")

print(
    "Collection name:",
    collection.name
)

print(
    "Number of stored chunks:",
    collection.count()
)