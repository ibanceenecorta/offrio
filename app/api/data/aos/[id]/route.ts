import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// N8N Usage:
// PUT https://your-domain/api/data/aos/uuid-here
// Headers: { "x-api-key": "offrio_secret_n8n_key", "Content-Type": "application/json" }
// Body: { statut: "lu" | "interessant" | "ignore" | "nouveau" }
// Updates the statut of a user_ao record

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (request.headers.get("x-api-key") !== process.env.DATA_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { statut } = await request.json();
  const valid = ["nouveau", "lu", "interessant", "ignore"];
  if (!statut || !valid.includes(statut)) {
    return NextResponse.json({ error: `statut must be one of: ${valid.join(", ")}` }, { status: 400 });
  }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data, error } = await supabase.from("user_aos").update({ statut }).eq("id", params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
