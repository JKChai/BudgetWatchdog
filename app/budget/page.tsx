"use client";

import React, { useState, useMemo } from "react";
import Papa from "papaparse";
import { Plus, Upload, ShieldAlert, AlertTriangle, CheckCircle, TrendingDown, DollarSign } from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
}

interface CategoryLimit {
  category: string;
  limit: number;
}

const DEFAULT_TRANSACTIONS: Transaction[] = [
  { id: "1", date: "2026-07-01", description: "Whole Foods Market", category: "Food & Groceries", amount: 154.30 },
  { id: "2", date: "2026-07-01", description: "Metropolitan Landlord Rent", category: "Rent & Utilities", amount: 1200.00 },
  { id: "3", date: "2026-07-02", description: "Netflix Subscription", category: "Entertainment", amount: 15.99 },
  { id: "4", date: "2026-07-02", description: "Blue Bottle Coffee", category: "Food & Groceries", amount: 6.75 },
  { id: "5", date: "2026-07-03", description: "Uber Ride", category: "Travel & Transport", amount: 24.50 },
  { id: "6", date: "2026-07-03", description: "Zara Clothing", category: "Shopping", amount: 89.90 },
  { id: "7", date: "2026-07-04", description: "Local Bistro Dinner", category: "Food & Groceries", amount: 120.00 },
];

const DEFAULT_LIMITS: CategoryLimit[] = [
  { category: "Food & Groceries", limit: 400 },
  { category: "Rent & Utilities", limit: 1300 },
  { category: "Entertainment", limit: 100 },
  { category: "Shopping", limit: 200 },
  { category: "Travel & Transport", limit: 150 },
];

const SAMPLE_CSV_CONTENT = `Date,Description,Category,Amount
2026-07-04,Steam Game Purchase,Entertainment,59.99
2026-07-04,Chevron Gas Station,Travel & Transport,45.00
2026-07-05,Trader Joe's,Food & Groceries,112.50
2026-07-05,Target Store,Shopping,134.00
2026-07-05,Electric Utility Bill,Rent & Utilities,115.00`;

