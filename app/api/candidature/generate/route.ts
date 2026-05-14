import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  // Auth: validate user via Bearer token
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.slice(7);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { user_ao_id, contexte, ao_titre, ao_resume, ao_secteur, entreprise_nom } = body;

  if (!contexte || !ao_titre) {
    return NextResponse.json({ error: "contexte et ao_titre requis" }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `Tu es un expert en marchés publics français. Génère un mémoire technique professionnel pour répondre à cet appel d'offres.

**Appel d'offres :** ${ao_titre}
**Secteur :** ${ao_secteur || "Non précisé"}
**Résumé :** ${ao_resume || "Non disponible"}

**Informations sur l'entreprise candidate :**
- Entreprise : ${entreprise_nom || "Non précisé"}
- Contexte fourni par le client : ${contexte}

**Structure du mémoire technique à produire :**
1. Présentation de l'entreprise (2-3 phrases percutantes)
2. Compréhension du besoin (reformulation de l'AO)
3. Méthodologie et approche technique
4. Références similaires et expérience pertinente
5. Moyens humains et matériels
6. Valeur ajoutée et points différenciants
7. Engagement qualité

Rédige en français professionnel, ton institutionnel. Sois précis et concret. Maximum 600 mots.`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  });

  const memo = message.content[0].type === "text" ? message.content[0].text : "";

  // Sauvegarder dans Supabase (service role pour bypass RLS)
  if (user_ao_id) {
    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    await serviceClient
      .from("user_aos")
      .update({ memo_technique: memo, contexte_candidature: contexte })
      .eq("id", user_ao_id)
      .eq("user_id", user.id);
  }

  return NextResponse.json({ memo });
}
