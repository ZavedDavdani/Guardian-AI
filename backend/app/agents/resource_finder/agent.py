import json
import math
from app.agents.resource_finder.rules import calculate_hospital_score, build_reasoning_line

_HOSPITALS_CACHE = None

def load_hospitals() -> list[dict]:
    global _HOSPITALS_CACHE
    if _HOSPITALS_CACHE is None:
        with open("data/mock_hospitals.json") as f:
            _HOSPITALS_CACHE = json.load(f)
    return _HOSPITALS_CACHE

def get_hospitals_snapshot() -> list[dict]:
    """Used by the /api/hospitals/ route so the UI reflects live decremented capacity."""
    return load_hospitals()

def haversine_km(lat1, lon1, lat2, lon2) -> float:
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    return R * 2 * math.asin(math.sqrt(a))

async def match_resources(incident: dict, incident_location: dict | None = None) -> dict:
    hospitals = load_hospitals()
    need_type = incident.get("need_type", "medical")
    total_victims = incident.get("victim_count_estimate", 1)

    scored_hospitals = []
    for h in hospitals:
        score = calculate_hospital_score(h, need_type)
        distance_km = None
        if incident_location and incident_location.get("latitude"):
            distance_km = haversine_km(
                incident_location["latitude"], incident_location["longitude"],
                h["latitude"], h["longitude"]
            )
        scored_hospitals.append({**h, "score": score, "distance_km": distance_km})

    scored_hospitals.sort(key=lambda x: (-x["score"], x["distance_km"] or 0))
    top_hospitals = scored_hospitals[:3]
    total_capacity = sum(h["available_beds"] for h in top_hospitals) or 1

    distribution_plan = []
    remaining = total_victims
    for i, h in enumerate(top_hospitals):
        if i == len(top_hospitals) - 1:
            assigned = remaining
        else:
            share = h["available_beds"] / total_capacity
            assigned = min(round(total_victims * share), h["available_beds"], remaining)
        assigned = max(assigned, 0)
        remaining -= assigned

        # --- actually decrement the live hospital record ---
        for real_h in hospitals:
            if real_h["id"] == h["id"]:
                real_h["available_beds"] = max(0, real_h["available_beds"] - assigned)
                real_h["icu_available"] = max(0, real_h["icu_available"] - min(assigned, real_h["icu_available"]))

        distribution_plan.append({
            "hospital_id": h["id"],
            "hospital_name": h["name"],
            "victims_assigned": assigned,
            "beds_available": h["available_beds"],
        })

    reasoning = [build_reasoning_line(h) for h in top_hospitals]

    return {
        "distribution_plan": distribution_plan,
        "reasoning": reasoning,
        "eta_minutes": 23,
    }