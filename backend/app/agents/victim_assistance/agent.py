import json
from langchain_groq import ChatGroq
from app.config import settings
from app.agents.victim_assistance.prompts import EXTRACTION_PROMPT, REPLY_PROMPT
from app.utils.locations import resolve_coordinates

llm = ChatGroq(api_key=settings.groq_api_key, model="llama-3.3-70b-versatile", temperature=0)

async def process_victim_message(message: str, user_id: str) -> dict:
    extraction_response = await llm.ainvoke(EXTRACTION_PROMPT.format(message=message))
    extracted = json.loads(extraction_response.content)

    lat, lng = resolve_coordinates(extracted.get("location_text", ""))
    extracted["latitude"] = lat
    extracted["longitude"] = lng
    extracted["raw_message"] = message  # needed for stronger dedup embedding

    nearest_shelter = "Govt School, Rajendra Nagar"
    reply_response = await llm.ainvoke(REPLY_PROMPT.format(shelter_name=nearest_shelter))

    return {
        **extracted,
        "victim_reply": reply_response.content.strip(),
        "user_id": user_id,
    }