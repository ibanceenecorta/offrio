import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 400 });
  }

  const Stripe = (await import("stripe")).default;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-01-27.acacia" as any });

  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event: import("stripe").Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as import("stripe").Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    const plan = session.metadata?.plan;
    if (userId) {
      const trialEnd = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
      await supabase.from("users").update({
        subscription_status: "trialing",
        plan,
        stripe_customer_id: session.customer as string,
        trial_ends_at: trialEnd,
        onboarding_complete: true,
      }).eq("id", userId);
    }
  }

  if (event.type === "customer.subscription.updated") {
    const sub = event.data.object as import("stripe").Stripe.Subscription;
    const { data: user } = await supabase.from("users").select("id").eq("stripe_customer_id", sub.customer as string).single();
    if (user) {
      const stripeToLocal: Record<string, string> = { active: "active", trialing: "trialing", canceled: "canceled", past_due: "past_due" };
      await supabase.from("users").update({ subscription_status: stripeToLocal[sub.status] ?? "canceled" }).eq("id", user.id);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as import("stripe").Stripe.Subscription;
    const { data: user } = await supabase.from("users").select("id").eq("stripe_customer_id", sub.customer as string).single();
    if (user) await supabase.from("users").update({ subscription_status: "canceled" }).eq("id", user.id);
  }

  return NextResponse.json({ received: true });
}
