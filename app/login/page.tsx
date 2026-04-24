"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error(
          error.message.includes("Invalid login") || error.message.includes("invalid")
            ? "Email ou mot de passe incorrect."
            : "Erreur de connexion. Veuillez réessayer."
        );
        return;
      }

      toast.success("Connexion réussie !");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Une erreur inattendue s'est produite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "var(--bg)" }}
    >
      <Link href="/" className="font-heading text-2xl mb-8" style={{ color: "#F1F5F9", letterSpacing: "0.18em" }}>
        OFFRIO
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#F1F5F9" }}>
            Connexion
          </h1>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>
            Accédez à votre espace OFFRIO.
          </p>
        </div>

        <div className="glass grad-border p-8">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
                Adresse email
              </label>
              <input
                type="email"
                className={`field${errors.email ? " field-error" : ""}`}
                placeholder="vous@exemple.fr"
                {...register("email", {
                  required: "Email requis",
                  pattern: { value: /^\S+@\S+\.\S+$/, message: "Email invalide" },
                })}
              />
              {errors.email && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.email.message}</p>}
            </div>

            <div className="mb-2">
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`field${errors.password ? " field-error" : ""}`}
                  placeholder="Votre mot de passe"
                  style={{ paddingRight: "44px" }}
                  {...register("password", { required: "Mot de passe requis" })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: "4px" }}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.password.message}</p>}
            </div>

            <div className="flex justify-end mb-6">
              <Link href="/mot-de-passe-oublie" className="text-xs" style={{ color: "var(--text-2)" }}>
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
              style={{ padding: "12px", fontSize: "15px", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: "var(--text-2)" }}>
          Pas encore de compte ?{" "}
          <Link href="/register" style={{ color: "#93C5FD", fontWeight: 600 }}>
            Essai gratuit 14 jours
          </Link>
        </p>
      </div>
    </div>
  );
}
