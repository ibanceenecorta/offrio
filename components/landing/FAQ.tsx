"use client";

import { useState } from "react";

const items = [
  {
    q: "D'où viennent les appels d'offres ?",
    a: "OFFRIO se connecte directement à BOAMP (Bulletin Officiel des Annonces des Marchés Publics), la source officielle française. Les plans Pro et Scale incluent également d'autres sources comme PLACE et les plateformes régionales.",
  },
  {
    q: "Comment l'IA sélectionne les AOs pertinents ?",
    a: "Lors de l'onboarding, vous renseignez votre secteur d'activité, vos mots-clés et votre zone géographique. L'IA analyse chaque AO en fonction de ces critères et attribue un score de 0 à 100. Vous recevez uniquement les AOs avec un score élevé.",
  },
  {
    q: "Puis-je annuler à tout moment ?",
    a: "Oui, sans engagement. Vous pouvez annuler votre abonnement à tout moment depuis votre espace client. Vous continuez à avoir accès jusqu'à la fin de la période en cours.",
  },
  {
    q: "Pour quel type d'artisan ça fonctionne ?",
    a: "OFFRIO est adapté à tous les corps de métier du bâtiment et de l'industrie : chaudronnerie, soudure, plomberie, électricité, menuiserie, maçonnerie, peinture, et plus encore. Si votre secteur est couvert par les marchés publics, OFFRIO fonctionne pour vous.",
  },
  {
    q: "Y a-t-il une période d'essai ?",
    a: "Oui, 14 jours d'essai gratuit, sans carte bancaire. Vous avez accès à toutes les fonctionnalités de votre plan pendant cette période. Si vous n'êtes pas satisfait, vous ne payez rien.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="divider mb-20" />

        <div className="text-center mb-16 reveal">
          <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--accent)" }}>
            FAQ
          </p>
          <h2 className="font-heading text-4xl md:text-5xl" style={{ color: "#F1F5F9", letterSpacing: "0.04em" }}>
            QUESTIONS FRÉQUENTES
          </h2>
        </div>

        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="glass grad-border reveal"
              style={{ transitionDelay: `${i * 0.07}s`, overflow: "hidden" }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
                style={{ background: "transparent", border: "none", cursor: "pointer" }}
              >
                <span className="font-semibold text-sm md:text-base pr-4" style={{ color: "#F1F5F9" }}>
                  {item.q}
                </span>
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200"
                  style={{
                    background: "rgba(37,99,235,0.12)",
                    color: "#93C5FD",
                    transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
              <div
                style={{
                  maxHeight: open === i ? "300px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.3s ease",
                }}
              >
                <p
                  className="px-5 pb-5 text-sm leading-relaxed"
                  style={{ color: "var(--text-2)" }}
                >
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
