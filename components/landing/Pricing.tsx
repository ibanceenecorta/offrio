import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "79",
    slug: "starter",
    desc: "Pour l'artisan solo qui veut commencer",
    features: [
      "1 utilisateur",
      "10 AOs / jour",
      "Source BOAMP",
      "Résumés IA",
      "Alertes email quotidiennes",
    ],
    highlight: false,
  },
  {
    name: "Pro",
    price: "119",
    slug: "pro",
    desc: "Pour les PME de 5 à 30 salariés",
    features: [
      "5 utilisateurs",
      "30 AOs / jour",
      "3 sources d'AOs",
      "Scoring IA avancé",
      "Drafts email IA",
      "Profil personnalisé",
    ],
    highlight: true,
  },
  {
    name: "Scale",
    price: "199",
    slug: "scale",
    desc: "Pour les entreprises de 30 à 100 salariés",
    features: [
      "Utilisateurs illimités",
      "AOs illimités",
      "Sources illimitées",
      "Multi-utilisateurs",
      "Support prioritaire",
      "Onboarding dédié",
    ],
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="divider mb-20" />

        <div className="text-center mb-16 reveal">
          <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--accent)" }}>
            Tarifs
          </p>
          <h2 className="font-heading text-4xl md:text-5xl mb-4" style={{ color: "#F1F5F9", letterSpacing: "0.04em" }}>
            SIMPLE ET TRANSPARENT
          </h2>
          <p style={{ color: "var(--text-2)" }}>14 jours gratuits · Sans carte bancaire · Résiliable à tout moment</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`reveal grad-border glass${plan.highlight ? "" : " glass-hover"} p-7 flex flex-col relative`}
              style={{
                transitionDelay: `${i * 0.1}s`,
                ...(plan.highlight
                  ? {
                      background: "rgba(37,99,235,0.08)",
                      borderColor: "rgba(37,99,235,0.4)",
                      transform: "scale(1.03)",
                      boxShadow: "0 0 40px rgba(37,99,235,0.18)",
                    }
                  : {}),
              }}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span
                    className="anim-glow badge badge-blue text-xs px-3 py-1"
                    style={{ background: "var(--accent)", color: "#fff", border: "none" }}
                  >
                    Populaire
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-heading text-2xl mb-1" style={{ color: "#F1F5F9", letterSpacing: "0.06em" }}>
                  {plan.name}
                </h3>
                <p className="text-sm mb-4" style={{ color: "var(--text-2)" }}>{plan.desc}</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-5xl" style={{ color: "#F1F5F9" }}>{plan.price}€</span>
                  <span className="text-sm" style={{ color: "var(--text-3)" }}>/mois</span>
                </div>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-2)" }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7l3.5 3.5L12 3.5" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={`/register?plan=${plan.slug}`}
                className={plan.highlight ? "btn-primary" : "btn-secondary"}
                style={{ textAlign: "center", justifyContent: "center" }}
              >
                Choisir {plan.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
