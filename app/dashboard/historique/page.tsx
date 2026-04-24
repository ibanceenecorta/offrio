"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

type AO = {
  id: string;
  titre: string;
  secteur: string;
  score_ia: number;
  date_limite: string;
};

type UserAO = {
  id: string;
  ao_id: string;
  statut: string;
  ao: AO;
  created_at: string;
};

export default function HistoriquePage() {
  const [rows, setRows] = useState<UserAO[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("user_aos")
      .select("*, ao:appels_offres(*)")
      .eq("user_id", user.id)
      .eq("statut", "ignore")
      .order("created_at", { ascending: false });

    setRows((data as UserAO[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const restaurer = async (userAoId: string) => {
    const supabase = createClient();
    await supabase.from("user_aos").update({ statut: "nouveau" }).eq("id", userAoId);
    setRows((prev) => prev.filter((r) => r.id !== userAoId));
    toast.success("AO restauré dans Mes AOs.");
  };

  const effacerTout = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("user_aos").delete().eq("user_id", user.id).eq("statut", "ignore");
    setRows([]);
    toast.success("Historique effacé.");
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="font-heading text-3xl mb-1" style={{ color: "#F1F5F9", letterSpacing: "0.04em" }}>
            HISTORIQUE
          </h1>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>
            AOs que vous avez ignorés. Vous pouvez les restaurer à tout moment.
          </p>
        </div>
        {rows.length > 0 && (
          <button
            onClick={effacerTout}
            className="btn-secondary flex-shrink-0"
            style={{ borderColor: "rgba(239,68,68,0.3)", color: "#F87171" }}
          >
            Effacer tout
          </button>
        )}
      </div>

      <div className="glass grad-border overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-12" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3">🗂</div>
            <p className="font-semibold mb-1" style={{ color: "#F1F5F9" }}>Aucun AO ignoré</p>
            <p className="text-sm" style={{ color: "var(--text-2)" }}>
              Les AOs que vous ignorez apparaîtront ici.
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const ao = row.ao;
                  return (
                    <tr key={row.id}>
                      <td>
                        <span className="text-sm font-medium" style={{ color: "var(--text-2)" }}>
                          {ao?.titre?.length > 60 ? ao.titre.slice(0, 60) + "…" : ao?.titre}
                        </span>
                      </td>
                      <td><span className="badge badge-gray">{ao?.secteur}</span></td>
                      <td>
                        {ao?.score_ia != null ? (
                          <span className={ao.score_ia >= 80 ? "score-high" : ao.score_ia >= 60 ? "score-medium" : "score-low"}>
                            {ao.score_ia}/100
                          </span>
                        ) : "—"}
                      </td>
                      <td>
                        <span className="text-sm" style={{ color: "var(--text-2)" }}>
                          {ao?.date_limite ? new Date(ao.date_limite).toLocaleDateString("fr-FR") : "—"}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => restaurer(row.id)}
                          className="btn-secondary"
                          style={{ padding: "5px 14px", fontSize: "13px" }}
                        >
                          Restaurer
                        </button>
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
