import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Page() {
  const titles: Record<string,string> = { cgv: "Conditions Générales de Vente", confidentialite: "Politique de confidentialité", "mentions-legales": "Mentions légales" };
  const title = titles["cgv"] ?? "cgv";
  return (
    <div className="min-h-screen bg-[#0A0F1E] px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-[#64748B] hover:text-[#F5F0E8] text-sm mb-8 transition-colors">
          <ArrowLeft size={14} />Retour à l&apos;accueil
        </Link>
        <h1 className="font-heading text-4xl text-[#F5F0E8] mb-6">{title}</h1>
        <div className="rounded-xl border p-8 space-y-4 text-[#64748B] text-sm leading-relaxed" style={{ background: "rgba(17,24,39,0.7)", borderColor: "rgba(37,99,235,0.1)" }}>
          <p>Ce document est en cours de rédaction. Veuillez nous contacter à <a href="mailto:contact@offrio.fr" className="text-[#2563EB] hover:underline">contact@offrio.fr</a> pour toute question.</p>
          <p>OFFRIO — SAS au capital de 1 000 €<br/>Siège social : Paris, France<br/>SIRET : en cours d&apos;immatriculation</p>
        </div>
      </div>
    </div>
  );
}
