import asyncio
from typing import Dict, Any

from google.adk.agents import LlmAgent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

from tools.savings import savings_projection_skill

savings_agent = LlmAgent(
    name="SavingsCoach",
    model="gemini-2.5-flash",
    instruction=(
        "You are a savings projection coach. Given the numeric projection data "
        "and risk level, explain what the user can expect in plain language, "
        "highlighting final value, risk tradeoffs, and one practical suggestion."
    ),
    description="Summarizes projected savings and risk tradeoffs.",
    tools=[savings_projection_skill],
)

savings_session_service = InMemorySessionService()
savings_runner = Runner(
    app_name="savings_app",
    agent=savings_agent,
    session_service=savings_session_service,
)

async def _execute_savings_stream(content: types.Content) -> str:
    user_id = "user_123"
    app_name = "savings_app"

    session = await savings_session_service.create_session(
        app_name=app_name,
        user_id=user_id,
    )

    events = savings_runner.run_async(
        user_id=user_id,
        session_id=session.id,
        new_message=content,
    )

    chunks: list[str] = []
    async for event in events:
        if event.content and event.content.parts:
            for part in event.content.parts:
                if getattr(part, "text", None):
                    chunks.append(part.text)

    return "".join(chunks)

async def run_savings_agent(payload: Dict[str, Any]) -> Dict[str, Any]:
    stats = savings_projection_skill(payload)

    context = {
        "starting_amount": payload.get("starting_amount"),
        "years": payload.get("years"),
        "risk_level": payload.get("risk_level"),
    }

    user_query = (
        "Explain this savings projection in 2–3 sentences. "
        "Summarize the final balance, how risk level affects growth, "
        "and give one concrete suggestion.\n\n"
        f"Context: {context}"
    )

    content = types.Content(
        role="user",
        parts=[types.Part(text=user_query)],
    )

    try:
        summary_text = await _execute_savings_stream(content)
    except Exception as e:
        summary_text = f"Error generating savings summary: {str(e)}"

    return {
        "stats": stats,
        "summary": summary_text,
    }