import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border-2)" }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-heading text-xl" style={{ color: "#F1F5F9", letterSpacing: "0.18em" }}>
              OFFRIO
            </span>
            <p className="text-sm mt-1" style={{ color: "var(--text-3)" }}>
              Veille automatisée d&apos;appels d&apos;offres · Alimenté par l&apos;IA
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm" style={{ color: "var(--text-3)" }}>
            <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
            <Link href="/cgv" className="hover:text-white transition-colors">CGV</Link>
            <Link href="/confidentialite" className="hover:text-white transition-colors">Confidentialité</Link>
            <a href="mailto:contact@offrio.fr" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>

        <div className="divider my-8" />

        <p className="text-center text-xs" style={{ color: "var(--text-3)" }}>
          © {new Date().getFullYear()} OFFRIO. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
