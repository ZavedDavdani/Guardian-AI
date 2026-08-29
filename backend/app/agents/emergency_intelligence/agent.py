import uuid
import datetime
from qdrant_client.models import PointStruct
from app.agents.emergency_intelligence.embeddings import get_embedding
from app.db.qdrant_client import client, ensure_collection, COLLECTION_NAME

SIMILARITY_THRESHOLD = 0.82

ensure_collection()

async def dedup_and_cluster(extracted_report: dict) -> dict:
    need_type = extracted_report.get("need_type", "other")
    location_text = extracted_report.get("location_text", "")

    # need_type is repeated to weight it heavily — prevents different incident types
    # at the same location from accidentally clustering together
    text_for_embedding = f"{need_type} {need_type} incident at {location_text}"
    vector = get_embedding(text_for_embedding)

    search_results = client.search(
        collection_name=COLLECTION_NAME,
        query_vector=vector,
        limit=5,
    )

    matching_incident_id = None
    cluster_size = 1
    for result in search_results:
        # extra safety: only merge if need_type also matches exactly
        if result.score >= SIMILARITY_THRESHOLD and result.payload.get("need_type") == need_type:
            matching_incident_id = result.payload.get("incident_id")
            cluster_size = result.payload.get("cluster_size", 1) + 1
            break

    incident_id = matching_incident_id or f"inc_{uuid.uuid4().hex[:8]}"

    point_id = str(uuid.uuid4())
    client.upsert(
        collection_name=COLLECTION_NAME,
        points=[
            PointStruct(
                id=point_id,
                vector=vector,
                payload={
                    "incident_id": incident_id,
                    "location_text": location_text,
                    "need_type": need_type,
                    "cluster_size": cluster_size,
                    "timestamp": datetime.datetime.utcnow().isoformat(),
                },
            )
        ],
    )

    confidence = min(0.6 + (cluster_size * 0.08), 0.98)

    return {
        "incident_id": incident_id,
        "cluster_size": cluster_size,
        "victim_count_estimate": cluster_size * 6,
        "confidence": round(confidence, 2),
        "urgency": extracted_report.get("urgency", "medium"),
        "is_stale": False,
    }