from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    qdrant_host: str = "localhost"
    qdrant_port: int = 6333
    groq_api_key: str
    ollama_host: str = "http://localhost:11434"
    jwt_secret: str
    jwt_algorithm: str = "HS256"

    class Config:
        env_file = ".env"

settings = Settings()