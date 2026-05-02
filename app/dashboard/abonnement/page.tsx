import { createClient } from "@/lib/supabase/server";

const PLANS = [
  {
    name: "Starter", price: "79", slug: "starter",
    features: ["2 AOs / jour", "Source BOAMP", "Résumés IA", "Alertes email quotidiennes"],
  },
  {
    name: "Pro", price: "119", slug: "pro",
    features: ["5 AOs / jour", "3 sources d'AOs", "Scoring IA avancé", "Profil personnalisé"],
    highlight: true,
  },
  {
    name: "Scale", price: "199", slug: "scale",
    features: ["AOs illimités", "Sources illimitées", "Support prioritaire", "Onboarding dédié"],
  },
];

export default async function AbonnementPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users")
    .select("plan, subscription_status, trial_ends_at, stripe_customer_id")
    .eq("id", user!.id)
    .single();

  const plan = profile?.plan || "starter";
  const status = profile?.subscription_status;
  const trialEnd = profile?.trial_ends_at ? new Date(profile.trial_ends_at) : null;
  const daysLeft = trialEnd ? Math.max(0, Math.ceil((trialEnd.getTime() - Date.now()) / 86400000)) : null;

  const statusLabels: Record<string, string> = {
    trialing: "Essai gratuit",
    active: "Actif",
    canceled: "Annulé",
    past_due: "Paiement en retard",
  };
  const statusLabel = statusLabels[status || "trialing"] || "Inconnu";

  const statusColors: Record<string, string> = {
    trialing: "#F59E0B",
    active: "#22C55E",
    canceled: "#EF4444",
    past_due: "#EF4444",
  };
  const statusColor = statusColors[status || "trialing"] || "var(--text-3)";

  const currentPlan = PLANS.find((p) => p.slug === plan) || PLANS[0];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl mb-1" style={{ color: "#F1F5F9", letterSpacing: "0.04em" }}>
          ABONNEMENT
        </h1>
        <p className="text-sm" style={{ color: "var(--text-2)" }}>
          Gérez votre plan et vos informations de facturation.
        </p>
      </div>

      {/* Current plan */}
      <div className="glass grad-border p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--text-3)" }}>
              Plan actuel
            </p>
            <h2 className="font-heading text-2xl" style={{ color: "#F1F5F9", letterSpacing: "0.05em" }}>
              {currentPlan.name}
            </h2>
            <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>
              {currentPlan.price}€ / mois
            </p>
          </div>
          <div className="text-right">
            <span
              className="px-3 py-1.5 rounded-lg text-sm font-semibold"
              style={{ background: `${statusColor}18`, color: statusColor, border: `1px solid ${statusColor}33` }}
            >
              {statusLabel}
            </span>
            {status === "trialing" && daysLeft !== null && (
              <p className="text-xs mt-2" style={{ color: "var(--text-3)" }}>
                {daysLeft} jour{daysLeft > 1 ? "s" : ""} restant{daysLeft > 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {currentPlan.features.map((f) => (
            <span key={f} className="badge badge-blue">{f}</span>
          ))}
        </div>

        <form action="/api/stripe/portal" method="POST">
          <button
            type="submit"
            className="btn-primary"
            style={{ padding: "10px 24px" }}
          >
            Gérer mon abonnement
          </button>
        </form>
      </div>

      {/* Upgrade options */}
      <div className="mb-4">
        <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--text-2)" }}>
          Changer de plan
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {PLANS.filter((p) => p.slug !== plan).map((p) => (
            <div
              key={p.slug}
              className="glass grad-border p-5 flex flex-col"
              style={p.highlight ? { background: "rgba(79,110,247,0.06)", borderColor: "rgba(79,110,247,0.3)" } : {}}
            >
              <h4 className="font-heading text-xl mb-1" style={{ color: "#F1F5F9", letterSpacing: "0.05em" }}>
                {p.name}
              </h4>
              <p className="font-heading text-2xl mb-3" style={{ color: "#93B4FF" }}>
                {p.price}€<span className="text-sm font-normal" style={{ color: "var(--text-3)" }}>/mois</span>
              </p>
              <ul className="space-y-1.5 flex-1 mb-4">
                {p.features.map((f) => (
                  <li key={f} className="text-xs flex items-center gap-2" style={{ color: "var(--text-2)" }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l2.5 2.5 5.5-5" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <form action="/api/stripe/checkout" method="POST">
                <input type="hidden" name="plan" value={p.slug} />
                <button type="submit" className="btn-secondary w-full" style={{ padding: "9px", fontSize: "13px", justifyContent: "center" }}>
                  Passer à {p.name}
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
