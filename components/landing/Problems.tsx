const problems = [
  {
    icon: "⏱",
    title: "Des heures perdues à chercher",
    desc: "Parcourir BOAMP manuellement chaque jour prend des heures. Des opportunités défilent pendant que vous travaillez.",
  },
  {
    icon: "📭",
    title: "Des opportunités manquées",
    desc: "Les délais de réponse sont courts. Sans veille automatisée, vous découvrez les AOs trop tard pour répondre correctement.",
  },
  {
    icon: "📄",
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
          <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--accent)" }}>
            Le problème
          </p>
          <h2 className="font-heading text-4xl md:text-5xl" style={{ color: "#F1F5F9", letterSpacing: "0.04em" }}>
            LA RÉALITÉ DU TERRAIN
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
                className="text-3xl mb-5 w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.15)" }}
              >
                {p.icon}
              </div>
              <h3 className="text-lg font-bold mb-3" style={{ color: "#F1F5F9" }}>
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
