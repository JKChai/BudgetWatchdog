import Link from "next/link";
import { ShieldAlert, TrendingUp, HelpCircle, ArrowRight, Wallet, AlertTriangle, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="text-center" style={{ margin: "2rem 0 4rem 0" }}>
        <h1 className="section-title" style={{ fontSize: "3rem", lineHeight: "1.15", marginBottom: "1rem" }}>
          Smart Budgeting Meets <br />
          <span className="text-primary">Risk-Aware Saving</span>
        </h1>
        <p className="section-desc" style={{ maxWidth: "600px", margin: "0 auto", fontSize: "1.15rem" }}>
          Analyze your transactions, set dynamic budget limits, and get customized savings recommendations aligned with your risk tolerance.
        </p>
      </section>

      {/* Overview Stat Cards */}
      <div className="dashboard-grid" style={{ marginBottom: "3rem" }}>
        <div className="glass-card col-4">
          <div className="flex-between">
            <span className="text-muted" style={{ fontWeight: 600 }}>Total Monthly Spending</span>
            <Wallet className="text-primary" size={20} />
          </div>
          <p className="stat-value">$1,845.20</p>
          <span className="badge badge-success">On Track</span>
        </div>

        <div className="glass-card col-4">
          <div className="flex-between">
            <span className="text-muted" style={{ fontWeight: 600 }}>Current Budget Limit</span>
            <ShieldCheck className="text-success" size={20} />
          </div>
          <p className="stat-value">$2,500.00</p>
          <span className="text-muted" style={{ fontSize: "0.85rem" }}>74% of limit utilized</span>
        </div>

        <div className="glass-card col-4">
          <div className="flex-between">
            <span className="text-muted" style={{ fontWeight: 600 }}>Active Savings Goal</span>
            <TrendingUp className="text-warning" size={20} />
          </div>
          <p className="stat-value">$15,000</p>
          <span className="text-muted" style={{ fontSize: "0.85rem" }}>Target: 18 Months</span>
        </div>
      </div>

      {/* Main Feature Blocks */}
      <div className="dashboard-grid">
        {/* Budget Watchdog Card */}
        <div className="glass-card col-6" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div className="logo-icon-wrapper" style={{ width: "fit-content", marginBottom: "1.5rem", background: "rgba(225, 29, 72, 0.1)" }}>
              <ShieldAlert className="text-warning" size={32} />
            </div>
            <h2 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>Budget Watchdog</h2>
            <p className="section-desc" style={{ marginBottom: "1.5rem" }}>
              Upload your transaction ledger, set monthly category spending thresholds, and receive real-time warnings before you overspend.
            </p>
            
            {/* Quick mini-dashboard preview */}
            <div style={{ background: "var(--muted-light)", padding: "1rem", borderRadius: "12px", marginBottom: "1.5rem" }}>
              <div className="flex-between" style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                <span>Dining & Entertainment</span>
                <span className="text-warning" style={{ fontWeight: 600 }}>$450 / $400</span>
              </div>
              <div className="progress-bar-container" style={{ height: "6px" }}>
                <div className="progress-bar-fill warning" style={{ width: "100%" }}></div>
              </div>
              <div className="flex-between" style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "var(--warning)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <AlertTriangle size={12} /> Limit exceeded by $50.00
                </span>
              </div>
            </div>
          </div>

          <Link href="/budget" className="btn btn-primary" style={{ width: "fit-content" }}>
            Audit Transactions <ArrowRight size={16} />
          </Link>
        </div>

        {/* Savings Coach Card */}
        <div className="glass-card col-6" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div className="logo-icon-wrapper" style={{ width: "fit-content", marginBottom: "1.5rem", background: "rgba(13, 148, 136, 0.1)" }}>
              <TrendingUp className="text-success" size={32} />
            </div>
            <h2 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>Risk-Aware Savings Coach</h2>
            <p className="section-desc" style={{ marginBottom: "1.5rem" }}>
              Model savings pathways by adjusting your investment timeframe and risk tolerance. Recieve tailored allocation recommendations.
            </p>

            {/* Quick mini-dashboard preview */}
            <div style={{ background: "var(--muted-light)", padding: "1rem", borderRadius: "12px", marginBottom: "1.5rem" }}>
              <div className="flex-between" style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                <span>Risk Level: Medium</span>
                <span style={{ color: "var(--success)", fontWeight: 600 }}>6.5% Est. APY</span>
              </div>
              <div className="progress-bar-container" style={{ height: "6px" }}>
                <div className="progress-bar-fill success" style={{ width: "65%" }}></div>
              </div>
              <p style={{ fontSize: "0.8rem", marginTop: "0.5rem", color: "var(--muted)" }}>
                Recommended: 60% Index Funds, 30% Bonds, 10% Cash/HYSA.
              </p>
            </div>
          </div>

          <Link href="/savings" className="btn btn-primary" style={{ width: "fit-content" }}>
            Model Savings Goals <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Value Prop Banner */}
      <section className="glass-card col-12 text-center" style={{ marginTop: "3rem", padding: "2.5rem 1.5rem" }}>
        <h3 className="section-title" style={{ fontSize: "1.35rem", marginBottom: "0.5rem" }}>Why use Budget Watchdog + Risk-Aware Savings Coach?</h3>
        <p className="section-desc" style={{ maxWidth: "700px", margin: "0 auto 1.5rem auto" }}>
          Most financial apps stop at telling you what you spent. We link your current spending patterns directly to your long-term savings goals, providing clear pathways to grow your wealth based on your personal risk comfort.
        </p>
        <Link href="/about" className="btn btn-secondary">
          <HelpCircle size={16} /> Learn More About the Methodology
        </Link>
      </section>
    </div>
  );
}
