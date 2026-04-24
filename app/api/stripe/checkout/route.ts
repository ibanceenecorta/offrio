import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// N8N / Frontend usage:
// POST /api/stripe/checkout
// Body (JSON or form): { plan: "starter" | "pro" | "scale" }
// Returns redirect to Stripe Checkout

const PLAN_PRICES: Record<string, string | undefined> = {
  starter: process.env.STRIPE_PRICE_STARTER,
  pro: process.env.STRIPE_PRICE_PRO,
  scale: process.env.STRIPE_PRICE_SCALE,
};

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.redirect(
      new URL("/dashboard/abonnement?error=stripe_not_configured", request.url)
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", request.url));

  // Accept both JSON and form data
  const contentType = request.headers.get("content-type") || "";
  let plan = "";
  if (contentType.includes("application/json")) {
    const body = await request.json();
    plan = body.plan;
  } else {
    const formData = await request.formData();
    plan = formData.get("plan") as string;
  }

  const priceId = PLAN_PRICES[plan];
  if (!priceId) {
    return NextResponse.redirect(
      new URL("/dashboard/abonnement?error=invalid_plan", request.url)
    );
  }

  const Stripe = (await import("stripe")).default;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-01-27.acacia" as any });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: { trial_period_days: 14 },
    success_url: `${appUrl}/dashboard?success=true`,
    cancel_url: `${appUrl}/dashboard/abonnement`,
    customer_email: user.email,
    metadata: { user_id: user.id, plan },
  });

  return NextResponse.redirect(session.url!);
}
