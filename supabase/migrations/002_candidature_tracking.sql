-- Migration 002: Suivi de candidature
-- Ajouter colonnes à user_aos pour le tracking candidature

ALTER TABLE user_aos
  ADD COLUMN IF NOT EXISTS montant_gagne integer,
  ADD COLUMN IF NOT EXISTS contexte_candidature text,
  ADD COLUMN IF NOT EXISTS memo_technique text;

-- Mettre à jour le check de statut pour inclure les nouveaux statuts
ALTER TABLE user_aos DROP CONSTRAINT IF EXISTS user_aos_statut_check;
ALTER TABLE user_aos ADD CONSTRAINT user_aos_statut_check
  CHECK (statut IN ('nouveau', 'lu', 'interessant', 'dossier_en_cours', 'envoye', 'gagne', 'perdu', 'ignore'));
