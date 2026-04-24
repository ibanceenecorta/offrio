import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// N8N Usage — GET:
// GET https://your-domain/api/data/aos?client_email=user@example.com
// Headers: { "x-api-key": "offrio_secret_n8n_key" }
// Returns: All AOs assigned to this client (includes boamp_id for deduplication)

// N8N Usage — POST:
// POST https://your-domain/api/data/aos
// Headers: { "x-api-key": "offrio_secret_n8n_key", "Content-Type": "application/json" }
// Body: { titre, description_courte, secteur, score_ia, date_limite, source_url, resume_ia, draft_email, client_email, boamp_id }
// Creates an AO and assigns it to the client. Skips silently if boamp_id already exists for this client.

function getServiceClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

function authCheck(request: NextRequest): boolean {
  return request.headers.get("x-api-key") === process.env.DATA_API_KEY;
}

export async function GET(request: NextRequest) {
  if (!authCheck(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const email = request.nextUrl.searchParams.get("client_email");
  if (!email) return NextResponse.json({ error: "client_email required" }, { status: 400 });

  const supabase = getServiceClient();
  const { data: user } = await supabase.from("users").select("id").eq("email", email).single();
  if (!user) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  const { data, error } = await supabase
    .from("user_aos")
    .select("id, statut, created_at, ao:appels_offres(id, titre, boamp_id, score_ia, date_limite, source_url, secteur)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: NextRequest) {
  if (!authCheck(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { client_email, boamp_id, ...aoData } = body;

  if (!client_email || !aoData.titre) {
    return NextResponse.json({ error: "client_email and titre are required" }, { status: 400 });
  }

  const supabase = getServiceClient();

  const { data: user } = await supabase.from("users").select("id").eq("email", client_email).single();
  if (!user) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  // Deduplication: skip if this boamp_id was already sent to this client
  if (boamp_id) {
    const { data: existing } = await supabase
      .from("user_aos")
      .select("id")
      .eq("user_id", user.id)
      .eq("ao_id", supabase.from("appels_offres").select("id").eq("boamp_id", boamp_id) as unknown as string)
      .limit(1);

    // Simpler dedup: check by boamp_id via join
    const { data: existingAo } = await supabase
      .from("appels_offres")
      .select("id")
      .eq("boamp_id", boamp_id)
      .single();

    if (existingAo) {
      const { data: existingLink } = await supabase
        .from("user_aos")
        .select("id")
        .eq("user_id", user.id)
        .eq("ao_id", existingAo.id)
        .single();

      if (existingLink) {
        return NextResponse.json({ skipped: true, reason: "AO already sent to this client" }, { status: 200 });
      }
    }
    void existing;
  }

  const { data: ao, error: aoErr } = await supabase
    .from("appels_offres")
    .insert({ ...aoData, boamp_id: boamp_id || null })
    .select()
    .single();

  if (aoErr) return NextResponse.json({ error: aoErr.message }, { status: 500 });

  const { error: linkErr } = await supabase
    .from("user_aos")
    .insert({ user_id: user.id, ao_id: ao.id, statut: "nouveau" });

  if (linkErr) return NextResponse.json({ error: linkErr.message }, { status: 500 });

  return NextResponse.json(ao, { status: 201 });
}
