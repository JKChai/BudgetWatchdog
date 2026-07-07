import asyncio
from typing import Dict, Any

from google.adk.agents import LlmAgent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

from tools.transactions import analyze_transactions_skill

# 1. Define the ADK Agent
budget_agent = LlmAgent(
    name="BudgetAnalyst",
    model="gemini-2.5-flash",  # Swapped to a standard out-of-the-box Gemini model
    instruction=(
        "You are a budget analyst agent. Given transaction and budget data, "
        "produce a concise, friendly summary of which categories are overspent, "
        "which are safe, and any high-level advice. Do not repeat raw tables; "
        "focus on insights."
    ),
    description="Summarizes category-level budget status from transaction data.",
    tools=[analyze_transactions_skill],
)

# 2. Correctly initialize the Runner with the Session Service
session_service = InMemorySessionService()
budget_runner = Runner(
    app_name="budget_app",
    agent=budget_agent,
    session_service=session_service
)

async def _execute_agent_stream(content: types.Content) -> str:
    """Helper coroutine to safely create a session and gather streamed chunks."""
    user_id = "user_123"
    app_name = "budget_app"
    
    # FIX: Let ADK safely create a fresh session and capture its generated ID
    session = await session_service.create_session(
        app_name=app_name,
        user_id=user_id
    )
    
    # Pass the verified session.id straight to the runner
    events = budget_runner.run_async(
        user_id=user_id,
        session_id=session.id,
        new_message=content
    )
    
    response_chunks = []
    async for event in events:
        if event.content and event.content.parts:
            for part in event.content.parts:
                if part.text:
                    response_chunks.append(part.text)
                    
    return "".join(response_chunks)

async def run_budget_analyst(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Entry function called by orchestrator/HTTP endpoint.
    Processes payload and requests insights from the ADK agent.
    """
    transactions = payload.get("transactions", [])
    budgets = payload.get("budgets", {})

    stats = analyze_transactions_skill(transactions, budgets)
    categories = stats.get("categories", [])

    # Prepare a compact context for the agent
    context = {
        "categories": categories,
        "total_spent": stats.get("total_spent"),
        "overspent_categories": [c for c in categories if c.get("status") == "overspent"],
    }

    # Ask the ADK agent for a summary 
    user_query = (
        "Summarize this budget status for the user in 2-3 sentences. "
        "Highlight overspent categories and overall budget health.\n\n"
        f"Context: {context}"
    )

    # Format the input into an ADK Content object
    content = types.Content(
        role="user",
        parts=[types.Part(text=user_query)]
    )

    # Run the asynchronous runner stream inside this synchronous function
    try:
        summary_text = await _execute_agent_stream(content)
    except Exception as e:
        summary_text = f"Error generating agent summary: {str(e)}"

    return {
        "categories": categories,
        "summary": summary_text,
    }