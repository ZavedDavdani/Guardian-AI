from app.agents.ngo_dashboard.formatter import build_reasoning
from app.utils.routing import resolve_responder_role
import datetime

async def build_action_plan(extracted: dict, incident: dict, resource_output: dict, hospitals: dict) -> dict:
    hospitals_by_id = {h["id"]: h for h in hospitals}
    reasoning = resource_output.get("reasoning") or build_reasoning(
        resource_output["distribution_plan"], hospitals_by_id
    )
    return {
        "incident_id": incident["incident_id"],
        "action_plan": resource_output,
        "reasoning": reasoning,
        "confidence": incident.get("confidence", 0.9),
        "urgency": incident.get("urgency", "medium"),
        "victim_count": incident.get("victim_count_estimate", 0),

        # --- fields that were previously missing ---
        "victim_reply": extracted.get("victim_reply", ""),
        "latitude": extracted.get("latitude"),
        "longitude": extracted.get("longitude"),
        "location_text": extracted.get("location_text"),
        "need_type": extracted.get("need_type"),
        "responder_role": resolve_responder_role(extracted.get("need_type")),
        "created_at": datetime.datetime.utcnow().isoformat(),
    }