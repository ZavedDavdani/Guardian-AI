from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

decision_log = []  # swap for a DB table if time allows

@router.get("/roles")
def get_roles():
    return ["ngo", "fire_brigade", "medical", "police", "disaster_management", "volunteer_coordinator"]

class Decision(BaseModel):
    incident_id: str
    decision: str  # "approved" or "overridden"

@router.post("/decision")
def log_decision(payload: Decision):
    decision_log.append(payload.dict())
    return {"status": "logged", "total_logged": len(decision_log)}