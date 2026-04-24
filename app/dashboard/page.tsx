import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user!.id)
    .single();

  const { data: userAos } = await supabase
    .from("user_aos")
    .select("*, ao:appels_offres(*)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const { count: totalAos } = await supabase
    .from("user_aos")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id);

  const { count: nouveauxAos } = await supabase
    .from("user_aos")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id)
    .eq("statut", "nouveau");

  const { count: interessants } = await supabase
    .from("user_aos")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id)
    .eq("statut", "interessant");

  const { data: avgScore } = await supabase
    .from("user_aos")
    .select("ao:appels_offres(score_ia)")
    .eq("user_id", user!.id);

  const scoreValues = (avgScore || [])
    .map((r: Record<string, unknown>) => {
      const ao = r.ao as { score_ia?: number } | null;
      return ao?.score_ia;
    })
    .filter((v): v is number => typeof v === "number");
  const avgScoreValue =
    scoreValues.length > 0
      ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)
      : 0;

  const trialEnd = profile?.trial_ends_at ? new Date(profile.trial_ends_at) : null;
  const daysLeft = trialEnd
    ? Math.max(0, Math.ceil((trialEnd.getTime() - Date.now()) / 86400000))
    : null;

  const stats = [
    { label: "AOs cette semaine", value: totalAos ?? 0, color: "#60A5FA" },
    { label: "Nouveaux", value: nouveauxAos ?? 0, color: "#22C55E" },
    { label: "Intéressants", value: interessants ?? 0, color: "#F59E0B" },
    { label: "Score IA moyen", value: avgScoreValue ? `${avgScoreValue}/100` : "—", color: "#A78BFA" },
  ];

  const scoreClass = (score: number) =>
    score >= 80 ? "score-high" : score >= 60 ? "score-medium" : "score-low";

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl mb-1" style={{ color: "#F1F5F9", letterSpacing: "0.04em" }}>
          TABLEAU DE BORD
        </h1>
        <p className="text-sm" style={{ color: "var(--text-2)" }}>
          Bonjour {profile?.prenom || ""}. Voici un résumé de votre activité.
        </p>
      </div>

      {/* Trial banner */}
      {profile?.subscription_status === "trialing" && daysLeft !== null && daysLeft <= 14 && (
        <div
          className="mb-6 p-4 rounded-xl flex items-center justify-between gap-4"
          style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)" }}
        >
          <div className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span className="text-sm font-medium" style={{ color: "#FCD34D" }}>
              Votre essai gratuit expire dans <strong>{daysLeft} jour{daysLeft > 1 ? "s" : ""}</strong>.
            </span>
          </div>
          <a href="/dashboard/abonnement" className="btn-primary" style={{ padding: "7px 16px", fontSize: "13px" }}>
            Choisir un plan
          </a>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="glass grad-border p-5">
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--text-3)" }}>
              {s.label}
            </p>
            <p className="font-heading text-3xl" style={{ color: s.color, letterSpacing: "0.02em" }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent AOs */}
      <div className="glass grad-border">
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <h2 className="font-semibold text-sm" style={{ color: "#F1F5F9" }}>Derniers appels d&apos;offres</h2>
          <a href="/dashboard/aos" className="text-xs" style={{ color: "#93C5FD" }}>Voir tous →</a>
        </div>

        {!userAos || userAos.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-semibold mb-1" style={{ color: "#F1F5F9" }}>Aucun AO pour le moment</p>
            <p className="text-sm" style={{ color: "var(--text-2)" }}>
              Les AOs correspondant à votre profil apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Secteur</th>
                  <th>Score IA</th>
                  <th>Date limite</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {userAos.map((row: Record<string, unknown>) => {
                  const ao = row.ao as Record<string, unknown> | null;
                  if (!ao) return null;
                  const score = ao.score_ia as number | null;
                  return (
                    <tr key={row.id as string}>
                      <td>
                        <span className="font-medium text-sm" style={{ color: "#F1F5F9" }}>
                          {(ao.titre as string)?.length > 60
                            ? (ao.titre as string).slice(0, 60) + "…"
                            : (ao.titre as string)}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-gray">{ao.secteur as string}</span>
                      </td>
                      <td>
                        {score != null ? (
                          <span className={scoreClass(score)}>{score}/100</span>
                        ) : (
                          <span style={{ color: "var(--text-3)" }}>—</span>
                        )}
                      </td>
                      <td>
                        <span className="text-sm" style={{ color: "var(--text-2)" }}>
                          {ao.date_limite
                            ? new Date(ao.date_limite as string).toLocaleDateString("fr-FR")
                            : "—"}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          row.statut === "nouveau" ? "badge-blue" :
                          row.statut === "interessant" ? "badge-green" :
                          row.statut === "ignore" ? "badge-red" : "badge-gray"
                        }`}>
                          {row.statut as string}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
