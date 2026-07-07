from typing import List, Dict, Any


def analyze_transactions_skill(
    transactions: List[Dict[str, Any]],
    budgets: Dict[str, float],
) -> Dict[str, Any]:
    """
    Aggregate spending by category and compare against budget limits.

    :param transactions: list of {date, description, category, amount}
    :param budgets: {category_name: limit}
    :return: {
        "categories": [
            {
                "category": str,
                "spent": float,
                "limit": float,
                "percent_used": float,
                "status": "ok" | "overspent"
            },
            ...
        ]
    }
    """
    totals: Dict[str, float] = {}

    # 1. Sum spending per category
    for tx in transactions:
        category = tx.get("category")
        amount = float(tx.get("amount", 0.0) or 0.0)
        if not category:
            continue
        totals[category] = totals.get(category, 0.0) + amount

    categories_out: List[Dict[str, Any]] = []

    # Consider every category that has a budget
    for category, limit in budgets.items():
        spent = totals.get(category, 0.0)
        limit_val = float(limit) if limit is not None else 0.0
        if limit_val > 0:
            percent_used = spent / limit_val
        else:
            percent_used = 0.0

        status = "overspent" if percent_used > 1.0 else "ok"

        categories_out.append(
            {
                "category": category,
                "spent": round(spent, 2),
                "limit": round(limit_val, 2),
                "percent_used": round(percent_used, 3),
                "status": status,
            }
        )

    # Optionally, handle categories that appear in totals but not in budgets
    for category, spent in totals.items():
        if category in budgets:
            continue
        categories_out.append(
            {
                "category": category,
                "spent": round(spent, 2),
                "limit": 0.0,
                "percent_used": 0.0,
                "status": "ok",
            }
        )

    return {"categories": categories_out}