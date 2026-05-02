import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "79",
    slug: "starter",
    desc: "Pour l'artisan solo qui veut commencer",
    features: [
      "2 AOs / jour",
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
      "5 AOs / jour",
      "3 sources d'AOs",
      "Scoring IA avancé",
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
      "AOs illimités",
      "Sources illimitées",
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
          <p className="text-sm font-semibold tracking-widest uppercase mb-3 text-gradient-accent">
            Tarifs
          </p>
          <h2 className="font-heading text-4xl md:text-5xl mb-4" style={{ color: "#F0F4FF", letterSpacing: "0.04em" }}>
            SIMPLE ET TRANSPARENT
          </h2>
          <p style={{ color: "var(--text-2)" }}>14 jours gratuits · Sans carte bancaire · Résiliable à tout moment</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 items-start">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`reveal flex flex-col relative${plan.highlight ? "" : " glass grad-border glass-hover"}`}
              style={{
                transitionDelay: `${i * 0.1}s`,
                padding: plan.highlight ? "0" : "28px",
                ...(plan.highlight ? {} : {}),
              }}
            >
              {plan.highlight ? (
                /* Pro card — full gradient border treatment */
                <div
                  className="relative flex flex-col h-full rounded-2xl overflow-hidden"
                  style={{
                    background: "linear-gradient(160deg, rgba(79,110,247,0.14) 0%, rgba(124,58,237,0.08) 100%)",
                    border: "1px solid rgba(79,110,247,0.45)",
                    boxShadow: "0 0 60px rgba(79,110,247,0.2), 0 0 120px rgba(124,58,237,0.08)",
                    padding: "28px",
                    transform: "translateY(-8px)",
                  }}
                >
                  {/* Glow top */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(79,110,247,0.6), rgba(124,58,237,0.4), transparent)" }}
                  />

                  {/* Badge */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span
                      className="text-xs font-bold px-4 py-1.5 rounded-full"
                      style={{
                        background: "var(--accent-gradient)",
                        color: "#fff",
                        boxShadow: "0 4px 16px rgba(79,110,247,0.4)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Populaire
                    </span>
                  </div>

                  <PlanContent plan={plan} isPro />
                </div>
              ) : (
                <PlanContent plan={plan} isPro={false} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlanContent({ plan, isPro }: { plan: typeof plans[0]; isPro: boolean }) {
  return (
    <>
      <div className="mb-6">
        <h3
          className="font-heading text-2xl mb-1"
          style={{ color: isPro ? "#F0F4FF" : "var(--text-2)", letterSpacing: "0.06em" }}
        >
          {plan.name}
        </h3>
        <p className="text-sm mb-5" style={{ color: "var(--text-2)" }}>{plan.desc}</p>
        <div className="flex items-end gap-1">
          <span
            className="font-heading text-5xl"
            style={{ color: "#F0F4FF", lineHeight: 1 }}
          >
            {plan.price}€
          </span>
          <span className="text-sm pb-1" style={{ color: "var(--text-3)" }}>/mois</span>
        </div>
      </div>

      <ul className="space-y-3 flex-1 mb-8">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-2)" }}>
            <span
              className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
              style={{
                background: isPro ? "rgba(79,110,247,0.15)" : "rgba(34,197,94,0.1)",
                border: isPro ? "1px solid rgba(79,110,247,0.3)" : "1px solid rgba(34,197,94,0.2)",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5l2.5 2.5L8.5 2.5" stroke={isPro ? "#93B4FF" : "#4ADE80"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {f}
          </li>
        ))}
      </ul>

      <Link
        href={`/register?plan=${plan.slug}`}
        className={isPro ? "btn-primary" : "btn-secondary"}
        style={{ textAlign: "center", justifyContent: "center" }}
      >
        Choisir {plan.name}
      </Link>
    </>
  );
}
