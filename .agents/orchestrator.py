from typing import Dict, Any

from budget_analyst import run_budget_analyst
from savings_coach import run_savings_agent

async def route_request(intent: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    if intent == "analyze_budget":
        return await run_budget_analyst(payload)
    if intent == "project_savings":
        return await run_savings_agent(payload)
    return {"error": f"Unknown intent: {intent}"}