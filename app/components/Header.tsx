"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "../theme-context";
import { Sun, Moon, ShieldAlert, TrendingUp, DollarSign, Info } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch for client-side state (theme icon)
  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: "Home", href: "/", icon: DollarSign },
    { name: "Budget Watchdog", href: "/budget", icon: ShieldAlert },
    { name: "Savings Coach", href: "/savings", icon: TrendingUp },
    { name: "About App", href: "/about", icon: Info },
  ];

  return (
    <header className="main-header">
      <div className="header-container">
        <Link href="/" className="logo-section">
          <div className="logo-icon-wrapper">
            <ShieldAlert className="logo-icon text-primary animate-pulse" size={24} />
          </div>
          <span className="logo-text">
            Budget<span className="text-primary">Watchdog</span>
          </span>
        </Link>

        <nav className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link-item ${isActive ? "active" : ""}`}
              >
                <Icon size={18} className="nav-item-icon" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          aria-label="Toggle dark/light theme"
        >
          {mounted && theme === "dark" ? (
            <Sun className="toggle-icon text-warning" size={20} />
          ) : (
            <Moon className="toggle-icon text-muted" size={20} />
          )}
        </button>
      </div>
    </header>
  );
}
