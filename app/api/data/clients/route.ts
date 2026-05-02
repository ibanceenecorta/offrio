import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// N8N Usage:
// GET https://your-domain/api/data/clients
// Headers: { "x-api-key": "offrio_secret_n8n_key" }
// Returns: Array of active clients with secteurs, mots_cles, telephone, certifications, types_marches

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");
  if (apiKey !== process.env.DATA_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceClient();

  const { data: users, error } = await supabase
    .from("users")
    .select("id, email, prenom, nom, entreprise_nom, entreprise_taille, zone_geo, secteur_principal, plan, subscription_status, montant_min_marche, telephone, certifications, types_marches, email_frequence, onboarding_complete, trial_ends_at")
    .in("subscription_status", ["trialing", "active"]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: secteurs } = await supabase
    .from("user_secteurs")
    .select("user_id, secteur, mots_cles")
    .eq("actif", true);

  const enriched = (users ?? []).map(u => ({
    ...u,
    secteurs: (secteurs ?? []).filter(s => s.user_id === u.id).map(s => s.secteur),
    // mots_cles as comma-separated string for BOAMP search query
    mots_cles: (secteurs ?? []).filter(s => s.user_id === u.id).flatMap(s => s.mots_cles ?? []).join(", "),
  }));

  return NextResponse.json(enriched);
}