export default function BudgetPage() {

  // AI-related state 
  const [aiCategories, setAiCategories] = useState<
    { category: string; spent: number; limit: number; percent_used: number; status: string }[]
  >([]);

  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const [transactions, setTransactions] = useState<Transaction[]>(DEFAULT_TRANSACTIONS);
  const [limits, setLimits] = useState<CategoryLimit[]>(DEFAULT_LIMITS);

  // New Transaction Form State
  const [newDesc, setNewDesc] = useState("");
  const [newCat, setNewCat] = useState("Food & Groceries");
  const [newAmount, setNewAmount] = useState("");
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);

  // Edit Limits State
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editLimitVal, setEditLimitVal] = useState("");

  // helper to build the payload from transactions and limits 
  const buildAnalyzePayload = () => {
    const budgets = limits.reduce((acc, cur) => {
      acc[cur.category] = cur.limit;
      return acc;
    }, {} as Record<string, number>);

    return { transactions, budgets };
  };

  // Calculate totals by category
  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    // Seed totals with categories
    limits.forEach((l) => {
      totals[l.category] = 0;
    });

    transactions.forEach((tx) => {
      if (totals[tx.category] !== undefined) {
        totals[tx.category] += tx.amount;
      } else {
        totals[tx.category] = tx.amount;
      }
    });
    return totals;
  }, [transactions, limits]);

  // handler that calls /api/analyze-budget
  const handleAnalyzeWithAI = async () => {
    setAiLoading(true);
    setAiError(null);

    try {
      const payload = buildAnalyzePayload();

      const res = await fetch("/api/analyze-budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setAiError(data.error ?? "AI analysis failed");
        setAiLoading(false);
        return;
      }

      const data = await res.json();
      setAiCategories(data.categories ?? []);
      setAiSummary(data.summary ?? null);
    } catch (err: any) {
      setAiError(String(err));
    } finally {
      setAiLoading(false);
    }
  };


  // Handle Limit Changes
  const handleSaveLimit = (category: string) => {
    const numericVal = parseFloat(editLimitVal);
    if (!isNaN(numericVal) && numericVal >= 0) {
      setLimits(prev => prev.map(item => item.category === category ? { ...item, limit: numericVal } : item));
    }
    setEditingCategory(null);
    setEditLimitVal("");
  };

  const handleStartEditLimit = (category: string, currentVal: number) => {
    setEditingCategory(category);
    setEditLimitVal(currentVal.toString());
  };

  // Add Custom Transaction
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(newAmount);
    if (!newDesc || isNaN(amountVal) || amountVal <= 0) return;

    const newTx: Transaction = {
      id: Date.now().toString(),
      date: newDate,
      description: newDesc,
      category: newCat,
      amount: amountVal,
    };

    setTransactions(prev => [newTx, ...prev]);
    setNewDesc("");
    setNewAmount("");
  };

  // Parse CSV Mock Upload
  const handleCSVUploadSim = () => {
    Papa.parse<string[]>(SAMPLE_CSV_CONTENT, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data.map((row: any, idx) => ({
          id: `csv-${Date.now()}-${idx}`,
          date: row.Date || new Date().toISOString().split("T")[0],
          description: row.Description || "Imported Item",
          category: row.Category || "Other",
          amount: parseFloat(row.Amount) || 0,
        }));
        setTransactions(prev => [...parsed, ...prev]);
      }
    });
  };

  // Alerts calculations
  const overspentCategories = useMemo(() => {
    return limits.filter(l => {
      const spent = categoryTotals[l.category] || 0;
      return spent > l.limit;
    });
  }, [limits, categoryTotals]);

  return (
    <div className="animate-fade-in">
      <h1 className="section-title">Budget Watchdog</h1>
      <p className="section-desc">Audit your transactions and monitor real-time spending warnings relative to category caps.</p>

      {/* Alert Banner if over budget */}
      {overspentCategories.length > 0 && (
        <div className="glass-card" style={{ background: "rgba(244, 63, 94, 0.1)", border: "1px solid var(--warning)", marginBottom: "2rem", borderRadius: "12px", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
          <ShieldAlert className="text-warning" size={24} style={{ marginTop: "0.25rem", flexShrink: 0 }} />
          <div>
            <h3 style={{ color: "var(--warning-text)", fontWeight: 700, fontSize: "1.1rem" }}>Overspend Alert!</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.925rem", marginTop: "0.25rem" }}>
              The following category budgets have exceeded limits:{" "}
              {overspentCategories.map((c, idx) => (
                <strong key={c.category} style={{ color: "var(--warning-text)" }}>
                  {c.category} ({((categoryTotals[c.category] || 0) - c.limit).toFixed(2)} over)
                  {idx < overspentCategories.length - 1 ? ", " : ""}
                </strong>
              ))}
            </p>
          </div>
        </div>
      )}


      {/* AI analysis trigger + insight */}
      <div
        className="glass-card"
        style={{
          marginBottom: "2rem",
          borderRadius: "12px",
          padding: "1.25rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        <div className="flex-between" style={{ alignItems: "center", marginBottom: "0.5rem" }}>
          <h2
            className="section-title"
            style={{ fontSize: "1.1rem", margin: 0 }}
          >
            AI Budget Insight
          </h2>

          <button
            onClick={handleAnalyzeWithAI}
            className="btn btn-secondary"
            style={{
              fontSize: "0.85rem",
              padding: "0.4rem 0.9rem",
              borderRadius: "999px",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              whiteSpace: "nowrap",
            }}
            disabled={aiLoading}
          >
            {aiLoading ? "Analyzing…" : "Analyze with AI"}
          </button>
        </div>

        {aiError && (
          <p
            className="text-muted"
            style={{ fontSize: "0.8rem", color: "var(--warning-text)" }}
          >
            AI analysis error: {aiError}
          </p>
        )}

        {aiSummary && (
          <p
            className="text-muted"
            style={{ fontSize: "0.9rem", marginTop: "0.25rem" }}
          >
            {aiSummary}
          </p>
        )}

        {aiCategories.length > 0 && (
          <div
            style={{
              marginTop: "0.75rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {aiCategories.map((c) => (
              <div
                key={c.category}
                style={{
                  borderRadius: "10px",
                  padding: "0.6rem 0.75rem",
                  background: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.2rem",
                }}
              >
                <div className="flex-between" style={{ fontSize: "0.85rem" }}>
                  <span style={{ fontWeight: 600 }}>{c.category}</span>
                  <span style={{ fontWeight: 500 }}>
                    ${c.spent.toFixed(2)} / ${c.limit.toFixed(2)}
                  </span>
                </div>
                <div className="flex-between" style={{ fontSize: "0.8rem", marginTop: "0.1rem" }}>
                  <span className="text-muted">
                    {(c.percent_used * 100).toFixed(1)}% used
                  </span>
                  <span
                    className="badge"
                    style={{
                      fontSize: "0.75rem",
                      padding: "0.1rem 0.45rem",
                      borderRadius: "999px",
                      background:
                        c.status === "overspent"
                          ? "rgba(244, 63, 94, 0.12)"
                          : "rgba(16, 185, 129, 0.12)",
                      color:
                        c.status === "overspent"
                          ? "var(--warning-text)"
                          : "var(--success)",
                    }}
                  >
                    {c.status === "overspent" ? "Overspent" : "Safe"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      <div className="dashboard-grid">
        {/* Category Limits & Progress Bars */}
        <div className="glass-card col-8">
          <h2 className="section-title" style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Category Spend Summary</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {limits.map((limitObj) => {
              const spent = categoryTotals[limitObj.category] || 0;
              const percent = Math.min(100, Math.round((spent / limitObj.limit) * 100));
              const isOver = spent > limitObj.limit;

              return (
                <div key={limitObj.category}>
                  <div className="flex-between">
                    <div>
                      <span style={{ fontWeight: 600 }}>{limitObj.category}</span>
                      <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: "0.25rem" }}>
                        {isOver ? (
                          <span className="text-warning" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            <AlertTriangle size={12} /> Limit exceeded
                          </span>
                        ) : (
                          <span className="text-success" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            <CheckCircle size={12} /> Safe budget
                          </span>
                        )}
                      </p>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div>
                        <strong>${spent.toFixed(2)}</strong>{" "}
                        <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>/</span>{" "}
                        {editingCategory === limitObj.category ? (
                          <div style={{ display: "inline-flex", gap: "0.25rem", alignItems: "center" }}>
                            <input
                              type="number"
                              className="form-input"
                              style={{ width: "80px", padding: "0.25rem", fontSize: "0.85rem" }}
                              value={editLimitVal}
                              onChange={(e) => setEditLimitVal(e.target.value)}
                            />
                            <button className="btn btn-primary" style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }} onClick={() => handleSaveLimit(limitObj.category)}>Save</button>
                          </div>
                        ) : (
                          <span
                            onClick={() => handleStartEditLimit(limitObj.category, limitObj.limit)}
                            style={{ borderBottom: "1px dashed var(--primary)", color: "var(--primary)", cursor: "pointer", fontSize: "0.9rem" }}
                            title="Click to edit limit"
                          >
                            ${limitObj.limit}
                          </span>
                        )}
                      </div>
                      <span className="text-muted" style={{ fontSize: "0.8rem" }}>{percent}% used</span>
                    </div>
                  </div>

                  <div className="progress-bar-container">
                    <div
                      className={`progress-bar-fill ${isOver ? "warning" : "success"}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Transaction & CSV simulation panel */}
        <div className="glass-card col-4">
          <h2 className="section-title" style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Add Transaction</h2>
          <form onSubmit={handleAddTransaction}>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="form-input" value={newDate} onChange={e => setNewDate(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <input type="text" className="form-input" placeholder="e.g. Whole Foods" value={newDesc} onChange={e => setNewDesc(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input" value={newCat} onChange={e => setNewCat(e.target.value)}>
                {limits.map(l => (
                  <option key={l.category} value={l.category}>{l.category}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Amount ($)</label>
              <input type="number" step="0.01" className="form-input" placeholder="0.00" value={newAmount} onChange={e => setNewAmount(e.target.value)} required />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }}>
              <Plus size={16} /> Add Transaction
            </button>
          </form>

          <div style={{ borderTop: "1px solid var(--card-border)", marginTop: "1.5rem", paddingTop: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>CSV Operations</h3>
            <p className="text-muted" style={{ fontSize: "0.85rem", marginBottom: "1rem" }}>
              Upload your transaction ledger to update your budget dynamically.
            </p>
            <button className="btn btn-secondary" style={{ width: "100%" }} onClick={handleCSVUploadSim}>
              <Upload size={16} /> Import Mock CSV Data
            </button>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="glass-card col-12" style={{ marginTop: "1rem" }}>
          <div className="flex-between" style={{ marginBottom: "1.5rem" }}>
            <h2 className="section-title" style={{ fontSize: "1.25rem", margin: 0 }}>Transaction Log</h2>
            <span className="text-muted" style={{ fontSize: "0.9rem" }}>Total Rows: {transactions.length}</span>
          </div>

          <div className="table-container">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.date}</td>
                    <td style={{ fontWeight: 500 }}>{tx.description}</td>
                    <td>
                      <span className="badge badge-success" style={{ background: "var(--muted-light)", color: "var(--foreground)" }}>
                        {tx.category}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: "var(--foreground)" }}>
                      ${tx.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
