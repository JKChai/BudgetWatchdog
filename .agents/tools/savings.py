from typing import Dict, Any, List


def savings_projection_skill(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Simple savings projection based on fixed annual rates per risk level.
    Input payload:
      {
        "starting_amount": float,
        "years": int,
        "risk_level": "low" | "medium" | "high"
      }
    """
    starting_amount = float(payload.get("starting_amount", 0.0) or 0.0)
    years = int(payload.get("years", 0) or 0)
    risk_level = str(payload.get("risk_level", "medium")).lower()

    # Fixed annual rates by risk level (keep it simple)
    if risk_level == "low":
        rate = 0.02  # 2%
    elif risk_level == "high":
        rate = 0.08  # 8%
    else:
        rate = 0.05  # default: medium = 5%

    points: List[Dict[str, float]] = []

    balance = starting_amount
    points.append({"year": 0, "balance": round(balance, 2)})

    for year in range(1, years + 1):
        # Compound interest: balance = balance * (1 + rate)
        balance *= (1.0 + rate)
        points.append({"year": year, "balance": round(balance, 2)})

    if years > 0:
        final_balance = points[-1]["balance"]
        summary = (
            f"At {risk_level} risk ({rate*100:.1f}% assumed annual return), "
            f"a {starting_amount:,.2f} starting balance grows to about {final_balance:,.2f} "
            f"after {years} years."
        )
    else:
        summary = "Set a time horizon greater than 0 years to see a savings projection."

    return {
        "points": points,
        "assumed_rate": rate,
        "summary": summary,
    }