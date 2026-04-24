"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/dashboard/parametres`,
    });
    setLoading(false);
    if (error) { toast.error("Erreur lors de l'envoi. Vérifiez l'email saisi."); return; }
    setSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: "var(--bg)" }}>
      <Link href="/" className="font-heading text-2xl mb-8" style={{ color: "#F1F5F9", letterSpacing: "0.18em" }}>
        OFFRIO
      </Link>

      <div className="w-full max-w-sm">
        <div className="glass grad-border p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">✉️</div>
              <h2 className="font-heading text-2xl mb-2" style={{ color: "#F1F5F9" }}>Email envoyé !</h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-2)" }}>
                Vérifiez votre boîte mail pour réinitialiser votre mot de passe.
              </p>
              <Link href="/login" className="btn-secondary" style={{ justifyContent: "center" }}>
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-heading text-2xl mb-1" style={{ color: "#F1F5F9", letterSpacing: "0.04em" }}>
                MOT DE PASSE OUBLIÉ
              </h1>
              <p className="text-sm mb-6" style={{ color: "var(--text-2)" }}>
                Entrez votre email pour recevoir un lien de réinitialisation.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
                    Adresse email
                  </label>
                  <input
                    type="email"
                    className="field"
                    placeholder="vous@exemple.fr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                  style={{ padding: "12px", opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? "Envoi..." : "Envoyer le lien"}
                </button>
              </form>
              <div className="mt-5">
                <Link href="/login" className="text-xs flex items-center gap-1.5" style={{ color: "var(--text-3)" }}>
                  ← Retour à la connexion
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
