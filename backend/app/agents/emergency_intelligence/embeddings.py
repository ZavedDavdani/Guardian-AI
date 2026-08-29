import ollama

EMBED_MODEL = "nomic-embed-text"

def get_embedding(text: str) -> list[float]:
    response = ollama.embed(model=EMBED_MODEL, input=text)
    return response["embeddings"][0]