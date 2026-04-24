"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="font-heading text-2xl"
            style={{ color: "#F1F5F9", letterSpacing: "0.18em" }}
          >
            OFFRIO
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {[
            { label: "Comment ça marche", href: "#comment" },
            { label: "Tarifs", href: "#pricing" },
            { label: "FAQ", href: "#faq" },
          ].map((item) => (
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

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="btn-secondary"
            style={{ padding: "8px 18px", fontSize: "14px" }}
          >
            Se connecter
          </Link>
          <Link
            href="/register"
            className="btn-primary"
            style={{ padding: "8px 18px", fontSize: "14px" }}
          >
            Essai gratuit
          </Link>
        </div>
      </div>
    </nav>
  );
}
