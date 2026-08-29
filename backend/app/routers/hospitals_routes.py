from fastapi import APIRouter
from app.agents.resource_finder.agent import get_hospitals_snapshot

router = APIRouter()

@router.get("/")
def list_hospitals():
    return get_hospitals_snapshot()