from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams
from app.config import settings

client = QdrantClient(host=settings.qdrant_host, port=settings.qdrant_port)

COLLECTION_NAME = "victim_reports"
VECTOR_SIZE = 768  # nomic-embed-text output dimension

def ensure_collection():
    collections = [c.name for c in client.get_collections().collections]
    if COLLECTION_NAME not in collections:
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE),
        )