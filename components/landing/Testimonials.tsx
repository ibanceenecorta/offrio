const testimonials = [
  {
    name: "Marc Dupont",
    role: "Chaudronnier indépendant · Loire-Atlantique",
    content:
      "Avant OFFRIO je passais 2h par jour sur BOAMP. Maintenant je reçois directement les AOs qui me correspondent, avec le résumé. J'ai répondu à 3 marchés ce mois.",
    initials: "MD",
    score: "94/100",
  },
  {
    name: "Sophie Lemaire",
    role: "Gérante · SL Menuiserie · Normandie",
    content:
      "Le scoring IA est bluffant. On a arrêté de perdre du temps sur des AOs hors budget. Notre taux de réponse a doublé en 2 mois.",
    initials: "SL",
    score: "88/100",
  },
  {
    name: "Karim Benhaddou",
    role: "Directeur · BK Plomberie Chauffage · Île-de-France",
    content:
      "Les drafts d'email générés par l'IA sont vraiment un gain de temps énorme. On les personnalise en 10 minutes et on envoie. Impeccable.",
    initials: "KB",
    score: "91/100",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="divider mb-20" />

        <div className="text-center mb-16 reveal">
          <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--accent)" }}>
            Témoignages
          </p>
          <h2 className="font-heading text-4xl md:text-5xl" style={{ color: "#F1F5F9", letterSpacing: "0.04em" }}>
            ILS UTILISENT OFFRIO
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="glass grad-border glass-hover p-6 flex flex-col gap-4 reveal"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, k) => (
                  <svg key={k} width="14" height="14" viewBox="0 0 14 14" fill="#F59E0B">
                    <path d="M7 1l1.8 3.6L13 5.3l-3 2.9.7 4.1L7 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-2)" }}>
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: "rgba(37,99,235,0.2)", color: "#93C5FD" }}
                >
                  {t.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ color: "#F1F5F9" }}>{t.name}</div>
                  <div className="text-xs truncate" style={{ color: "var(--text-3)" }}>{t.role}</div>
                </div>
                <span className="score-high text-xs flex-shrink-0">{t.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
