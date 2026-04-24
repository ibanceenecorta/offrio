"use client";

import { useState } from "react";

const CHECKLIST = [
  {
    cat: "Candidature",
    docs: [
      "Lettre de candidature (DC1)",
      "Déclaration du candidat (DC2)",
      "Habilitation du mandataire (si groupement)",
    ],
  },
  {
    cat: "Situation juridique",
    docs: [
      "Extrait Kbis (moins de 3 mois)",
      "Statuts de la société",
      "Attestation de régularité fiscale",
    ],
  },
  {
    cat: "Capacité financière",
    docs: [
      "Chiffre d'affaires des 3 dernières années",
      "Bilans ou extraits de bilans",
    ],
  },
  {
    cat: "Références techniques",
    docs: [
      "Liste des travaux similaires réalisés",
      "Références de chantiers (3 minimum)",
      "Certificats de bonne exécution",
    ],
  },
  {
    cat: "Offre technique",
    docs: [
      "Mémoire technique",
      "CCTP complété et signé",
      "Planning d'exécution",
    ],
  },
];

const ALL_DOCS = CHECKLIST.flatMap((c) => c.docs);

export default function OutilsPage() {
  // Calculateur
  const [montant, setMontant] = useState("");
  const [taux, setTaux] = useState("35");
  const [result, setResult] = useState<{ marge: number; taux: number } | null>(null);

  // Checklist
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const calcul = () => {
    const m = parseFloat(montant.replace(/\s/g, "").replace(",", "."));
    const t = parseFloat(taux) / 100;
    if (isNaN(m) || isNaN(t) || m <= 0) return;
    const charges = m * t;
    const marge = m - charges;
    const tauxM = (marge / m) * 100;
    setResult({ marge, taux: tauxM });
  };

  const toggleDoc = (doc: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(doc)) next.delete(doc);
      else next.add(doc);
      return next;
    });
  };

  const progress = ALL_DOCS.length > 0 ? (checked.size / ALL_DOCS.length) * 100 : 0;

  const margeColor = result
    ? result.taux >= 25 ? "var(--success)" : result.taux >= 10 ? "var(--warning)" : "var(--danger)"
    : "";

  const margeLabel = result
    ? result.taux >= 25 ? "Bonne rentabilité" : result.taux >= 10 ? "Rentabilité moyenne" : "Risqué"
    : "";

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl mb-1" style={{ color: "#F1F5F9", letterSpacing: "0.04em" }}>
          OUTILS
        </h1>
        <p className="text-sm" style={{ color: "var(--text-2)" }}>
          Outils pour optimiser vos réponses aux appels d&apos;offres.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Calculateur */}
        <div className="glass grad-border p-6">
          <h2 className="font-heading text-xl mb-1" style={{ color: "#F1F5F9", letterSpacing: "0.04em" }}>
            CALCULATEUR DE RENTABILITÉ
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-2)" }}>
            Estimez la marge nette de votre AO avant de répondre.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
                Montant du marché (€)
              </label>
              <input
                type="text"
                className="field"
                placeholder="ex: 85 000"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && calcul()}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
                Taux de charges estimé — {taux}%
              </label>
              <input
                type="range"
                min="10"
                max="80"
                value={taux}
                onChange={(e) => setTaux(e.target.value)}
                className="w-full"
                style={{ accentColor: "var(--accent)" }}
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-3)" }}>
                <span>10%</span><span>80%</span>
              </div>
            </div>

            <button
              onClick={calcul}
              className="btn-primary w-full"
              style={{ padding: "11px" }}
            >
              Calculer la marge
            </button>

            {result && (
              <div
                className="p-4 rounded-xl"
                style={{ background: "rgba(15,23,42,0.6)", border: `1px solid ${margeColor}33` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold" style={{ color: "var(--text-2)" }}>Marge nette estimée</span>
                  <span
                    className="px-3 py-1 rounded-lg text-sm font-bold"
                    style={{ background: `${margeColor}18`, color: margeColor, border: `1px solid ${margeColor}33` }}
                  >
                    {margeLabel}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs mb-1" style={{ color: "var(--text-3)" }}>Marge nette</p>
                    <p className="font-heading text-2xl" style={{ color: margeColor }}>
                      {result.marge.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: "var(--text-3)" }}>Taux de marge</p>
                    <p className="font-heading text-2xl" style={{ color: margeColor }}>
                      {result.taux.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Checklist */}
        <div className="glass grad-border p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-heading text-xl" style={{ color: "#F1F5F9", letterSpacing: "0.04em" }}>
              CHECKLIST RÉPONSE AO
            </h2>
            <button
              onClick={() => setChecked(new Set())}
              className="text-xs"
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)" }}
            >
              Réinitialiser
            </button>
          </div>
          <p className="text-sm mb-4" style={{ color: "var(--text-2)" }}>
            Documents à rassembler pour répondre à un AO.
          </p>

          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold" style={{ color: "var(--text-3)" }}>Progression</span>
              <span className="text-xs font-bold" style={{ color: "#93C5FD" }}>
                {checked.size}/{ALL_DOCS.length}
              </span>
            </div>
            <div className="prog">
              <div className="prog-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {CHECKLIST.map((cat) => (
              <div key={cat.cat}>
                <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "var(--text-3)" }}>
                  {cat.cat}
                </p>
                <div className="space-y-1.5">
                  {cat.docs.map((doc) => (
                    <label
                      key={doc}
                      className="flex items-center gap-3 text-sm cursor-pointer group"
                      style={{ color: checked.has(doc) ? "var(--text-3)" : "var(--text-2)" }}
                    >
                      <div
                        className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center transition-all"
                        style={{
                          background: checked.has(doc) ? "var(--success)" : "rgba(30,41,59,0.8)",
                          border: `1px solid ${checked.has(doc) ? "var(--success)" : "var(--border-2)"}`,
                        }}
                        onClick={() => toggleDoc(doc)}
                      >
                        {checked.has(doc) && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span
                        className="transition-all"
                        style={{ textDecoration: checked.has(doc) ? "line-through" : "none" }}
                        onClick={() => toggleDoc(doc)}
                      >
                        {doc}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
