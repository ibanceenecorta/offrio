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
  montant_gagne?: number;
  contexte_candidature?: string;
  memo_technique?: string;
  ao: AO;
};

const STATUTS = [
  { key: "tous", label: "Tous", color: "" },
  { key: "nouveau", label: "Nouveau", color: "badge-blue" },
  { key: "interessant", label: "Intéressant", color: "badge-green" },
  { key: "dossier_en_cours", label: "En cours", color: "badge-yellow" },
  { key: "envoye", label: "Envoyé", color: "badge-purple" },
  { key: "gagne", label: "Gagné ✓", color: "badge-green" },
  { key: "perdu", label: "Perdu", color: "badge-red" },
  { key: "ignore", label: "Ignoré", color: "badge-gray" },
];

const STATUT_CONFIG: Record<string, { label: string; badge: string; bg: string; border: string; text: string }> = {
  nouveau:          { label: "Nouveau",       badge: "badge-blue",   bg: "rgba(99,102,241,0.1)",  border: "rgba(99,102,241,0.3)",  text: "#A5B4FC" },
  interessant:      { label: "Intéressant",   badge: "badge-green",  bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.3)",   text: "#4ADE80" },
  dossier_en_cours: { label: "En cours",      badge: "badge-yellow", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.3)",  text: "#FCD34D" },
  envoye:           { label: "Envoyé",        badge: "badge-purple", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.3)", text: "#C4B5FD" },
  gagne:            { label: "Gagné ✓",       badge: "badge-green",  bg: "rgba(34,197,94,0.15)",  border: "rgba(34,197,94,0.4)",   text: "#4ADE80" },
  perdu:            { label: "Perdu",         badge: "badge-red",    bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.3)",   text: "#F87171" },
  ignore:           { label: "Ignoré",        badge: "badge-gray",   bg: "rgba(82,82,91,0.2)",    border: "rgba(82,82,91,0.4)",    text: "#71717A" },
};

