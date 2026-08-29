from fastapi import APIRouter
from pydantic import BaseModel
from app.orchestration.graph import pipeline
from app.routers.websocket_routes import manager

router = APIRouter()

class PipelineInput(BaseModel):
    message: str
    user_id: str

@router.post("/run")
async def run_pipeline(payload: PipelineInput):
    result = await pipeline.ainvoke({
        "message": payload.message,
        "user_id": payload.user_id,
        "extracted": None, "incident": None, "resource_plan": None, "final_output": None,
    })
    final = result["final_output"]
    await manager.broadcast({"type": "incident_update", "payload": final})
    return final