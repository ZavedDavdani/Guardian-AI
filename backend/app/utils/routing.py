NEED_TYPE_TO_ROLE = {
    "medical": "medical",
    "flood_rescue": "fire_brigade",
    "fire": "fire_brigade",
    "shelter": "ngo",
    "food": "ngo",
    "other": "disaster_management",
}

def resolve_responder_role(need_type: str) -> str:
    return NEED_TYPE_TO_ROLE.get(need_type, "disaster_management")