const steps = [
  {
    step: "01",
    title: "Scan BOAMP toutes les heures",
    desc: "OFFRIO surveille en continu la plateforme officielle BOAMP. Chaque nouvelle publication est détectée en temps réel.",
    cmd: "$ offrio scan --source=BOAMP --interval=1h",
    output: "✓ 47 nouveaux marchés détectés · Analyse IA en cours...",
  },
  {
    step: "02",
    title: "Scoring et résumé par IA",
    desc: "Notre IA analyse le contenu de chaque AO, calcule un score de pertinence et génère un résumé en 5 lignes.",
    cmd: "$ offrio analyze --ao=MRC-2025-04712",
    output: "✓ Score IA: 94/100 · Secteur: Chaudronnerie · Résumé généré",
  },
  {
    step: "03",
    title: "Livraison uniquement des AOs pertinents",
    desc: "Vous recevez uniquement les AOs qui correspondent à votre profil, avec le résumé et le score IA.",
    cmd: "$ offrio deliver --email=vous@exemple.fr --min-score=75",
    output: "✓ 3 AOs envoyés · 44 filtrés · Pertinence: 98%",
  },
  {
    step: "04",
    title: "Suivi dans le dashboard",
    desc: "Marquez les AOs comme intéressants, ignorez les non-pertinents. Votre historique et vos performances sont disponibles en temps réel.",
    cmd: "$ offrio status --ao=MRC-2025-04712 --set=interessant",
    output: "✓ Statut mis à jour · Score moyen: 91/100 · 3 AOs actifs",
  },
];

export default function Features() {
  return (
    <section id="comment" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="divider mb-20" />

        <div className="text-center mb-16 reveal">
          <p className="text-sm font-semibold tracking-widest uppercase mb-3 text-gradient-accent">
            Comment ça marche
          </p>
          <h2 className="font-heading text-4xl md:text-5xl" style={{ color: "#F0F4FF", letterSpacing: "0.04em" }}>
            4 ÉTAPES, ZÉRO EFFORT
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((s, i) => (
            <div key={s.step} className="reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="glass grad-border glass-hover p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="font-heading text-3xl text-gradient-accent"
                    style={{ letterSpacing: "0.05em" }}
                  >
                    {s.step}
                  </span>
                  <h3 className="font-bold text-base" style={{ color: "#F0F4FF" }}>{s.title}</h3>
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-2)" }}>
                  {s.desc}
                </p>
                <div className="terminal">
                  <div className="terminal-bar">
                    <div className="t-dot" style={{ background: "#FF5F57" }} />
                    <div className="t-dot" style={{ background: "#FEBC2E" }} />
                    <div className="t-dot" style={{ background: "#28C840" }} />
                    <span className="text-xs ml-2" style={{ color: "#8B949E" }}>offrio-cli</span>
                  </div>
                  <div className="terminal-body overflow-x-auto">
                    <div className="t-dim break-all sm:whitespace-nowrap">{s.cmd}</div>
                    <div className="t-green mt-1 break-all sm:whitespace-nowrap">{s.output}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