function getDeadlineBadge(dateStr: string) {
  if (!dateStr) return null;
  const now = new Date();
  const limit = new Date(dateStr);
  const diff = Math.ceil((limit.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: "Expiré", bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.4)", text: "#F87171" };
  if (diff <= 1) return { label: "J-1 ⚠️", bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.4)", text: "#F87171" };
  if (diff <= 3) return { label: `J-${diff} ⚠️`, bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.4)", text: "#FCD34D" };
  if (diff <= 7) return { label: `J-${diff}`, bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)", text: "#FCD34D" };
  return null;
}

export default function AOsPage() {
  const [rows, setRows] = useState<UserAO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("tous");
  const [selected, setSelected] = useState<UserAO | null>(null);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"resume" | "draft" | "memo">("resume");

  // Memo form state
  const [contexte, setContexte] = useState("");
  const [generatingMemo, setGeneratingMemo] = useState(false);
  const [memo, setMemo] = useState("");

  // Montant gagné
  const [montantInput, setMontantInput] = useState("");
  const [savingMontant, setSavingMontant] = useState(false);

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
    toast.success(`Statut : ${STATUT_CONFIG[statut]?.label || statut}`);
  };

  const saveMontant = async () => {
    if (!selected || !montantInput) return;
    setSavingMontant(true);
    const supabase = createClient();
    const val = parseInt(montantInput.replace(/\D/g, ""));
    await supabase.from("user_aos").update({ montant_gagne: val }).eq("id", selected.id);
    setRows((prev) => prev.map((r) => r.id === selected.id ? { ...r, montant_gagne: val } : r));
    setSelected((s) => s ? { ...s, montant_gagne: val } : s);
    setSavingMontant(false);
    toast.success("Montant enregistré !");
  };

  const generateMemo = async () => {
    if (!selected || !contexte.trim()) {
      toast.error("Décris d'abord ton contexte ci-dessus.");
      return;
    }
    setGeneratingMemo(true);
    setTab("memo");

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const { data: userProfile } = await supabase
      .from("users")
      .select("entreprise_nom")
      .eq("id", session?.user?.id)
      .single();

    const res = await fetch("/api/candidature/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        user_ao_id: selected.id,
        contexte,
        ao_titre: selected.ao?.titre,
        ao_resume: selected.ao?.resume_ia,
        ao_secteur: selected.ao?.secteur,
        entreprise_nom: userProfile?.entreprise_nom,
      }),
    });

    if (res.ok) {
      const { memo: generatedMemo } = await res.json();
      setMemo(generatedMemo);
      setRows((prev) => prev.map((r) => r.id === selected.id
        ? { ...r, memo_technique: generatedMemo, contexte_candidature: contexte }
        : r
      ));
      setSelected((s) => s ? { ...s, memo_technique: generatedMemo } : s);
      toast.success("Mémoire technique généré !");
    } else {
      const err = await res.json();
      toast.error(err.error || "Erreur lors de la génération");
    }
    setGeneratingMemo(false);
  };

  // When opening modal, restore saved memo/contexte
  const openModal = (row: UserAO) => {
    setSelected(row);
    setTab("resume");
    setContexte(row.contexte_candidature || "");
    setMemo(row.memo_technique || "");
    setMontantInput(row.montant_gagne ? String(row.montant_gagne) : "");
  };

  const filtered = filter === "tous" ? rows : rows.filter((r) => r.statut === filter);

  const scoreClass = (score: number) =>
    score >= 80 ? "score-high" : score >= 60 ? "score-medium" : "score-low";

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copié !");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl mb-1" style={{ color: "var(--text)", letterSpacing: "0.04em" }}>
          MES APPELS D&apos;OFFRES
        </h1>
        <p className="text-sm" style={{ color: "var(--text-2)" }}>
          {rows.length} AO{rows.length !== 1 ? "s" : ""} au total
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUTS.map((s) => {
          const count = s.key === "tous" ? rows.length : rows.filter((r) => r.statut === s.key).length;
          return (
            <button
              key={s.key}
              onClick={() => setFilter(s.key)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: filter === s.key ? "rgba(99,102,241,0.15)" : "rgba(30,41,59,0.5)",
                border: `1px solid ${filter === s.key ? "rgba(99,102,241,0.4)" : "var(--border-2)"}`,
                color: filter === s.key ? "#A5B4FC" : "var(--text-2)",
                cursor: "pointer",
              }}
            >
              {s.label} ({count})
            </button>
          );
        })}
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
            <p className="font-semibold mb-1" style={{ color: "var(--text)" }}>Aucun AO dans cette catégorie</p>
            <p className="text-sm" style={{ color: "var(--text-2)" }}>Modifiez le filtre pour voir d&apos;autres résultats.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th className="hidden sm:table-cell">Secteur</th>
                  <th>Score IA</th>
                  <th className="hidden md:table-cell">Date limite</th>
                  <th className="hidden sm:table-cell">Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => {
                  const ao = row.ao;
                  const deadlineBadge = ao?.date_limite ? getDeadlineBadge(ao.date_limite) : null;
                  const cfg = STATUT_CONFIG[row.statut];
                  return (
                    <tr key={row.id} style={{ cursor: "pointer" }} onClick={() => openModal(row)}>
                      <td>
                        <span className="font-medium text-sm" style={{ color: "var(--text)" }}>
                          {ao?.titre?.length > 40 ? ao.titre.slice(0, 40) + "…" : ao?.titre}
                        </span>
                        <div className="sm:hidden mt-1 flex gap-1 flex-wrap">
                          {cfg && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.text }}>
                              {cfg.label}
                            </span>
                          )}
                          {deadlineBadge && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{ background: deadlineBadge.bg, border: `1px solid ${deadlineBadge.border}`, color: deadlineBadge.text }}>
                              {deadlineBadge.label}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="hidden sm:table-cell"><span className="badge badge-gray">{ao?.secteur}</span></td>
                      <td>
                        {ao?.score_ia != null ? (
                          <span className={scoreClass(ao.score_ia)}>{ao.score_ia}/100</span>
                        ) : "—"}
                      </td>
                      <td className="hidden md:table-cell">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm" style={{ color: "var(--text-2)" }}>
                            {ao?.date_limite ? new Date(ao.date_limite).toLocaleDateString("fr-FR") : "—"}
                          </span>
                          {deadlineBadge && (
                            <span className="text-xs px-1.5 py-0.5 rounded font-medium w-fit"
                              style={{ background: deadlineBadge.bg, border: `1px solid ${deadlineBadge.border}`, color: deadlineBadge.text }}>
                              {deadlineBadge.label}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="hidden sm:table-cell" onClick={(e) => e.stopPropagation()}>
                        {cfg && (
                          <span className="text-xs px-2 py-1 rounded-full font-medium"
                            style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.text }}>
                            {cfg.label}
                          </span>
                        )}
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateStatut(row.id, "interessant")}
                            className="px-2 py-1 rounded text-xs font-medium transition-all"
                            style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#059669", cursor: "pointer" }}
                            title="Intéressant"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => updateStatut(row.id, "ignore")}
                            className="px-2 py-1 rounded text-xs font-medium transition-all"
                            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#DC2626", cursor: "pointer" }}
                            title="Ignorer"
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
            className="glass grad-border w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <h2 className="font-bold text-lg leading-tight" style={{ color: "var(--text)" }}>
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

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="badge badge-gray">{selected.ao?.secteur}</span>
              {selected.ao?.score_ia != null && (
                <span className={scoreClass(selected.ao.score_ia)}>{selected.ao.score_ia}/100</span>
              )}
              {selected.ao?.date_limite && (() => {
                const db = getDeadlineBadge(selected.ao.date_limite);
                return (
                  <>
                    <span className="badge badge-yellow">
                      Limite : {new Date(selected.ao.date_limite).toLocaleDateString("fr-FR")}
                    </span>
                    {db && (
                      <span className="text-xs px-2 py-1 rounded-full font-semibold"
                        style={{ background: db.bg, border: `1px solid ${db.border}`, color: db.text }}>
                        {db.label}
                      </span>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Suivi statut */}
            <div className="mb-5 p-4 rounded-xl" style={{ background: "rgba(15,23,42,0.5)", border: "1px solid var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--text-3)" }}>
                Suivi de candidature
              </p>
              <div className="flex flex-wrap gap-2">
                {(["interessant", "dossier_en_cours", "envoye", "gagne", "perdu", "ignore"] as const).map((s) => {
                  const cfg = STATUT_CONFIG[s];
                  const isActive = selected.statut === s;
                  return (
                    <button
                      key={s}
                      onClick={() => updateStatut(selected.id, s)}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                      style={{
                        background: isActive ? cfg.bg : "rgba(30,41,59,0.5)",
                        border: `1px solid ${isActive ? cfg.border : "var(--border-2)"}`,
                        color: isActive ? cfg.text : "var(--text-2)",
                        cursor: "pointer",
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      {cfg.label}
                    </button>
                  );
                })}
              </div>

              {/* Montant gagné (visible si statut = gagne) */}
              {selected.statut === "gagne" && (
                <div className="mt-3 flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Montant gagné (€)"
                    value={montantInput}
                    onChange={(e) => setMontantInput(e.target.value)}
                    className="field flex-1 text-sm"
                    style={{ padding: "8px 12px" }}
                  />
                  <button
                    onClick={saveMontant}
                    disabled={savingMontant}
                    className="btn-primary text-xs"
                    style={{ padding: "8px 16px", whiteSpace: "nowrap" }}
                  >
                    {savingMontant ? "…" : "Enregistrer"}
                  </button>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 p-1 rounded-lg" style={{ background: "rgba(15,23,42,0.5)", border: "1px solid var(--border)" }}>
              {([
                { key: "resume", label: "Résumé IA" },
                { key: "draft", label: "Draft email" },
                { key: "memo", label: "Mémoire technique" },
              ] as const).map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className="flex-1 text-xs font-medium py-2 rounded-md transition-all"
                  style={{
                    background: tab === t.key ? "rgba(99,102,241,0.2)" : "transparent",
                    color: tab === t.key ? "#A5B4FC" : "var(--text-2)",
                    border: tab === t.key ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
                    cursor: "pointer",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {tab === "resume" && selected.ao?.resume_ia && (
              <div className="p-4 rounded-xl" style={{ background: "rgba(15,23,42,0.6)", border: "1px solid var(--border)" }}>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                  {selected.ao.resume_ia}
                </p>
              </div>
            )}

            {tab === "draft" && (
              <div>
                {selected.ao?.draft_email ? (
                  <>
                    <div className="flex justify-end mb-2">
                      <button onClick={() => copyText(selected.ao.draft_email)} className="btn-secondary" style={{ padding: "5px 12px", fontSize: "12px" }}>
                        {copied ? "✓ Copié !" : "Copier"}
                      </button>
                    </div>
                    <div className="p-4 rounded-xl font-mono text-xs leading-relaxed" style={{ background: "#0D1117", border: "1px solid rgba(48,54,61,0.8)", color: "#8B949E", whiteSpace: "pre-wrap" }}>
                      {selected.ao.draft_email}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-center py-8" style={{ color: "var(--text-3)" }}>Aucun draft disponible.</p>
                )}
              </div>
            )}

            {tab === "memo" && (
              <div>
                {/* Context form */}
                <div className="mb-4">
                  <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--text-3)" }}>
                    Ton contexte (références similaires, équipe, expérience…)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Ex: On a réalisé 3 chantiers similaires l'an dernier (école, mairie), équipe de 5 personnes, certifié Qualibat RGE, disponible sous 2 semaines…"
                    value={contexte}
                    onChange={(e) => setContexte(e.target.value)}
                    className="field w-full text-sm leading-relaxed"
                    style={{ padding: "10px 12px", resize: "vertical" }}
                  />
                </div>
                <button
                  onClick={generateMemo}
                  disabled={generatingMemo || !contexte.trim()}
                  className="btn-primary w-full mb-4 flex items-center justify-center gap-2"
                  style={{ padding: "12px", opacity: (!contexte.trim()) ? 0.5 : 1 }}
                >
                  {generatingMemo ? (
                    <>
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 11-6.219-8.56" />
                      </svg>
                      Génération en cours…
                    </>
                  ) : (
                    <>✦ Générer le mémoire technique</>
                  )}
                </button>

                {memo && (
                  <>
                    <div className="flex justify-end mb-2">
                      <button onClick={() => copyText(memo)} className="btn-secondary" style={{ padding: "5px 12px", fontSize: "12px" }}>
                        {copied ? "✓ Copié !" : "Copier"}
                      </button>
                    </div>
                    <div className="p-4 rounded-xl text-sm leading-relaxed" style={{ background: "rgba(15,23,42,0.6)", border: "1px solid var(--border)", color: "var(--text-2)", whiteSpace: "pre-wrap" }}>
                      {memo}
                    </div>
                  </>
                )}

                {!memo && !generatingMemo && (
                  <p className="text-xs text-center py-4" style={{ color: "var(--text-3)" }}>
                    Décris ton contexte et clique sur &quot;Générer&quot; pour obtenir un mémoire technique personnalisé.
                  </p>
                )}
              </div>
            )}

            {/* Source link */}
            {selected.ao?.source_url && (
              <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                <a
                  href={selected.ao.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-sm"
                  style={{ display: "inline-flex" }}
                >
                  Voir l&apos;AO source ↗
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
