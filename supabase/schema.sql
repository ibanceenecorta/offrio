-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============ TABLES ============

create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  prenom text,
  nom text,
  entreprise_nom text,
  entreprise_taille text,
  zone_geo text,
  siret text,
  secteur_principal text,
  stripe_customer_id text,
  subscription_status text not null default 'trialing' check (subscription_status in ('trialing','active','canceled','past_due')),
  plan text check (plan in ('starter','pro','scale')),
  trial_ends_at timestamptz default (now() + interval '14 days'),
  email_frequence text not null default 'quotidien' check (email_frequence in ('quotidien','2x_semaine','hebdomadaire')),
  montant_min_marche integer not null default 5000,
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.appels_offres (
  id uuid default uuid_generate_v4() primary key,
  titre text not null,
  description_courte text,
  description_complete text,
  secteur text,
  score_ia integer check (score_ia >= 0 and score_ia <= 100),
  date_limite date,
  source_url text,
  resume_ia text,
  draft_email text,
  created_at timestamptz not null default now()
);

create table if not exists public.user_aos (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  ao_id uuid references public.appels_offres(id) on delete cascade not null,
  statut text not null default 'nouveau' check (statut in ('nouveau','lu','interessant','ignore')),
  viewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique(user_id, ao_id)
);

create table if not exists public.user_secteurs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  secteur text not null,
  mots_cles text[] default '{}',
  actif boolean not null default true
);

-- ============ ROW LEVEL SECURITY ============

alter table public.users enable row level security;
alter table public.appels_offres enable row level security;
alter table public.user_aos enable row level security;
alter table public.user_secteurs enable row level security;

-- users
create policy "Users can view own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);

-- appels_offres: users see only their own AOs
create policy "Users can view own AOs" on public.appels_offres for select using (
  exists (select 1 from public.user_aos where ao_id = appels_offres.id and user_id = auth.uid())
);

-- user_aos
create policy "Users can view own user_aos" on public.user_aos for select using (user_id = auth.uid());
create policy "Users can update own user_aos" on public.user_aos for update using (user_id = auth.uid());

-- user_secteurs
create policy "Users can manage own secteurs" on public.user_secteurs for all using (user_id = auth.uid());

-- ============ AUTO-CREATE USER PROFILE ============

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, prenom, nom, secteur_principal)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'prenom',
    new.raw_user_meta_data->>'nom',
    new.raw_user_meta_data->>'secteur_principal'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
