import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/common/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nöbetçi Eczane — Bugün Nöbetçi Eczaneler",
  description:
    "Türkiye genelinde bugün nöbetçi eczaneleri harita üzerinde bulun, yol tarifi alın. 81 il, tüm ilçeler.",
  openGraph: {
    title: "Nöbetçi Eczane",
    description: "Türkiye genelinde bugün nöbetçi eczaneleri harita üzerinde bulun.",
    type: "website",
  },
  twitter: { card: "summary" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link rel="canonical" href="https://nobetcieczane.com" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
