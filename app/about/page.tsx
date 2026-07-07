import Link from "next/link";
import { ArrowLeft, User, ListPlus, FileCheck, HelpCircle, ShieldAlert, Award } from "lucide-react";

export default function About() {
  return (
    <div className="animate-fade-in" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <Link href="/" className="btn btn-secondary" style={{ marginBottom: "2rem", padding: "0.5rem 1rem" }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="glass-card" style={{ padding: "2.5rem" }}>
        <h1 className="section-title" style={{ fontSize: "2.25rem", marginBottom: "1rem" }}>
          About the Application
        </h1>
        <p className="section-desc" style={{ fontSize: "1.1rem", lineHeight: "1.6", marginBottom: "2.5rem" }}>
          <strong>Budget Watchdog + Risk-Aware Savings Coach</strong> is a personal finance app that bridges the gap between daily budgeting and long-term, risk-conscious wealth building.
        </p>

        {/* User Segment */}
        <section style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <User className="text-primary" size={24} />
            <h2 className="section-title" style={{ fontSize: "1.35rem", margin: 0 }}>Target User</h2>
          </div>
          <p style={{ color: "var(--muted)", lineHeight: "1.5", paddingLeft: "2rem" }}>
            Everyday individuals seeking to take control of their daily expenditures while simultaneously navigating the complexity of savings options aligned with their unique risk profiles.
          </p>
        </section>

        {/* Inputs */}
        <section style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <ListPlus className="text-primary" size={24} />
            <h2 className="section-title" style={{ fontSize: "1.35rem", margin: 0 }}>User Inputs</h2>
          </div>
          <ul style={{ color: "var(--muted)", lineHeight: "1.6", paddingLeft: "3.5rem" }}>
            <li><strong>CSV Ledger of Transactions</strong>: Recent transaction logs containing spend data.</li>
            <li><strong>Monthly Budget Limits</strong>: Maximum allowable spending targets per category.</li>
            <li><strong>Savings Goal</strong>: A specific target financial number (e.g. $15,000 for an emergency fund).</li>
            <li><strong>Time Horizon</strong>: Expected timeframe to reach the savings goal.</li>
            <li><strong>Risk Tolerance</strong>: General willingness to tolerate volatility (Low, Medium, High).</li>
          </ul>
        </section>

        {/* Outputs */}
        <section style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <FileCheck className="text-primary" size={24} />
            <h2 className="section-title" style={{ fontSize: "1.35rem", margin: 0 }}>Core Outputs</h2>
          </div>
          <ul style={{ color: "var(--muted)", lineHeight: "1.6", paddingLeft: "3.5rem" }}>
            <li><strong>Interactive Budget Summary</strong>: Breakdown of spending habits.</li>
            <li><strong>Overspend Alerts</strong>: Dynamic warnings when categories are close to or over limits.</li>
            <li><strong>Risk-Aware Savings suggestions</strong>: Specific product classes (CDs, ETFs, stocks) matching risk.</li>
            <li><strong>Plain-English Explanations</strong>: Intuitive breakdowns of budget status and options.</li>
          </ul>
        </section>

        {/* Why it's useful */}
        <section style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <Award className="text-primary" size={24} />
            <h2 className="section-title" style={{ fontSize: "1.35rem", margin: 0 }}>Why It's Useful</h2>
          </div>
          <p style={{ color: "var(--muted)", lineHeight: "1.5", paddingLeft: "2rem" }}>
            Most finance products act only as passive ledger books. This app actively guides users through their budgets and provides tailored, clear advice. It aligns savings decisions with risk profiles, letting users grow their money safely and confidently.
          </p>
        </section>

        <div style={{ borderTop: "1px solid var(--card-border)", paddingTop: "1.5rem", marginTop: "2rem", display: "flex", gap: "1rem" }}>
          <Link href="/budget" className="btn btn-primary">
            Get Started with Budgets
          </Link>
          <Link href="/savings" className="btn btn-secondary">
            Get Savings Coaching
          </Link>
        </div>
      </div>
    </div>
  );
}
