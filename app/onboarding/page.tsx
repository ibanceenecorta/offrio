"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const DEPARTEMENTS = [
  { code: "01", label: "01 - Ain" },
  { code: "02", label: "02 - Aisne" },
  { code: "03", label: "03 - Allier" },
  { code: "04", label: "04 - Alpes-de-Haute-Provence" },
  { code: "05", label: "05 - Hautes-Alpes" },
  { code: "06", label: "06 - Alpes-Maritimes" },
  { code: "07", label: "07 - Ardèche" },
  { code: "08", label: "08 - Ardennes" },
  { code: "09", label: "09 - Ariège" },
  { code: "10", label: "10 - Aube" },
  { code: "11", label: "11 - Aude" },
  { code: "12", label: "12 - Aveyron" },
  { code: "13", label: "13 - Bouches-du-Rhône" },
  { code: "14", label: "14 - Calvados" },
  { code: "15", label: "15 - Cantal" },
  { code: "16", label: "16 - Charente" },
  { code: "17", label: "17 - Charente-Maritime" },
  { code: "18", label: "18 - Cher" },
  { code: "19", label: "19 - Corrèze" },
  { code: "2A", label: "2A - Corse-du-Sud" },
  { code: "2B", label: "2B - Haute-Corse" },
  { code: "21", label: "21 - Côte-d'Or" },
  { code: "22", label: "22 - Côtes-d'Armor" },
  { code: "23", label: "23 - Creuse" },
  { code: "24", label: "24 - Dordogne" },
  { code: "25", label: "25 - Doubs" },
  { code: "26", label: "26 - Drôme" },
  { code: "27", label: "27 - Eure" },
  { code: "28", label: "28 - Eure-et-Loir" },
  { code: "29", label: "29 - Finistère" },
  { code: "30", label: "30 - Gard" },
  { code: "31", label: "31 - Haute-Garonne" },
  { code: "32", label: "32 - Gers" },
  { code: "33", label: "33 - Gironde" },
  { code: "34", label: "34 - Hérault" },
  { code: "35", label: "35 - Ille-et-Vilaine" },
  { code: "36", label: "36 - Indre" },
  { code: "37", label: "37 - Indre-et-Loire" },
  { code: "38", label: "38 - Isère" },
  { code: "39", label: "39 - Jura" },
  { code: "40", label: "40 - Landes" },
  { code: "41", label: "41 - Loir-et-Cher" },
  { code: "42", label: "42 - Loire" },
  { code: "43", label: "43 - Haute-Loire" },
  { code: "44", label: "44 - Loire-Atlantique" },
  { code: "45", label: "45 - Loiret" },
  { code: "46", label: "46 - Lot" },
  { code: "47", label: "47 - Lot-et-Garonne" },
  { code: "48", label: "48 - Lozère" },
  { code: "49", label: "49 - Maine-et-Loire" },
  { code: "50", label: "50 - Manche" },
  { code: "51", label: "51 - Marne" },
  { code: "52", label: "52 - Haute-Marne" },
  { code: "53", label: "53 - Mayenne" },
  { code: "54", label: "54 - Meurthe-et-Moselle" },
  { code: "55", label: "55 - Meuse" },
  { code: "56", label: "56 - Morbihan" },
  { code: "57", label: "57 - Moselle" },
  { code: "58", label: "58 - Nièvre" },
  { code: "59", label: "59 - Nord" },
  { code: "60", label: "60 - Oise" },
  { code: "61", label: "61 - Orne" },
  { code: "62", label: "62 - Pas-de-Calais" },
  { code: "63", label: "63 - Puy-de-Dôme" },
  { code: "64", label: "64 - Pyrénées-Atlantiques" },
  { code: "65", label: "65 - Hautes-Pyrénées" },
  { code: "66", label: "66 - Pyrénées-Orientales" },
  { code: "67", label: "67 - Bas-Rhin" },
  { code: "68", label: "68 - Haut-Rhin" },
  { code: "69", label: "69 - Rhône" },
  { code: "70", label: "70 - Haute-Saône" },
  { code: "71", label: "71 - Saône-et-Loire" },
  { code: "72", label: "72 - Sarthe" },
  { code: "73", label: "73 - Savoie" },
  { code: "74", label: "74 - Haute-Savoie" },
  { code: "75", label: "75 - Paris" },
  { code: "76", label: "76 - Seine-Maritime" },
  { code: "77", label: "77 - Seine-et-Marne" },
  { code: "78", label: "78 - Yvelines" },
  { code: "79", label: "79 - Deux-Sèvres" },
  { code: "80", label: "80 - Somme" },
  { code: "81", label: "81 - Tarn" },
  { code: "82", label: "82 - Tarn-et-Garonne" },
  { code: "83", label: "83 - Var" },
  { code: "84", label: "84 - Vaucluse" },
  { code: "85", label: "85 - Vendée" },
  { code: "86", label: "86 - Vienne" },
  { code: "87", label: "87 - Haute-Vienne" },
  { code: "88", label: "88 - Vosges" },
  { code: "89", label: "89 - Yonne" },
  { code: "90", label: "90 - Territoire de Belfort" },
  { code: "91", label: "91 - Essonne" },
  { code: "92", label: "92 - Hauts-de-Seine" },
  { code: "93", label: "93 - Seine-Saint-Denis" },
  { code: "94", label: "94 - Val-de-Marne" },
  { code: "95", label: "95 - Val-d'Oise" },
  { code: "971", label: "971 - Guadeloupe" },
  { code: "972", label: "972 - Martinique" },
  { code: "973", label: "973 - Guyane" },
  { code: "974", label: "974 - La Réunion" },
  { code: "976", label: "976 - Mayotte" },
];

