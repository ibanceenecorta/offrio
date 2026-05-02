import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("plan, subscription_status")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Sidebar userEmail={user.email} plan={profile?.plan} />
      <main
        className="min-h-screen md:ml-[224px] ml-0 pt-[72px] md:pt-8 pb-[80px] md:pb-8 px-4 md:px-8"
      >
        {children}
      </main>
    </div>
  );
}
