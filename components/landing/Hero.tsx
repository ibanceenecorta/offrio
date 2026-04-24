"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const stats = [
  { label: "AOs analysés", target: 1200, suffix: "+" },
  { label: "Pertinence IA", target: 98, suffix: "%" },
  { label: "Artisans actifs", target: 47, suffix: "" },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const step = Math.ceil(target / 40);
          const timer = setInterval(() => {
            start += step;
            if (start >= target) { setValue(target); clearInterval(timer); }
            else setValue(start);
          }, 35);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="font-heading text-5xl md:text-6xl" style={{ color: "#F1F5F9", letterSpacing: "0.02em" }}>
      {value.toLocaleString("fr-FR")}{suffix}
    </span>
  );
}

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 overflow-hidden hero-grid hero-mesh"
    >
      {/* Top badge */}
      <div className="anim-fadeUp d-1 mb-8">
        <span
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
          style={{
            background: "rgba(37,99,235,0.12)",
            border: "1px solid rgba(37,99,235,0.28)",
            color: "#93C5FD",
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: "#22C55E", boxShadow: "0 0 6px rgba(34,197,94,0.6)", animation: "pulseGlow 2s infinite" }}
          />
          Alimenté par l&apos;IA · Source BOAMP officielle
        </span>
      </div>

      {/* Headline */}
      <div className="text-center max-w-4xl px-6 z-10">
        <h1
          className="font-heading anim-fadeUp d-2 leading-none mb-6"
          style={{ fontSize: "clamp(56px, 9vw, 96px)", color: "#F1F5F9", letterSpacing: "0.02em" }}
        >
          NE RATEZ PLUS<br />
          <span className="text-gradient-blue">AUCUN APPEL</span><br />
          D&apos;OFFRES
        </h1>

        <p
          className="anim-fadeUp d-3 text-lg md:text-xl leading-relaxed mb-10 mx-auto"
          style={{ color: "var(--text-2)", maxWidth: "620px" }}
        >
          OFFRIO détecte, analyse et résume automatiquement les appels d&apos;offres
          publics adaptés à votre métier.{" "}
          <span style={{ color: "var(--text)" }}>Chaque matin dans votre boîte mail.</span>
        </p>

        <div className="anim-fadeUp d-4 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/register" className="btn-primary" style={{ padding: "14px 32px", fontSize: "16px" }}>
            Commencer — 14 jours gratuits
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <a href="#comment" className="btn-secondary" style={{ padding: "14px 32px", fontSize: "16px" }}>
            Voir comment ça marche
          </a>
        </div>

        {/* Stats */}
        <div
          className="anim-fadeUp d-5 grid grid-cols-3 gap-6 max-w-xl mx-auto"
          style={{ borderTop: "1px solid var(--border-2)", paddingTop: "40px" }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <Counter target={stat.target} suffix={stat.suffix} />
              <span className="text-sm" style={{ color: "var(--text-3)" }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(37,99,235,0.07) 0%, transparent 70%)",
        }}
      />
    </section>
  );
}
