"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type FormData = {
  prenom: string;
  nom: string;
  email: string;
  password: string;
  secteur: string;
};

const planLabels: Record<string, string> = {
  starter: "Starter — 79€/mois",
  pro: "Pro — 119€/mois",
  scale: "Scale — 199€/mois",
};

function RegisterForm() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "";
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
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            prenom: data.prenom,
            nom: data.nom,
            secteur_principal: data.secteur,
            plan: plan || "starter",
          },
        },
      });

      if (error) {
        toast.error(
          error.message.includes("already registered") || error.message.includes("already been registered")
            ? "Un compte existe déjà avec cet email."
            : error.message.includes("rate limit")
            ? "Trop de tentatives. Attendez quelques minutes."
            : "Erreur lors de l'inscription. Veuillez réessayer."
        );
        return;
      }

      toast.success("Compte créé ! Redirection...");
      setTimeout(() => { window.location.href = "/onboarding"; }, 800);
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
      {/* Logo */}
      <Link href="/" className="font-heading text-2xl mb-8" style={{ color: "#F1F5F9", letterSpacing: "0.18em" }}>
        OFFRIO
      </Link>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#F1F5F9" }}>
            Créer un compte
          </h1>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>
            14 jours gratuits, sans carte bancaire.
          </p>
          {plan && planLabels[plan] && (
            <div className="mt-3 inline-block">
              <span className="badge badge-blue text-xs px-3 py-1">
                Plan sélectionné : {planLabels[plan]}
              </span>
            </div>
          )}
        </div>

        {/* Card */}
        <div className="glass grad-border p-8">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
                  Prénom
                </label>
                <input
                  className={`field${errors.prenom ? " field-error" : ""}`}
                  placeholder="Jean"
                  {...register("prenom", { required: "Prénom requis", minLength: { value: 2, message: "Min. 2 caractères" } })}
                />
                {errors.prenom && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.prenom.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
                  Nom
                </label>
                <input
                  className={`field${errors.nom ? " field-error" : ""}`}
                  placeholder="Martin"
                  {...register("nom", { required: "Nom requis", minLength: { value: 2, message: "Min. 2 caractères" } })}
                />
                {errors.nom && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.nom.message}</p>}
              </div>
            </div>

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

            <div className="mb-4">
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`field${errors.password ? " field-error" : ""}`}
                  placeholder="Minimum 8 caractères"
                  style={{ paddingRight: "44px" }}
                  {...register("password", {
                    required: "Mot de passe requis",
                    minLength: { value: 8, message: "Minimum 8 caractères" },
                  })}
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

            <div className="mb-6">
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
                Secteur d&apos;activité
              </label>
              <select
                className={`field${errors.secteur ? " field-error" : ""}`}
                {...register("secteur", { required: "Secteur requis" })}
              >
                <option value="">Choisir un secteur</option>
                <option value="chaudronnerie">Chaudronnerie</option>
                <option value="soudure">Soudure</option>
                <option value="tuyauterie">Tuyauterie</option>
                <option value="plomberie">Plomberie</option>
                <option value="electricite">Électricité</option>
                <option value="menuiserie">Menuiserie</option>
                <option value="maconnerie">Maçonnerie</option>
                <option value="peinture">Peinture</option>
                <option value="autre">Autre</option>
              </select>
              {errors.secteur && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{errors.secteur.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
              style={{ padding: "12px", fontSize: "15px", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Création en cours..." : "Créer mon compte — 14 jours gratuits"}
            </button>
          </form>

          <p className="text-center text-xs mt-5" style={{ color: "var(--text-3)" }}>
            En créant un compte, vous acceptez nos{" "}
            <Link href="/cgv" style={{ color: "var(--text-2)" }}>CGV</Link>{" "}
            et notre{" "}
            <Link href="/confidentialite" style={{ color: "var(--text-2)" }}>politique de confidentialité</Link>.
          </p>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: "var(--text-2)" }}>
          Déjà un compte ?{" "}
          <Link href="/login" style={{ color: "#93C5FD", fontWeight: 600 }}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
