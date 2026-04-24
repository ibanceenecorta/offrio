import Stripe from "stripe";

export function getStripeClient(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-03-25.dahlia",
  });
}

export const PLANS = {
  starter: {
    name: "Starter",
    price: 79,
    productId: "prod_UMkwE0pY01vf2N",
    priceEnvKey: "STRIPE_PRICE_STARTER",
    description: "1 artisan solo, 10 AOs par jour, source BOAMP",
    features: [
      "Veille BOAMP quotidienne",
      "10 AOs/jour",
      "Résumés IA",
      "Alertes email",
    ],
  },
  pro: {
    name: "Pro",
    price: 119,
    productId: "prod_UMkyQMvlxjRWa9",
    priceEnvKey: "STRIPE_PRICE_PRO",
    description: "PME 5-30 salariés, 30 AOs par jour, 3 sources, profil personnalisé",
    features: [
      "3 sources de veille",
      "30 AOs/jour",
      "Scoring IA",
      "Drafts email",
      "Profil personnalisé",
    ],
    popular: true,
  },
  scale: {
    name: "Scale",
    price: 199,
    productId: "prod_UMkzCcEFyhboj4",
    priceEnvKey: "STRIPE_PRICE_SCALE",
    description: "Entreprise 30-100 salariés, AOs illimités, toutes sources",
    features: [
      "Sources illimitées",
      "AOs illimités",
      "IA avancée",
      "Multi-utilisateurs",
      "Support prioritaire",
    ],
  },
} as const;

export type PlanId = keyof typeof PLANS;
