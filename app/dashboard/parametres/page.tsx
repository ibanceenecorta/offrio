"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const SECTEURS = [
  "Chaudronnerie", "Soudure", "Tuyauterie", "Plomberie",
  "Électricité", "Menuiserie", "Maçonnerie", "Peinture",
  "Couverture", "Climatisation / CVC", "Terrassement", "Autre",
];

export default function ParametresPage() {
  const [profile, setProfile] = useState({
    prenom: "", nom: "", entreprise_nom: "", zone_geo: "",
    email_frequence: "quotidien", montant_min_marche: 20000,
  });
  const [secteurs, setSecteurs] = useState<string[]>([]);
  const [motsCles, setMotsCles] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: p } = await supabase.from("users").select("*").eq("id", user.id).single();
    if (p) setProfile({
      prenom: p.prenom || "",
      nom: p.nom || "",
      entreprise_nom: p.entreprise_nom || "",
      zone_geo: p.zone_geo || "",
      email_frequence: p.email_frequence || "quotidien",
      montant_min_marche: p.montant_min_marche || 20000,
    });

    const { data: s } = await supabase.from("user_secteurs").select("secteur, mots_cles").eq("user_id", user.id);
    if (s && s.length > 0) {
      setSecteurs(s.map((x: { secteur: string }) => x.secteur));
      const allKeys = s.flatMap((x: { mots_cles?: string[] }) => x.mots_cles || []);
      setMotsCles([...new Set(allKeys)].join(", "));
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("users").update({
        prenom: profile.prenom,
        nom: profile.nom,
        entreprise_nom: profile.entreprise_nom,
        zone_geo: profile.zone_geo,
        email_frequence: profile.email_frequence,
        montant_min_marche: profile.montant_min_marche,
      }).eq("id", user.id);

      await supabase.from("user_secteurs").delete().eq("user_id", user.id);
      if (secteurs.length > 0) {
        const keys = motsCles.split(",").map((k) => k.trim()).filter(Boolean);
        await supabase.from("user_secteurs").insert(
          secteurs.map((s) => ({ user_id: user.id, secteur: s, mots_cles: keys, actif: true }))
        );
      }

      toast.success("Paramètres sauvegardés !");
    } catch {
      toast.error("Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  const toggleSecteur = (s: string) => {
    setSecteurs((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  if (loading) return (
    <div className="space-y-4 max-w-2xl">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="skeleton h-12" />
      ))}
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl mb-1" style={{ color: "#F1F5F9", letterSpacing: "0.04em" }}>
          PARAMÈTRES
        </h1>
        <p className="text-sm" style={{ color: "var(--text-2)" }}>
          Modifiez votre profil et vos préférences de veille.
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <div className="glass grad-border p-6">
          <h2 className="font-semibold mb-5" style={{ color: "#F1F5F9" }}>Informations personnelles</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
                Prénom
              </label>
              <input
                className="field"
                value={profile.prenom}
                onChange={(e) => setProfile({ ...profile, prenom: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
                Nom
              </label>
              <input
                className="field"
                value={profile.nom}
                onChange={(e) => setProfile({ ...profile, nom: e.target.value })}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
              Entreprise
            </label>
            <input
              className="field"
              value={profile.entreprise_nom}
              onChange={(e) => setProfile({ ...profile, entreprise_nom: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
              Département
            </label>
            <input
              className="field"
              placeholder="ex: 44"
              value={profile.zone_geo}
              onChange={(e) => setProfile({ ...profile, zone_geo: e.target.value })}
            />
          </div>
        </div>

        {/* Secteurs */}
        <div className="glass grad-border p-6">
          <h2 className="font-semibold mb-5" style={{ color: "#F1F5F9" }}>Secteurs surveillés</h2>
          <div className="flex flex-wrap gap-2 mb-5">
            {SECTEURS.map((s) => {
              const selected = secteurs.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSecteur(s)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: selected ? "rgba(37,99,235,0.15)" : "rgba(30,41,59,0.5)",
                    border: `1px solid ${selected ? "rgba(37,99,235,0.4)" : "var(--border-2)"}`,
                    color: selected ? "#93C5FD" : "var(--text-2)",
                    cursor: "pointer",
                  }}
                >
                  {s}
                </button>
              );
            })}
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
              Mots-clés personnalisés (séparés par des virgules)
            </label>
            <input
              className="field"
              placeholder="canalisation, inox, robinetterie..."
              value={motsCles}
              onChange={(e) => setMotsCles(e.target.value)}
            />
          </div>
        </div>

        {/* Préférences */}
        <div className="glass grad-border p-6">
          <h2 className="font-semibold mb-5" style={{ color: "#F1F5F9" }}>Préférences de notification</h2>
          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
              Fréquence des alertes email
            </label>
            <select
              className="field"
              value={profile.email_frequence}
              onChange={(e) => setProfile({ ...profile, email_frequence: e.target.value })}
            >
              <option value="quotidien">Quotidien</option>
              <option value="2x_semaine">2× par semaine</option>
              <option value="hebdomadaire">Hebdomadaire</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
              Montant minimum — {profile.montant_min_marche.toLocaleString("fr-FR")} €
            </label>
            <input
              type="range"
              min={5000}
              max={500000}
              step={5000}
              value={profile.montant_min_marche}
              onChange={(e) => setProfile({ ...profile, montant_min_marche: +e.target.value })}
              className="w-full"
              style={{ accentColor: "var(--accent)" }}
            />
          </div>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="btn-primary"
          style={{ padding: "12px 32px", fontSize: "15px", opacity: saving ? 0.7 : 1 }}
        >
          {saving ? "Sauvegarde..." : "Sauvegarder les modifications"}
        </button>
      </div>
    </div>
  );
}
