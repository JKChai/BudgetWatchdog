"use client";

import React, { useState, useMemo, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ShieldCheck, Info, ShieldAlert, Award, TrendingUp, Landmark, LineChart, Coins } from "lucide-react";

interface SavingsOption {
  title: string;
  apy: number;
  description: string;
  vehicles: string[];
  riskText: string;
  icon: any;
}

const SAVINGS_OPTIONS: Record<number, SavingsOption> = {
  1: {
    title: "Low Risk Allocation",
    apy: 4.5,
    description: "Focus on capital preservation and guaranteed returns. Perfect for short horizons.",
    vehicles: ["High-Yield Savings Accounts (HYSA)", "Certificates of Deposit (CDs)", "US Treasury Bills"],
    riskText: "Conservative",
    icon: Landmark,
  },
  2: {
    title: "Medium Risk Allocation",
    apy: 7.0,
    description: "A balanced blend of capital growth and income. Designed for moderate timelines.",
    vehicles: ["Balanced Index Funds (e.g., 60/40 Stock/Bond)", "Municipal & Corporate Bonds", "Large-Cap Dividend ETFs"],
    riskText: "Moderate",
    icon: LineChart,
  },
  3: {
    title: "High Risk Allocation",
    apy: 10.0,
    description: "Maximized capital growth potential. Highly volatile; suited for long time horizons.",
    vehicles: ["Broad Market Equities (e.g., S&P 500, Total Stock Index)", "Growth Stocks & Technology Sector ETFs", "Real Estate Investment Trusts (REITs)"],
    riskText: "Aggressive",
    icon: Coins,
  },
};

