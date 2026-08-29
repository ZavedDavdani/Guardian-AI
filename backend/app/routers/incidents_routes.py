from fastapi import APIRouter
router = APIRouter()

@router.get("/")
def list_incidents():
    return []  # Samad/Wasif will populate from Emergency Intelligence Agent output