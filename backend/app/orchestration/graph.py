import json
from langgraph.graph import StateGraph, END
from typing import TypedDict, Optional

from app.agents.victim_assistance.agent import process_victim_message
from app.agents.emergency_intelligence.agent import dedup_and_cluster
from app.agents.resource_finder.agent import match_resources
from app.agents.ngo_dashboard.agent import build_action_plan

class PipelineState(TypedDict):
    message: str
    user_id: str
    extracted: Optional[dict]
    incident: Optional[dict]
    resource_plan: Optional[dict]
    final_output: Optional[dict]

def load_hospitals():
    with open("data/mock_hospitals.json") as f:
        return json.load(f)

async def intake_node(state: PipelineState) -> PipelineState:
    state["extracted"] = await process_victim_message(state["message"], state["user_id"])
    return state

async def dedup_node(state: PipelineState) -> PipelineState:
    state["incident"] = await dedup_and_cluster(state["extracted"])
    return state

async def match_node(state: PipelineState) -> PipelineState:
    location = {
        "latitude": state["extracted"].get("latitude"),
        "longitude": state["extracted"].get("longitude"),
    }
    incident_with_need = {**state["incident"], "need_type": state["extracted"].get("need_type", "medical")}
    state["resource_plan"] = await match_resources(incident_with_need, location)
    return state

async def dashboard_node(state: PipelineState) -> PipelineState:
    hospitals = load_hospitals()
    state["final_output"] = await build_action_plan(
        state["extracted"], state["incident"], state["resource_plan"], hospitals
    )
    return state

def build_graph():
    graph = StateGraph(PipelineState)
    graph.add_node("intake", intake_node)
    graph.add_node("dedup", dedup_node)
    graph.add_node("match", match_node)
    graph.add_node("dashboard", dashboard_node)

    graph.set_entry_point("intake")
    graph.add_edge("intake", "dedup")
    graph.add_edge("dedup", "match")
    graph.add_edge("match", "dashboard")
    graph.add_edge("dashboard", END)

    return graph.compile()

pipeline = build_graph()