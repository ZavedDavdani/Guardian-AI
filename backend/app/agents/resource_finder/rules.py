def calculate_hospital_score(hospital: dict, need_type: str) -> float:
    """
    Scores a hospital's suitability for receiving patients.
    Higher score = better candidate. Factors: ICU availability %,
    general bed availability %, and specialist match bonus.
    """
    icu_availability_pct = hospital["icu_available"] / hospital["icu_total"] if hospital["icu_total"] else 0
    bed_availability_pct = hospital["available_beds"] / hospital["total_beds"] if hospital["total_beds"] else 0

    specialist_bonus = 0.0
    specialists = hospital.get("specialists", "").split(",")
    if need_type == "medical" and any(s in specialists for s in ["cardiac", "general"]):
        specialist_bonus = 0.1
    elif need_type == "rescue" and "trauma" in specialists:
        specialist_bonus = 0.15
    elif need_type == "orthopedic" and "orthopedic" in specialists:
        specialist_bonus = 0.15

    score = (icu_availability_pct * 0.6) + (bed_availability_pct * 0.3) + specialist_bonus
    return round(score, 3)


def build_reasoning_line(hospital: dict) -> str:
    icu_pct = round((1 - hospital["icu_available"] / hospital["icu_total"]) * 100) if hospital["icu_total"] else 0
    if icu_pct >= 85:
        return f"{hospital['name']} ICU capacity high ({icu_pct}%)"
    elif icu_pct <= 40:
        return f"{hospital['name']} ICU capacity available ({100 - icu_pct}% free)"
    else:
        return f"{hospital['name']} ICU capacity moderate ({icu_pct}%)"



def calculate_hospital_score(hospital: dict, need_type: str) -> float:
    icu_availability_pct = hospital["icu_available"] / hospital["icu_total"] if hospital["icu_total"] else 0
    bed_availability_pct = hospital["available_beds"] / hospital["total_beds"] if hospital["total_beds"] else 0

    specialist_bonus = 0.0
    specialists = hospital.get("specialists", "").split(",")
    if need_type == "medical" and any(s in specialists for s in ["cardiac", "general"]):
        specialist_bonus = 0.1
    elif need_type in ("fire", "flood_rescue") and "trauma" in specialists:
        specialist_bonus = 0.15
    elif need_type == "orthopedic" and "orthopedic" in specialists:
        specialist_bonus = 0.15

    score = (icu_availability_pct * 0.6) + (bed_availability_pct * 0.3) + specialist_bonus
    return round(score, 3)


def build_reasoning_line(hospital: dict) -> str:
    icu_pct = round((1 - hospital["icu_available"] / hospital["icu_total"]) * 100) if hospital["icu_total"] else 0
    if icu_pct >= 85:
        return f"{hospital['name']} ICU capacity high ({icu_pct}%)"
    elif icu_pct <= 40:
        return f"{hospital['name']} ICU capacity available ({100 - icu_pct}% free)"
    else:
        return f"{hospital['name']} ICU capacity moderate ({icu_pct}%)"