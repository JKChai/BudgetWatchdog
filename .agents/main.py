import os
from dotenv import load_dotenv
import google.genai as genai
from google.genai.types import GenerateContentConfig

load_dotenv()  # load variables from .env into environment

GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")

if not GOOGLE_API_KEY:
    raise RuntimeError("Missing GEMINI_API_KEY in .env")

client = genai.Client(api_key=GOOGLE_API_KEY)


from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any

from orchestrator import route_request 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# for testing 
@app.get("/test-gemini")
async def test_gemini():
    try:
        response = client.models.generate_content(
            model="gemma-4-31b-it",
            contents="Tell me what model are you?",
            config=GenerateContentConfig(
                max_output_tokens=128,
                temperature=0.4,
            ),
        )
        # The SDK returns structured content; simplest is to stringify for now
        text = str(response)
        return {"message": text}
    except ClientError as e:
        return {"error": str(e)}

# @app.post("/budget-analyst")
# async def budget_analyst_endpoint(payload: dict):
#     """
#     Payload is expected to have:
#       - transactions: list of {date, description, category, amount}
#       - budgets: mapping {category: limit}
#     """
#     result = run_budget_analyst(payload)
#     return result

@app.post("/analyze-budget")
async def analyze_budget(request: Request) -> Dict[str, Any]:
    payload = await request.json()
    result = await route_request("analyze_budget", payload)
    return result

@app.post("/project-savings")
async def project_savings(request: Request) -> Dict[str, Any]:
    payload = await request.json()
    # print("Savings payload:", payload)  # debug
    result = await route_request("project_savings", payload)
    # print("Savings result:", result)    # debug
    return result

