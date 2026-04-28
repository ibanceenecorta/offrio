"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Comment ça marche", href: "#comment" },
    { label: "Tarifs", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading text-2xl" style={{ color: "#F1F5F9", letterSpacing: "0.18em" }}>
              OFFRIO
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {links.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors duration-150"
                style={{ color: "var(--text-2)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-2)")}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="btn-secondary" style={{ padding: "8px 18px", fontSize: "14px" }}>
              Se connecter
            </Link>
            <Link href="/register" className="btn-primary" style={{ padding: "8px 18px", fontSize: "14px" }}>
              Essai gratuit
            </Link>
          </div>

          {/* Mobile right */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/register" className="btn-primary" style={{ padding: "7px 14px", fontSize: "13px" }}>
              Essai gratuit
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#F1F5F9", padding: "8px" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div
            className="md:hidden px-4 pb-4 space-y-2"
            style={{ background: "rgba(15,23,42,0.98)", borderTop: "1px solid var(--border-2)" }}
          >
            {links.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-sm font-medium"
                style={{ color: "var(--text-2)", borderBottom: "1px solid var(--border)" }}
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-sm font-medium"
              style={{ color: "var(--text-2)" }}
            >
              Se connecter
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
