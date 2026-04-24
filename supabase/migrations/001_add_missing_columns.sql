-- Migration 001 — Ajout des champs manquants pour compatibilité n8n
-- À exécuter dans Supabase → SQL Editor

-- Champs clients manquants (existaient dans Airtable)
alter table public.users add column if not exists telephone text;
alter table public.users add column if not exists certifications text;
alter table public.users add column if not exists types_marches text;

-- ID BOAMP pour la déduplication dans le workflow n8n
alter table public.appels_offres add column if not exists boamp_id text;

-- Index pour la recherche rapide par boamp_id
create index if not exists idx_appels_offres_boamp_id on public.appels_offres(boamp_id);