const SECTEURS = [
  "Chaudronnerie", "Soudure", "Tuyauterie", "Plomberie",
  "Électricité", "Menuiserie", "Maçonnerie", "Peinture",
  "Couverture", "Climatisation / CVC", "Terrassement", "Autre",
];

const PLANS = [
  {
    name: "Starter", price: "79", slug: "starter",
    features: ["1 utilisateur", "10 AOs / jour", "Source BOAMP", "Résumés IA", "Alertes email"],
    highlight: false,
  },
  {
    name: "Pro", price: "119", slug: "pro",
    features: ["5 utilisateurs", "30 AOs / jour", "3 sources", "Scoring IA avancé", "Drafts email IA", "Profil personnalisé"],
    highlight: true,
  },
  {
    name: "Scale", price: "199", slug: "scale",
    features: ["Utilisateurs illimités", "AOs illimités", "Sources illimitées", "Multi-utilisateurs", "Support prioritaire"],
    highlight: false,
  },
];

type Step1 = { entreprise: string; taille: string; departement: string; siret: string };
type Step2 = { secteurs: string[]; mots_cles: string; montant_min: number };
type Step3 = { plan: string };

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [step1, setStep1] = useState<Step1>({ entreprise: "", taille: "1", departement: "", siret: "" });
  const [step2, setStep2] = useState<Step2>({ secteurs: [], mots_cles: "", montant_min: 0 });
  const [step3, setStep3] = useState<Step3>({ plan: "pro" });

  const progress = (step / 3) * 100;

  const saveStep = async (final = false) => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const updates: Record<string, unknown> = {};
      if (step >= 1) {
        updates.entreprise_nom = step1.entreprise;
        updates.entreprise_taille = step1.taille;
        updates.zone_geo = step1.departement;
        updates.siret = step1.siret;
      }
      if (step >= 2) {
        updates.montant_min_marche = step2.montant_min;
      }
      if (final) {
        updates.plan = step3.plan;
        updates.onboarding_complete = true;
      }

      await supabase.from("users").update(updates).eq("id", user.id);

      if (step >= 2 && step2.secteurs.length > 0) {
        await supabase.from("user_secteurs").delete().eq("user_id", user.id);
        await supabase.from("user_secteurs").insert(
          step2.secteurs.map((s) => ({
            user_id: user.id,
            secteur: s,
            mots_cles: step2.mots_cles.split(",").map((k) => k.trim()).filter(Boolean),
            actif: true,
          }))
        );
      }
    } catch (err) {
      console.error("Onboarding save error:", err);
      toast.error("Erreur lors de la sauvegarde. Réessaie.");
    }
  };

  const nextStep = async () => {
    if (step === 1) {
      if (!step1.entreprise || !step1.taille || !step1.departement) {
        toast.error("Veuillez remplir les champs obligatoires.");
        return;
      }
    }
    if (step === 2) {
      if (step2.secteurs.length === 0) {
        toast.error("Sélectionnez au moins un secteur.");
        return;
      }
    }
    await saveStep(false);
    setStep((s) => s + 1);
  };

  const handleFinish = async () => {
    setLoading(true);
    await saveStep(true);

    // Trigger welcome email via n8n webhook (fire-and-forget)
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email && process.env.NEXT_PUBLIC_N8N_ONBOARDING_WEBHOOK_URL) {
        fetch(process.env.NEXT_PUBLIC_N8N_ONBOARDING_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        }).catch(() => {});
      }
    } catch {
      // Silently ignore webhook errors
    }

    toast.success("Profil configuré !");
    router.push("/dashboard");
  };

  const toggleSecteur = (s: string) => {
    setStep2((prev) => ({
      ...prev,
      secteurs: prev.secteurs.includes(s)
        ? prev.secteurs.filter((x) => x !== s)
        : [...prev.secteurs, s],
    }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: "var(--bg)" }}>
      <Link href="/" className="font-heading text-2xl mb-10" style={{ color: "#F1F5F9", letterSpacing: "0.18em" }}>
        OFFRIO
      </Link>

      <div className="w-full max-w-xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>Étape {step} / 3</span>
            <span className="text-xs" style={{ color: "var(--text-3)" }}>
              {step === 1 ? "Votre entreprise" : step === 2 ? "Vos secteurs" : "Votre plan"}
            </span>
          </div>
          <div className="prog">
            <div className="prog-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="glass grad-border p-8">
          {/* Step 1 */}
          {step === 1 && (
            <div className="anim-fadeUp">
              <h2 className="font-heading text-2xl mb-1" style={{ color: "#F1F5F9", letterSpacing: "0.06em" }}>VOTRE ENTREPRISE</h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-2)" }}>Ces informations permettent à l&apos;IA de filtrer les AOs pertinents.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
                    Nom de l&apos;entreprise <span style={{ color: "var(--danger)" }}>*</span>
                  </label>
                  <input
                    className="field"
                    placeholder="Martin Chaudronnerie SARL"
                    value={step1.entreprise}
                    onChange={(e) => setStep1({ ...step1, entreprise: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
                    Taille de l&apos;entreprise <span style={{ color: "var(--danger)" }}>*</span>
                  </label>
                  <select
                    className="field"
                    value={step1.taille}
                    onChange={(e) => setStep1({ ...step1, taille: e.target.value })}
                  >
                    <option value="1">1 salarié (solo)</option>
                    <option value="2-10">2 à 10 salariés</option>
                    <option value="11-30">11 à 30 salariés</option>
                    <option value="31-100">31 à 100 salariés</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
                    Département <span style={{ color: "var(--danger)" }}>*</span>
                  </label>
                  <select
                    className="field"
                    value={step1.departement}
                    onChange={(e) => setStep1({ ...step1, departement: e.target.value })}
                  >
                    <option value="">Sélectionner un département</option>
                    {DEPARTEMENTS.map((d) => (
                      <option key={d.code} value={d.code}>{d.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
                    SIRET <span className="font-normal normal-case" style={{ color: "var(--text-3)" }}>(optionnel)</span>
                  </label>
                  <input
                    className="field"
                    placeholder="12345678900012"
                    maxLength={14}
                    value={step1.siret}
                    onChange={(e) => setStep1({ ...step1, siret: e.target.value.replace(/\D/g, "") })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="anim-fadeUp">
              <h2 className="font-heading text-2xl mb-1" style={{ color: "#F1F5F9", letterSpacing: "0.06em" }}>VOS SECTEURS</h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-2)" }}>Sélectionnez tous les secteurs qui correspondent à votre activité.</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
                    Secteurs <span style={{ color: "var(--danger)" }}>*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SECTEURS.map((s) => {
                      const selected = step2.secteurs.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSecteur(s)}
                          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
                          style={{
                            background: selected ? "rgba(37,99,235,0.18)" : "rgba(30,41,59,0.6)",
                            border: `1px solid ${selected ? "rgba(37,99,235,0.5)" : "var(--border-2)"}`,
                            color: selected ? "#93C5FD" : "var(--text-2)",
                            cursor: "pointer",
                          }}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
                    Mots-clés personnalisés <span className="font-normal normal-case" style={{ color: "var(--text-3)" }}>(séparés par des virgules)</span>
                  </label>
                  <input
                    className="field"
                    placeholder="canalisation, inox, robinetterie..."
                    value={step2.mots_cles}
                    onChange={(e) => setStep2({ ...step2, mots_cles: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
                    Montant minimum des marchés
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={0}
                      max={500000}
                      step={5000}
                      value={step2.montant_min}
                      onChange={(e) => setStep2({ ...step2, montant_min: +e.target.value })}
                      className="flex-1"
                      style={{ accentColor: "var(--accent)" }}
                    />
                    <span className="text-sm font-bold w-28 text-right" style={{ color: "#F1F5F9" }}>
                      {step2.montant_min.toLocaleString("fr-FR")} €
                    </span>
                  </div>
                  <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-3)" }}>
                    <span>0 €</span><span>500 000 €</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="anim-fadeUp">
              <h2 className="font-heading text-2xl mb-1" style={{ color: "#F1F5F9", letterSpacing: "0.06em" }}>VOTRE PLAN</h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-2)" }}>14 jours gratuits · Sans carte bancaire · Résiliable à tout moment</p>

              <div className="space-y-3">
                {PLANS.map((plan) => {
                  const selected = step3.plan === plan.slug;
                  return (
                    <button
                      key={plan.slug}
                      type="button"
                      onClick={() => setStep3({ plan: plan.slug })}
                      className="w-full text-left p-4 rounded-xl transition-all duration-150 relative"
                      style={{
                        background: selected ? "rgba(37,99,235,0.1)" : "rgba(30,41,59,0.5)",
                        border: `1px solid ${selected ? "rgba(37,99,235,0.5)" : "var(--border-2)"}`,
                        cursor: "pointer",
                      }}
                    >
                      {plan.highlight && (
                        <span
                          className="absolute -top-2.5 right-4 text-xs px-2.5 py-0.5 rounded-full font-bold"
                          style={{ background: "var(--accent)", color: "#fff" }}
                        >
                          Populaire
                        </span>
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold" style={{ color: "#F1F5F9" }}>{plan.name}</span>
                        <span className="font-heading text-xl" style={{ color: selected ? "#93C5FD" : "#F1F5F9" }}>
                          {plan.price}€<span className="text-sm font-normal" style={{ color: "var(--text-3)" }}>/mois</span>
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {plan.features.map((f) => (
                          <span key={f} className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(15,23,42,0.5)", color: "var(--text-2)" }}>
                            {f}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="btn-secondary flex-1"
              >
                ← Retour
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary flex-1"
              >
                Continuer →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                disabled={loading}
                className="btn-primary flex-1"
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Configuration..." : "Accéder au dashboard →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
