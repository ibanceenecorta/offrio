"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

type AO = {
  id: string;
  titre: string;
  description_courte: string;
  secteur: string;
  score_ia: number;
  date_limite: string;
  source_url: string;
  resume_ia: string;
  draft_email: string;
  created_at: string;
};

type UserAO = {
  id: string;
  ao_id: string;
  statut: string;
  ao: AO;
};

const STATUTS = ["tous", "nouveau", "lu", "interessant", "ignore"];

export default function AOsPage() {
  const [rows, setRows] = useState<UserAO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("tous");
  const [selected, setSelected] = useState<UserAO | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchAOs = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("user_aos")
      .select("*, ao:appels_offres(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setRows((data as UserAO[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAOs(); }, [fetchAOs]);

  const updateStatut = async (userAoId: string, statut: string) => {
    const supabase = createClient();
    await supabase.from("user_aos").update({ statut }).eq("id", userAoId);
    setRows((prev) => prev.map((r) => r.id === userAoId ? { ...r, statut } : r));
    if (selected?.id === userAoId) setSelected((s) => s ? { ...s, statut } : s);
    toast.success(`Statut mis à jour : ${statut}`);
  };

  const filtered = filter === "tous" ? rows : rows.filter((r) => r.statut === filter);

  const scoreClass = (score: number) =>
    score >= 80 ? "score-high" : score >= 60 ? "score-medium" : "score-low";

  const copyDraft = () => {
    if (!selected?.ao?.draft_email) return;
    navigator.clipboard.writeText(selected.ao.draft_email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Email copié !");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl mb-1" style={{ color: "#F1F5F9", letterSpacing: "0.04em" }}>
          MES APPELS D&apos;OFFRES
        </h1>
        <p className="text-sm" style={{ color: "var(--text-2)" }}>
          {rows.length} AO{rows.length !== 1 ? "s" : ""} au total
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUTS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize"
            style={{
              background: filter === s ? "rgba(37,99,235,0.15)" : "rgba(30,41,59,0.5)",
              border: `1px solid ${filter === s ? "rgba(37,99,235,0.4)" : "var(--border-2)"}`,
              color: filter === s ? "#93C5FD" : "var(--text-2)",
              cursor: "pointer",
            }}
          >
            {s === "tous" ? `Tous (${rows.length})` : `${s} (${rows.filter((r) => r.statut === s).length})`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass grad-border overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-12" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-semibold mb-1" style={{ color: "#F1F5F9" }}>Aucun AO dans cette catégorie</p>
            <p className="text-sm" style={{ color: "var(--text-2)" }}>Modifiez le filtre pour voir d&apos;autres résultats.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Secteur</th>
                  <th>Score IA</th>
                  <th>Date limite</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => {
                  const ao = row.ao;
                  return (
                    <tr key={row.id} style={{ cursor: "pointer" }} onClick={() => setSelected(row)}>
                      <td>
                        <span className="font-medium text-sm" style={{ color: "#F1F5F9" }}>
                          {ao?.titre?.length > 55 ? ao.titre.slice(0, 55) + "…" : ao?.titre}
                        </span>
                      </td>
                      <td><span className="badge badge-gray">{ao?.secteur}</span></td>
                      <td>
                        {ao?.score_ia != null ? (
                          <span className={scoreClass(ao.score_ia)}>{ao.score_ia}/100</span>
                        ) : "—"}
                      </td>
                      <td>
                        <span className="text-sm" style={{ color: "var(--text-2)" }}>
                          {ao?.date_limite ? new Date(ao.date_limite).toLocaleDateString("fr-FR") : "—"}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <span className={`badge ${
                          row.statut === "nouveau" ? "badge-blue" :
                          row.statut === "interessant" ? "badge-green" :
                          row.statut === "ignore" ? "badge-red" : "badge-gray"
                        }`}>
                          {row.statut}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateStatut(row.id, "interessant")}
                            className="px-2 py-1 rounded text-xs font-medium transition-all"
                            style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#4ADE80", cursor: "pointer" }}
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => updateStatut(row.id, "ignore")}
                            className="px-2 py-1 rounded text-xs font-medium transition-all"
                            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#F87171", cursor: "pointer" }}
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => setSelected(null)}
        >
          <div
            className="glass grad-border w-full max-w-2xl max-h-[85vh] overflow-y-auto"
            style={{ padding: "32px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <h2 className="font-bold text-lg leading-tight" style={{ color: "#F1F5F9" }}>
                {selected.ao?.titre}
              </h2>
              <button
                onClick={() => setSelected(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", flexShrink: 0 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              <span className="badge badge-gray">{selected.ao?.secteur}</span>
              {selected.ao?.score_ia != null && (
                <span className={scoreClass(selected.ao.score_ia)}>{selected.ao.score_ia}/100</span>
              )}
              {selected.ao?.date_limite && (
                <span className="badge badge-yellow">
                  Limite : {new Date(selected.ao.date_limite).toLocaleDateString("fr-FR")}
                </span>
              )}
            </div>

            {selected.ao?.resume_ia && (
              <div className="mb-5 p-4 rounded-xl" style={{ background: "rgba(15,23,42,0.6)", border: "1px solid var(--border)" }}>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--accent)" }}>
                  Résumé IA
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                  {selected.ao.resume_ia}
                </p>
              </div>
            )}

            {selected.ao?.draft_email && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
                    Draft email
                  </p>
                  <button onClick={copyDraft} className="btn-secondary" style={{ padding: "5px 12px", fontSize: "12px" }}>
                    {copied ? "✓ Copié !" : "Copier"}
                  </button>
                </div>
                <div className="p-4 rounded-xl font-mono text-xs leading-relaxed" style={{ background: "#0D1117", border: "1px solid rgba(48,54,61,0.8)", color: "#8B949E", whiteSpace: "pre-wrap" }}>
                  {selected.ao.draft_email}
                </div>
              </div>
            )}

            {selected.ao?.source_url && (
              <a
                href={selected.ao.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm"
                style={{ display: "inline-flex", marginBottom: "20px" }}
              >
                Voir l&apos;AO source ↗
              </a>
            )}

            <div className="flex gap-3 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
              <button
                onClick={() => updateStatut(selected.id, "interessant")}
                className="btn-primary flex-1"
                style={{ padding: "10px" }}
              >
                ✓ Intéressant
              </button>
              <button
                onClick={() => { updateStatut(selected.id, "ignore"); setSelected(null); }}
                className="btn-secondary flex-1"
                style={{ padding: "10px", borderColor: "rgba(239,68,68,0.3)", color: "#F87171" }}
              >
                ✕ Ignorer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
