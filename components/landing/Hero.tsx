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
    <span ref={ref} className="font-heading text-4xl md:text-5xl" style={{ color: "#F0F4FF", letterSpacing: "0.02em" }}>
      {value.toLocaleString("fr-FR")}{suffix}
    </span>
  );
}

function EmailMockup() {
  return (
    <div
      className="relative w-full max-w-sm mx-auto anim-float"
      style={{ filter: "drop-shadow(0 40px 80px rgba(79,110,247,0.25))" }}
    >
      {/* Glow behind card */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(79,110,247,0.18) 0%, transparent 70%)",
          transform: "scale(1.1)",
        }}
      />

      {/* Email card */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "rgba(10,12,30,0.9)",
          border: "1px solid rgba(79,110,247,0.25)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Email header */}
        <div
          style={{
            background: "linear-gradient(135deg, #0E1128, #151830)",
            padding: "16px 20px",
            borderBottom: "1px solid rgba(79,110,247,0.12)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className="font-heading text-base font-bold"
                style={{ color: "#F0F4FF", letterSpacing: "0.15em" }}
              >
                OFFRIO
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "rgba(79,110,247,0.15)", color: "#93B4FF", border: "1px solid rgba(79,110,247,0.25)" }}
              >
                IA
              </span>
            </div>
            <span className="text-xs" style={{ color: "var(--text-3)" }}>07:00</span>
          </div>
          <p className="text-xs font-semibold" style={{ color: "var(--text-2)" }}>
            Bonjour Martin, 3 nouveaux AOs ce matin
          </p>
        </div>

        {/* AO Card 1 */}
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(79,110,247,0.08)" }}>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              <p className="text-xs font-semibold mb-1" style={{ color: "#F0F4FF" }}>
                Rénovation toiture — Mairie de Lyon
              </p>
              <p className="text-xs" style={{ color: "var(--text-2)" }}>
                Rhône · Avant le 15 juin 2025
              </p>
            </div>
            <span
              className="text-xs font-bold px-2 py-1 rounded-lg shrink-0"
              style={{ background: "rgba(34,197,94,0.12)", color: "#4ADE80", border: "1px solid rgba(34,197,94,0.2)" }}
            >
              94/100
            </span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-3)" }}>
            Charpente bois, tuiles mécaniques. Lot unique. Budget estimé 180 000€...
          </p>
        </div>

        {/* AO Card 2 */}
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(79,110,247,0.08)" }}>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              <p className="text-xs font-semibold mb-1" style={{ color: "#F0F4FF" }}>
                Étanchéité bâtiments industriels
              </p>
              <p className="text-xs" style={{ color: "var(--text-2)" }}>
                Ain · Avant le 22 juin 2025
              </p>
            </div>
            <span
              className="text-xs font-bold px-2 py-1 rounded-lg shrink-0"
              style={{ background: "rgba(245,158,11,0.12)", color: "#FCD34D", border: "1px solid rgba(245,158,11,0.2)" }}
            >
              81/100
            </span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-3)" }}>
            Membrane bitumineuse, 2 500 m². Urgence signalée. Budget 95 000€...
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 20px",
            background: "rgba(8,9,26,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span className="text-xs" style={{ color: "var(--text-3)" }}>
            44 AOs filtrés · 3 retenus
          </span>
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--accent)", cursor: "pointer" }}
          >
            Voir dans l&apos;app →
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-center pt-20 pb-16 overflow-hidden hero-grid hero-mesh"
    >
      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — Text */}
          <div>
            {/* Badge */}
            <div className="anim-fadeUp d-1 mb-7">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                  background: "rgba(79,110,247,0.1)",
                  border: "1px solid rgba(79,110,247,0.25)",
                  color: "#93B4FF",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: "#22C55E", boxShadow: "0 0 6px rgba(34,197,94,0.6)", animation: "pulseGlow 2s infinite" }}
                />
                Alimenté par l&apos;IA · Source BOAMP officielle
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-heading anim-fadeUp d-2 leading-none mb-6"
              style={{ fontSize: "clamp(48px, 7vw, 80px)", color: "#F0F4FF", letterSpacing: "0.02em" }}
            >
              NE RATEZ PLUS<br />
              <span className="text-gradient-blue">AUCUN APPEL</span><br />
              D&apos;OFFRES
            </h1>

            <p
              className="anim-fadeUp d-3 text-base md:text-lg leading-relaxed mb-8"
              style={{ color: "var(--text-2)", maxWidth: "500px" }}
            >
              OFFRIO détecte, analyse et résume automatiquement les appels d&apos;offres
              publics adaptés à votre métier.{" "}
              <span style={{ color: "var(--text)" }}>Chaque matin dans votre boîte mail.</span>
            </p>

            <div className="anim-fadeUp d-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-12">
              <Link href="/register" className="btn-primary" style={{ padding: "13px 28px", fontSize: "15px" }}>
                Commencer — 14 jours gratuits
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <a href="#comment" className="btn-secondary" style={{ padding: "13px 28px", fontSize: "15px" }}>
                Voir comment ça marche
              </a>
            </div>

            {/* Stats */}
            <div
              className="anim-fadeUp d-5 grid grid-cols-3 gap-4"
              style={{ borderTop: "1px solid var(--border-2)", paddingTop: "32px" }}
            >
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <Counter target={stat.target} suffix={stat.suffix} />
                  <span className="text-xs" style={{ color: "var(--text-3)" }}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Email mockup */}
          <div className="anim-fadeUp d-3 hidden md:flex items-center justify-center">
            <EmailMockup />
          </div>

        </div>
      </div>

      {/* Radial glow center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 50% 40% at 75% 50%, rgba(79,110,247,0.07) 0%, transparent 70%)",
        }}
      />
    </section>
  );
}
