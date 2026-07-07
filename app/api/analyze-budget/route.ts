import { NextRequest, NextResponse } from "next/server";

const PYTHON_SERVICE_URL = "http://127.0.0.1:8001/analyze-budget";

export async function POST(req: NextRequest) {
    try {
        const payload = await req.json();

        const res = await fetch(PYTHON_SERVICE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const text = await res.text();
            return NextResponse.json(
                { error: "Python service error", details: text },
                { status: 500 }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json(
            { error: "Failed to call analyze-budget", details: String(err) },
            { status: 500 }
        );
    }
}