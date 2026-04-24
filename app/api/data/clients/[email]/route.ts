import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// N8N Usage:
// GET https://your-domain/api/data/clients/user@example.com
// Headers: { "x-api-key": "offrio_secret_n8n_key" }
// Returns: Complete client profile with secteurs, mots_cles, telephone, certifications

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: NextRequest, { params }: { params: { email: string } }) {
  const apiKey = request.headers.get("x-api-key");
  if (apiKey !== process.env.DATA_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = decodeURIComponent(params.email);
  const supabase = getServiceClient();

  const { data: user, error } = await supabase
    .from("users")
    .select("*, telephone, certifications, types_marches")
    .eq("email", email)
    .single();

  if (error || !user) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  const [{ data: secteurs }, { count }] = await Promise.all([
    supabase.from("user_secteurs").select("secteur, mots_cles").eq("user_id", user.id).eq("actif", true),
    supabase.from("user_aos").select("*", { count: "exact", head: true }).eq("user_id", user.id),
  ]);

  return NextResponse.json({
    ...user,
    secteurs: secteurs ?? [],
    // mots_cles as comma-separated string for BOAMP search
    mots_cles: (secteurs ?? []).flatMap(s => s.mots_cles ?? []).join(", "),
    aos_count: count ?? 0,
  });
}
