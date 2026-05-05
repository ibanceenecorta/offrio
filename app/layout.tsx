import type { Metadata } from "next";
import { Syne, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "OFFRIO — Veille automatisée d'appels d'offres",
  description:
    "OFFRIO détecte, analyse et résume automatiquement les appels d'offres publics adaptés à votre métier. Chaque matin dans votre boîte mail.",
  keywords: "appels d'offres, veille automatisée, BOAMP, artisans, PME, France",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${syne.variable} ${instrumentSans.variable}`}>
      <body className="antialiased min-h-screen">
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "#18181B",
              border: "1px solid rgba(99,102,241,0.2)",
              color: "#FAFAFA",
              fontFamily: "var(--font-instrument)",
            },
          }}
        />
      </body>
    </html>
  );
}
