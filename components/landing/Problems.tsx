const problems = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: "Des heures perdues à chercher",
    desc: "Parcourir BOAMP manuellement chaque jour prend des heures. Des opportunités défilent pendant que vous travaillez.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    title: "Des opportunités manquées",
    desc: "Les délais de réponse sont courts. Sans veille automatisée, vous découvrez les AOs trop tard pour répondre correctement.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    title: "Des réponses bâclées",
    desc: "Sans préparation, les dossiers de réponse manquent de qualité. La concurrence, elle, est mieux organisée.",
  },
];

export default function Problems() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="divider mb-20" />

        <div className="text-center mb-14 reveal">
          <p className="text-sm font-semibold tracking-widest uppercase mb-3 text-gradient-accent">
            Le problème
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold" style={{ color: "#FAFAFA", letterSpacing: "-0.01em" }}>
            La réalité du terrain
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <div
              key={p.title}
              className="glass glass-hover grad-border p-7 reveal"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div
                className="mb-5 w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)", color: "#A5B4FC" }}
              >
                {p.icon}
              </div>
              <h3 className="text-lg font-bold mb-3" style={{ color: "#F0F4FF" }}>
                {p.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
