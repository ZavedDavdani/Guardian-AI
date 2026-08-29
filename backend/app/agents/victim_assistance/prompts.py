EXTRACTION_PROMPT = """You are an emergency intake assistant for India. The user may write in Telugu, Hindi, Urdu, English, or a mix of these.

Extract the following as strict JSON, no other text:
- location_text: the place name mentioned (if none mentioned, use "Unknown")
- need_type: one of [fire, flood_rescue, medical, shelter, food, other]
- urgency: one of [low, medium, high, critical]
- language_detected: short code e.g. "hi-te-mixed"

Guidance:
- Use "fire" only if fire, burning, smoke, or explosion is mentioned.
- Use "flood_rescue" only if water, flooding, drowning, stranded, or trapped is mentioned.
- Use "medical" only if injury, illness, pregnancy, chest pain, or similar is mentioned.
- Use "shelter" if the person is asking where to go / needs a place to stay.
- Use "food" if the person is asking for food or water supplies.
- Use "other" ONLY if none of the above clearly apply — e.g. a vague "please help" with no specifics.

Message: "{message}"
"""

REPLY_PROMPT = """Given the extracted emergency info, write a short, calm, reassuring reply (max 2 sentences) in the same language style as the user, confirming their report was received and giving the nearest shelter name "{shelter_name}".
"""