export default function SavingsPage() {
  const [startingAmount, setStartingAmount] = useState<number>(10000);
  const [timeHorizon, setTimeHorizon] = useState<number>(10);
  const [riskLevel, setRiskLevel] = useState<number>(2); // 1 = Low, 2 = Medium, 3 = High
  const [mounted, setMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute projections
  const projectionData = useMemo(() => {
    const data = [];
    const lowRate = 0.045;
    const medRate = 0.07;
    const highRate = 0.10;

    for (let year = 0; year <= timeHorizon; year++) {
      data.push({
        year: `Yr ${year}`,
        "Low Risk": Math.round(startingAmount * Math.pow(1 + lowRate, year)),
        "Medium Risk": Math.round(startingAmount * Math.pow(1 + medRate, year)),
        "High Risk": Math.round(startingAmount * Math.pow(1 + highRate, year)),
      });
    }
    return data;
  }, [startingAmount, timeHorizon]);

  // Selected Option details
  const selectedOption = SAVINGS_OPTIONS[riskLevel];
  const finalValue = projectionData[projectionData.length - 1];

  // Dynamic explanation
  const plainEnglishExplanation = useMemo(() => {
    const selectedRate = selectedOption.apy / 100;
    const totalGrowth = finalValue[riskLevel === 1 ? "Low Risk" : riskLevel === 2 ? "Medium Risk" : "High Risk"] - startingAmount;
    const isShortHorizon = timeHorizon <= 3;

    let advice = "";
    if (riskLevel === 3 && isShortHorizon) {
      advice = "Warning: A high-risk strategy is highly volatile and generally not recommended for timeframes under 5 years, as you may not have enough time to recover from potential market downturns.";
    } else if (riskLevel === 1 && !isShortHorizon) {
      advice = "Opportunity: While low-risk offers certainty, a longer time horizon (5+ years) allows you to absorb moderate market volatility for much higher compounded returns.";
    } else {
      advice = "Strategy Fit: Your risk tolerance matches your time horizon nicely, balancing growth and stability.";
    }

    return `By investing $${startingAmount.toLocaleString()} over a ${timeHorizon}-year horizon at an estimated ${selectedOption.apy}% APY (${selectedOption.riskText} risk), your savings are projected to reach $${finalValue[riskLevel === 1 ? "Low Risk" : riskLevel === 2 ? "Medium Risk" : "High Risk"].toLocaleString()}. This represents an estimated growth of $${totalGrowth.toLocaleString()}. ${advice}`;
  }, [startingAmount, timeHorizon, riskLevel, selectedOption, finalValue]);

  // Payload for API 
  const buildSavingsPayload = () => {
    const risk =
      riskLevel === 1 ? "low" :
        riskLevel === 3 ? "high" :
          "medium";

    return {
      starting_amount: startingAmount,
      years: timeHorizon,
      risk_level: risk,
    };
  };

  // State for Skills
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [analysisMode, setAnalysisMode] = useState<"plain" | "ai">("plain");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // handler 
  const handleProjectWithAI = async () => {
    setAiLoading(true);
    setAiError(null);

    try {
      const payload = buildSavingsPayload();

      const res = await fetch("/api/project-savings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setAiError(data.error ?? "AI savings projection failed");
        setAiLoading(false);
        return;
      }

      const data = await res.json();
      // console.log("AI savings data:", data);  // <-- debug
      setAnalysisMode("ai");  // switch to AI view
      // Use AI summary if available
      setAiExplanation(data.summary ?? "");
    } catch (err: any) {
      setAiError(String(err));
    } finally {
      setAiLoading(false);
    }
  };



  return (
    <div className="animate-fade-in">
      <h1 className="section-title">Risk-Aware Savings Coach</h1>
      <p className="section-desc">Model investment pathways, adjust horizons, and select savings vehicles suited to your comfort level.</p>

      <div className="dashboard-grid">
        {/* Sliders Panel */}
        <div className="glass-card col-4">
          <h2 className="section-title" style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Adjust Parameters</h2>

          {/* Starting Amount */}
          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <div className="flex-between">
              <label className="form-label">Starting Capital</label>
              <span style={{ fontWeight: 700, color: "var(--primary)" }}>${startingAmount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="100000"
              step="1000"
              value={startingAmount}
              onChange={(e) => setStartingAmount(Number(e.target.value))}
            />
          </div>

          {/* Time Horizon */}
          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <div className="flex-between">
              <label className="form-label">Time Horizon</label>
              <span style={{ fontWeight: 700, color: "var(--primary)" }}>{timeHorizon} Years</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={timeHorizon}
              onChange={(e) => setTimeHorizon(Number(e.target.value))}
            />
          </div>

          {/* Risk Tolerance */}
          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <div className="flex-between">
              <label className="form-label">Risk Tolerance</label>
              <span style={{ fontWeight: 700, color: "var(--primary)" }}>
                {riskLevel === 1 ? "Low" : riskLevel === 2 ? "Medium" : "High"}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="1"
              value={riskLevel}
              onChange={(e) => setRiskLevel(Number(e.target.value))}
            />
            <div className="flex-between" style={{ fontSize: "0.75rem", color: "var(--muted)", padding: "0 0.25rem" }}>
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--card-border)", marginTop: "1.5rem", paddingTop: "1.5rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
              <Info size={16} className="text-primary" style={{ flexShrink: 0, marginTop: "0.15rem" }} />
              <p className="text-muted" style={{ fontSize: "0.825rem", lineHeight: "1.4" }}>
                Low risk relies on guaranteed accounts. Medium risk blends stocks & bonds. High risk focuses on broad equities.
              </p>
            </div>
          </div>
        </div>

        {/* Projection Chart Card */}
        <div className="glass-card col-8" style={{ display: "flex", flexDirection: "column", minHeight: "350px" }}>
          <h2 className="section-title" style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Projected Portfolio Growth</h2>

          <div style={{ flex: 1, width: "100%", minHeight: "220px" }}>
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorMed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--card-border)" />
                  <XAxis dataKey="year" stroke="var(--muted)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--muted)" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--input-bg)",
                      borderColor: "var(--card-border)",
                      color: "var(--foreground)",
                      borderRadius: "8px",
                      fontSize: "0.85rem"
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Low Risk"
                    stroke="#0d9488"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorLow)"
                    hide={riskLevel !== 1}
                  />
                  <Area
                    type="monotone"
                    dataKey="Medium Risk"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorMed)"
                    hide={riskLevel !== 2}
                  />
                  <Area
                    type="monotone"
                    dataKey="High Risk"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorHigh)"
                    hide={riskLevel !== 3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex-center" style={{ height: "100%" }}>Loading projections...</div>
            )}
          </div>

          <div
            style={{
              borderTop: "1px solid var(--card-border)",
              paddingTop: "1rem",
              marginTop: "1rem",
            }}
          >
            <div
              className="flex-between"
              style={{ marginBottom: "0.5rem", alignItems: "center" }}
            >
              <h3
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                }}
              >
                <Award size={16} className="text-primary" />
                {analysisMode === "ai" ? "AI-Generated Analysis" : "Plain-English Analysis"}
              </h3>

              <div
                style={{
                  display: "inline-flex",
                  borderRadius: "999px",
                  background: "var(--muted-light)",
                  padding: "2px",
                  // border: "1px solid var(--primary)",          // add blue border
                  boxShadow: "0 0 0 1px rgba(59,130,246,0.12)", // soft blue glow (optional)
                }}
              >
                <button
                  type="button"
                  onClick={() => setAnalysisMode("plain")}
                  className="btn btn-secondary"
                  style={{
                    borderRadius: "999px",
                    fontSize: "0.8rem",
                    padding: "0.2rem 0.7rem",
                    background:
                      analysisMode === "plain"
                        ? "var(--input-bg)"
                        : "transparent",
                    color:
                      analysisMode === "plain"
                        ? "var(--foreground)"
                        : "var(--muted)",
                    border: analysisMode === "plain"
                      ? "1px solid var(--primary)"
                      : "none",
                  }}
                >
                  Plain English
                </button>
                <button
                  type="button"
                  onClick={handleProjectWithAI}
                  className="btn btn-secondary"
                  style={{
                    borderRadius: "999px",
                    fontSize: "0.8rem",
                    padding: "0.2rem 0.7rem",
                    background:
                      analysisMode === "ai"
                        ? "var(--input-bg)"
                        : "transparent",
                    color:
                      analysisMode === "ai"
                        ? "var(--foreground)"
                        : "var(--muted)",
                    border: analysisMode === "ai"
                      ? "1px solid var(--primary)"
                      : "none",
                  }}
                  disabled={aiLoading}
                >
                  {aiLoading ? "Projecting…" : "Project with AI"}
                </button>
              </div>
            </div>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--muted)",
                marginTop: "0.5rem",
                lineHeight: "1.5",
              }}
            >
              {analysisMode === "ai" && aiExplanation
                ? aiExplanation
                : plainEnglishExplanation}
            </p>

            {analysisMode === "ai" && aiExplanation && (
              <span
                className="badge"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  marginTop: "0.5rem",
                  fontSize: "0.75rem",
                  padding: "0.15rem 0.6rem",
                  borderRadius: "999px",
                  background: "var(--muted-light)",
                  color: "var(--foreground)",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "999px",
                    backgroundColor: "var(--primary)",
                  }}
                />
                Generated by AI agent
              </span>
            )}

            {aiError && (
              <p
                className="text-muted"
                style={{ fontSize: "0.8rem", color: "var(--warning-text)", marginTop: "0.4rem" }}
              >
                {aiError}
              </p>
            )}

          </div>

        </div>

        {/* Options Comparison Grid */}
        <div className="col-12" style={{ marginTop: "1.5rem" }}>
          <h2 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Savings Pathways by Risk Tier</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {[1, 2, 3].map((level) => {
              const option = SAVINGS_OPTIONS[level];
              const IconComp = option.icon;
              const isSelected = riskLevel === level;

              return (
                <div
                  key={level}
                  className="glass-card"
                  style={{
                    border: isSelected ? "2px solid var(--primary)" : "1px solid var(--card-border)",
                    boxShadow: isSelected ? "var(--shadow-lg)" : "var(--shadow)",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  {isSelected && (
                    <span
                      className="badge badge-success"
                      style={{
                        position: "absolute",
                        top: "-12px",
                        left: "1.5rem",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.15)"
                      }}
                    >
                      Selected Mode
                    </span>
                  )}

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                      <div className="logo-icon-wrapper" style={{ padding: "0.4rem", borderRadius: "8px", background: isSelected ? "rgba(var(--primary-rgb), 0.1)" : "var(--muted-light)" }}>
                        <IconComp size={20} className={isSelected ? "text-primary" : "text-muted"} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{option.title}</h3>
                        <span className="text-muted" style={{ fontSize: "0.8rem" }}>{option.riskText} Risk Profile</span>
                      </div>
                    </div>

                    <p className="text-muted" style={{ fontSize: "0.875rem", marginBottom: "1rem", lineHeight: "1.4" }}>
                      {option.description}
                    </p>

                    <div style={{ marginBottom: "1.5rem" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--foreground)", display: "block", marginBottom: "0.5rem" }}>
                        Recommended Vehicles:
                      </span>
                      <ul style={{ paddingLeft: "1.25rem", fontSize: "0.825rem", color: "var(--muted)", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                        {option.vehicles.map((v, i) => (
                          <li key={i}>{v}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex-between" style={{ borderTop: "1px solid var(--card-border)", paddingTop: "0.75rem", marginTop: "1rem" }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Est. Returns</span>
                    <strong style={{ fontSize: "1.25rem", color: level === 1 ? "var(--success)" : level === 2 ? "var(--primary)" : "var(--warning)" }}>
                      {option.apy}% APY
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
