"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type DayData = { label: string; recus: number; traites: number };

function buildLast30Days(rows: { created_at: string; statut: string; ao?: { score_ia?: number } | null }[]): DayData[] {
  const days: DayData[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
    const dayRows = rows.filter((r) => r.created_at?.slice(0, 10) === key);
    days.push({
      label,
      recus: dayRows.length,
      traites: dayRows.filter((r) => ["interessant", "dossier_en_cours", "envoye", "gagne"].includes(r.statut)).length,
    });
  }
  return days;
}

export default function PerformancePage() {
  const [days, setDays] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    recus: 0,
    traites: 0,
    taux: 0,
    score: 0,
    envoyes: 0,
    gagnes: 0,
    perdu: 0,
    tauxTransformation: 0,
    roiTotal: 0,
  });
  const [tooltip, setTooltip] = useState<{ idx: number; x: number; y: number } | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("user_aos")
      .select("created_at, statut, montant_gagne, ao:appels_offres(score_ia)")
      .eq("user_id", user.id);

    const rows = (data || []) as { created_at: string; statut: string; montant_gagne?: number; ao?: { score_ia?: number } | null }[];
    const chart = buildLast30Days(rows);
    setDays(chart);

    const totalRecus = rows.length;
    const totalTraites = rows.filter((r) => ["interessant", "dossier_en_cours", "envoye", "gagne"].includes(r.statut)).length;
    const envoyes = rows.filter((r) => ["envoye", "gagne", "perdu"].includes(r.statut)).length;
    const gagnes = rows.filter((r) => r.statut === "gagne").length;
    const perdus = rows.filter((r) => r.statut === "perdu").length;
    const scores = rows.map((r) => r.ao?.score_ia).filter((v): v is number => typeof v === "number");
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const roiTotal = rows.filter((r) => r.statut === "gagne" && r.montant_gagne).reduce((sum, r) => sum + (r.montant_gagne || 0), 0);
    const tauxTransformation = envoyes > 0 ? Math.round((gagnes / envoyes) * 100) : 0;

    setKpis({
      recus: totalRecus,
      traites: totalTraites,
      taux: totalRecus > 0 ? Math.round((totalTraites / totalRecus) * 100) : 0,
      score: avgScore,
      envoyes,
      gagnes,
      perdu: perdus,
      tauxTransformation,
      roiTotal,
    });
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const maxVal = Math.max(...days.map((d) => d.recus), 1);

  const kpiCards = [
    { label: "AOs reçus", value: kpis.recus, color: "#60A5FA", sub: "total" },
    { label: "AOs traités", value: kpis.traites, color: "#4F46E5", sub: `${kpis.taux}% du total` },
    { label: "Score IA moyen", value: kpis.score ? `${kpis.score}/100` : "—", color: "var(--accent)", sub: "pertinence" },
    { label: "Dossiers envoyés", value: kpis.envoyes, color: "#4F46E5", sub: "candidatures" },
    { label: "Marchés gagnés", value: kpis.gagnes, color: "#4F46E5", sub: `${kpis.tauxTransformation}% de taux` },
    { label: "CA potentiel", value: kpis.roiTotal > 0 ? `${kpis.roiTotal.toLocaleString("fr-FR")} €` : "—", color: "#4F46E5", sub: "montants gagnés" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl mb-1" style={{ color: "var(--text)", letterSpacing: "0.04em" }}>
          PERFORMANCE
        </h1>
        <p className="text-sm" style={{ color: "var(--text-2)" }}>
          Indicateurs de votre activité et suivi de candidatures.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {kpiCards.map((k) => (
          <div key={k.label} className="glass grad-border p-5">
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--text-3)" }}>
              {k.label}
            </p>
            <p className="font-heading text-3xl mb-1" style={{ color: k.color, letterSpacing: "0.02em" }}>
              {loading ? "…" : k.value}
            </p>
            <p className="text-xs" style={{ color: "var(--text-3)" }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* ROI Banner — visible si des marchés gagnés */}
      {!loading && kpis.gagnes > 0 && (
        <div className="mb-8 p-5 rounded-xl flex items-center gap-4"
          style={{ background: "linear-gradient(135deg, rgba(79,70,229,0.08) 0%, rgba(16,185,129,0.05) 100%)", border: "1px solid rgba(34,197,94,0.25)" }}>
          <div className="text-3xl">🏆</div>
          <div>
            <p className="font-semibold" style={{ color: "#4F46E5" }}>
              Tu as répondu à {kpis.envoyes} AO{kpis.envoyes > 1 ? "s" : ""}, gagné {kpis.gagnes} marché{kpis.gagnes > 1 ? "s" : ""}
              {kpis.roiTotal > 0 ? `, pour ${kpis.roiTotal.toLocaleString("fr-FR")} € de CA` : ""}.
            </p>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-2)" }}>
              Taux de transformation : {kpis.tauxTransformation}% — {kpis.perdu > 0 ? `${kpis.perdu} perdu${kpis.perdu > 1 ? "s" : ""}` : "Aucun perdu pour l'instant"}.
            </p>
          </div>
        </div>
      )}

      {/* Funnel candidature */}
      {!loading && kpis.envoyes > 0 && (
        <div className="glass grad-border p-6 mb-8">
          <h2 className="font-semibold text-sm mb-5" style={{ color: "var(--text)" }}>Funnel de candidature</h2>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { label: "Intéressants", value: kpis.traites, color: "#6366F1" },
              { label: "Envoyés", value: kpis.envoyes, color: "#4F46E5" },
              { label: "Gagnés", value: kpis.gagnes, color: "#4F46E5" },
            ].map((step, i) => (
              <div key={step.label} className="flex items-center gap-2">
                <div className="text-center">
                  <div className="font-heading text-2xl" style={{ color: step.color }}>{step.value}</div>
                  <div className="text-xs" style={{ color: "var(--text-3)" }}>{step.label}</div>
                </div>
                {i < 2 && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="glass grad-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-sm" style={{ color: "var(--text)" }}>AOs reçus vs traités — 30 derniers jours</h2>
          <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-2)" }}>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ background: "#6366F1" }} />
              Reçus
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ background: "#4F46E5" }} />
              Traités
            </span>
          </div>
        </div>

        {loading ? (
          <div className="skeleton h-32" />
        ) : (
          <div className="relative">
            <div
              className="flex items-end gap-1 overflow-x-auto pb-6"
              style={{ height: "140px" }}
              onMouseLeave={() => setTooltip(null)}
            >
              {days.map((d, i) => (
                <div
                  key={i}
                  className="flex-1 flex items-end gap-0.5 min-w-[12px] cursor-pointer"
                  style={{ height: "120px" }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltip({ idx: i, x: rect.left, y: rect.top });
                  }}
                >
                  <div
                    className="flex-1 rounded-t-sm transition-all duration-300"
                    style={{
                      height: `${(d.recus / maxVal) * 100}%`,
                      background: "linear-gradient(180deg, #818CF8, #6366F1)",
                      minHeight: d.recus > 0 ? "3px" : "0",
                    }}
                  />
                  <div
                    className="flex-1 rounded-t-sm transition-all duration-300"
                    style={{
                      height: `${(d.traites / maxVal) * 100}%`,
                      background: "linear-gradient(180deg, #4F46E5, #4F46E5)",
                      minHeight: d.traites > 0 ? "3px" : "0",
                    }}
                  />
                </div>
              ))}
            </div>

            {tooltip !== null && days[tooltip.idx] && (
              <div
                className="absolute z-10 text-xs rounded-lg px-3 py-2 pointer-events-none"
                style={{
                  background: "#1E293B",
                  border: "1px solid var(--border-2)",
                  color: "var(--text)",
                  top: 0,
                  left: `${(tooltip.idx / days.length) * 100}%`,
                  transform: "translateX(-50%)",
                  whiteSpace: "nowrap",
                }}
              >
                <div style={{ color: "var(--text-2)" }}>{days[tooltip.idx].label}</div>
                <div style={{ color: "var(--accent)" }}>Reçus : {days[tooltip.idx].recus}</div>
                <div style={{ color: "#4F46E5" }}>Traités : {days[tooltip.idx].traites}</div>
              </div>
            )}

            <div className="flex overflow-x-hidden mt-1">
              {days.map((d, i) => (
                <div key={i} className="flex-1 text-center" style={{ fontSize: "10px", color: "var(--text-3)" }}>
                  {i % 5 === 0 ? d.label : ""}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
