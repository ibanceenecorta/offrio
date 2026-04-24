# OFFRIO — Veille automatisée d'appels d'offres

Outil de veille automatisée d'appels d'offres pour artisans et PME industrielles en France.

**Stack :** Next.js 14 App Router · TypeScript · Tailwind CSS · Shadcn/ui · Supabase · Stripe

---

## Setup pas à pas

### 1. Cloner et installer

```bash
git clone <repo>
cd offrio
npm install
cp .env.example .env.local
```

### 2. Configurer Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Aller dans **Settings → API** et copier :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret key** → `SUPABASE_SERVICE_ROLE_KEY`
3. Aller dans **SQL Editor** et exécuter le contenu de `supabase/schema.sql`

Cela crée les tables `users`, `appels_offres`, `user_aos`, `user_secteurs` avec Row Level Security activé, ainsi qu'un trigger pour créer automatiquement le profil utilisateur à l'inscription.

### 3. Configurer Stripe

1. Récupérer vos clés depuis [dashboard.stripe.com](https://dashboard.stripe.com/apikeys) :
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`

2. Les produits Stripe sont déjà créés. Récupérer les **Price IDs** pour chaque plan :
   - Dans Stripe Dashboard → Products → trouver chaque produit
   - Copier le **Price ID** (commence par `price_...`)
   - `STRIPE_PRICE_STARTER` = Price ID du plan Starter (79€/mois)
   - `STRIPE_PRICE_PRO` = Price ID du plan Pro (119€/mois)
   - `STRIPE_PRICE_SCALE` = Price ID du plan Scale (199€/mois)

3. Configurer le webhook Stripe :
   ```bash
   # En local, utiliser Stripe CLI
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   # Copier le webhook signing secret → STRIPE_WEBHOOK_SECRET
   ```

   En production (Vercel) : Stripe Dashboard → Webhooks → Add endpoint
   - URL : `https://votre-domaine.vercel.app/api/stripe/webhook`
   - Events : `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

### 4. Variables d'environnement

Remplir `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_SCALE=price_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note :** L'application fonctionne sans les variables Stripe. Les boutons de paiement affichent un message "configuration en cours" et redirigent vers le dashboard.

### 5. Lancer en développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

### 6. Seed — données de test

Pour insérer 10 appels d'offres fictifs :

```bash
npm run seed
```

Puis, pour les associer à votre compte de test, exécuter dans le SQL Editor Supabase :

```sql
INSERT INTO user_aos (user_id, ao_id, statut, resume_ia, draft_email)
SELECT 'VOTRE-USER-UUID', id, 'nouveau', 'Résumé IA de test', 'Draft email de test'
FROM appels_offres;
```

---

## Déploiement Vercel

1. Pousser le code sur GitHub
2. Importer le projet sur [vercel.com](https://vercel.com)
3. Ajouter toutes les variables d'environnement dans **Settings → Environment Variables**
4. Changer `NEXT_PUBLIC_APP_URL` par votre domaine Vercel
5. Mettre à jour l'URL du webhook Stripe avec le domaine Vercel

```bash
# Ou via CLI
vercel --prod
```

---

## Architecture

```
app/
├── page.tsx                    # Landing page
├── login/page.tsx              # Connexion
├── register/page.tsx           # Inscription
├── onboarding/page.tsx         # Choix du plan
├── dashboard/
│   ├── layout.tsx              # Layout avec sidebar
│   ├── page.tsx                # Vue générale
│   ├── aos/page.tsx            # Mes appels d'offres
│   ├── abonnement/page.tsx     # Gestion abonnement
│   └── parametres/page.tsx     # Paramètres profil
└── api/stripe/
    ├── checkout/route.ts       # Créer session Stripe
    ├── webhook/route.ts        # Gérer events Stripe
    └── portal/route.ts         # Portail facturation

components/
├── landing/                    # Sections landing page
└── dashboard/                  # Composants dashboard

lib/
├── supabase/                   # Clients Supabase (client, server, middleware)
└── stripe/                     # Client Stripe + config plans

supabase/
└── schema.sql                  # Schéma base de données

scripts/
└── seed.ts                     # Données de test
```

---

## Plans Stripe

| Plan | Prix | Product ID |
|------|------|------------|
| Starter | 79€/mois | `prod_UMkwE0pY01vf2N` |
| Pro | 119€/mois | `prod_UMkyQMvlxjRWa9` |
| Scale | 199€/mois | `prod_UMkzCcEFyhboj4` |
