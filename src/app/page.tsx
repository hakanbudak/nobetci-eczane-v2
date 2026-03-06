import type { Metadata } from "next";
import HomeView from "@/components/pharmacy/HomeView";
import LocationDetector from "@/components/common/LocationDetector";
import { fetchOnDutyPharmacies } from "@/services/pharmacyService";
import { PharmacySchema } from "@/components/seo/PharmacySchema";
import { generateCanonicalUrl } from "@/utils/seoHelpers";

export const revalidate = 43200;

export const metadata: Metadata = {
  title: "Nöbetçi Eczane Haritası — En Yakın Nöbetçi Eczaneler",
  description: "Türkiye'nin her yerinden en güncel nöbetçi eczane listesi. Harita üzerinden nöbetçi eczaneleri bulun, yol tarifi alın ve iletişim bilgilerine anında erişin.",
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
  let pharmacies: any[] = [];
  try {
    pharmacies = await fetchOnDutyPharmacies("istanbul");
  } catch (e) {
    pharmacies = [];
  }

  return (
    <>
      <PharmacySchema pharmacies={pharmacies} cityName="İstanbul" />
      <HomeView initialPharmacies={pharmacies} initialCitySlug="istanbul" initialCityName="İstanbul" />
      <LocationDetector />
    </>
  );
}
