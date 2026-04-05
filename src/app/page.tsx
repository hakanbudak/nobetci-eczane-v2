import type { Metadata } from "next";
import HomeView from "@/components/pharmacy/HomeView";
import { PharmacySchema } from "@/components/seo/PharmacySchema";
import { generateCanonicalUrl } from "@/utils/seoHelpers";

export const revalidate = 43200;

export const metadata: Metadata = {
  title: "Nöbetçi Eczane Haritası — En Yakın Nöbetçi Eczaneler",
  description: "Türkiye'nin her yerinden güncel nöbetçi eczane listesi. Harita üzerinden nöbetçi eczaneleri bulun ve yol tarifi alın.",
  keywords: ["nöbetçi eczane", "en yakın nöbetçi eczane", "nöbetçi eczane haritası", "gece açık eczane", "nöbetçi eczaneler"],
  alternates: {
    canonical: generateCanonicalUrl("/"),
  },
  openGraph: {
    title: "Nöbetçi Eczane Haritası — En Yakın Nöbetçi Eczaneler",
    description: "Türkiye'nin her yerinden en güncel nöbetçi eczane listesi. Harita üzerinden nöbetçi eczaneleri bulun.",
    url: generateCanonicalUrl("/"),
    type: "website",
    siteName: "Nöbetçi Eczane"
  }
};

export default async function HomePage() {
  const pharmacies: any[] = [];

  return (
    <>
      <PharmacySchema pharmacies={pharmacies} cityName="İstanbul" />
      <HomeView initialPharmacies={pharmacies} initialCitySlug="istanbul" initialCityName="İstanbul" />
    </>
  );
}
