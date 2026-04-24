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
      traites: dayRows.filter((r) => r.statut === "traite" || r.statut === "interessant").length,
    });
  }
  return days;
}

export default function PerformancePage() {
  const [days, setDays] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({ recus: 0, traites: 0, taux: 0, score: 0 });
  const [tooltip, setTooltip] = useState<{ idx: number; x: number; y: number } | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("user_aos")
      .select("created_at, statut, ao:appels_offres(score_ia)")
      .eq("user_id", user.id);

    const rows = (data || []) as { created_at: string; statut: string; ao?: { score_ia?: number } | null }[];
    const chart = buildLast30Days(rows);
    setDays(chart);

    const totalRecus = rows.length;
    const totalTraites = rows.filter((r) => r.statut === "traite" || r.statut === "interessant").length;
    const scores = rows.map((r) => r.ao?.score_ia).filter((v): v is number => typeof v === "number");
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    setKpis({
      recus: totalRecus,
      traites: totalTraites,
      taux: totalRecus > 0 ? Math.round((totalTraites / totalRecus) * 100) : 0,
      score: avgScore,
    });
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const maxVal = Math.max(...days.map((d) => d.recus), 1);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl mb-1" style={{ color: "#F1F5F9", letterSpacing: "0.04em" }}>
          PERFORMANCE
        </h1>
        <p className="text-sm" style={{ color: "var(--text-2)" }}>
          Indicateurs de votre activité sur les 30 derniers jours.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "AOs reçus", value: kpis.recus, color: "#60A5FA" },
          { label: "AOs traités", value: kpis.traites, color: "#22C55E" },
          { label: "Taux de traitement", value: `${kpis.taux}%`, color: "#F59E0B" },
          { label: "Score IA moyen", value: kpis.score ? `${kpis.score}/100` : "—", color: "#A78BFA" },
        ].map((k) => (
          <div key={k.label} className="glass grad-border p-5">
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--text-3)" }}>
              {k.label}
            </p>
            <p className="font-heading text-3xl" style={{ color: k.color, letterSpacing: "0.02em" }}>
              {k.value}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="glass grad-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-sm" style={{ color: "#F1F5F9" }}>AOs reçus vs traités — 30 derniers jours</h2>
          <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-2)" }}>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ background: "#2563EB" }} />
              Reçus
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ background: "#22C55E" }} />
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
                      background: "linear-gradient(180deg, #60A5FA, #2563EB)",
                      minHeight: d.recus > 0 ? "3px" : "0",
                    }}
                  />
                  <div
                    className="flex-1 rounded-t-sm transition-all duration-300"
                    style={{
                      height: `${(d.traites / maxVal) * 100}%`,
                      background: "linear-gradient(180deg, #4ADE80, #16A34A)",
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
                  color: "#F1F5F9",
                  top: 0,
                  left: `${(tooltip.idx / days.length) * 100}%`,
                  transform: "translateX(-50%)",
                  whiteSpace: "nowrap",
                }}
              >
                <div style={{ color: "var(--text-2)" }}>{days[tooltip.idx].label}</div>
                <div style={{ color: "#60A5FA" }}>Reçus : {days[tooltip.idx].recus}</div>
                <div style={{ color: "#4ADE80" }}>Traités : {days[tooltip.idx].traites}</div>
              </div>
            )}

            {/* X-axis labels — show every 5 days */}
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
