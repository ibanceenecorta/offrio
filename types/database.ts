export type SubscriptionStatus = "trialing" | "active" | "canceled" | "past_due";
export type Plan = "starter" | "pro" | "scale";
export type EmailFrequence = "quotidien" | "2x_semaine" | "hebdomadaire";
export type AOStatut = "nouveau" | "lu" | "interessant" | "ignore";

export interface User {
  id: string;
  email: string;
  prenom: string | null;
  nom: string | null;
  entreprise_nom: string | null;
  entreprise_taille: string | null;
  zone_geo: string | null;
  siret: string | null;
  secteur_principal: string | null;
  stripe_customer_id: string | null;
  subscription_status: SubscriptionStatus;
  plan: Plan | null;
  trial_ends_at: string | null;
  email_frequence: EmailFrequence;
  montant_min_marche: number;
  onboarding_complete: boolean;
  created_at: string;
}

export interface AppelOffre {
  id: string;
  titre: string;
  description_courte: string | null;
  description_complete: string | null;
  secteur: string | null;
  score_ia: number | null;
  date_limite: string | null;
  source_url: string | null;
  resume_ia: string | null;
  draft_email: string | null;
  created_at: string;
}

export interface UserAO {
  id: string;
  user_id: string;
  ao_id: string;
  statut: AOStatut;
  viewed_at: string | null;
  created_at: string;
  appels_offres?: AppelOffre;
}

export interface UserSecteur {
  id: string;
  user_id: string;
  secteur: string;
  mots_cles: string[];
  actif: boolean;
}

export const SECTEURS = [
  "Chaudronnerie",
  "Soudure",
  "Tuyauterie",
  "Plomberie",
  "Électricité",
  "Menuiserie",
  "Maçonnerie",
  "Autre",
] as const;

export type Secteur = (typeof SECTEURS)[number];
