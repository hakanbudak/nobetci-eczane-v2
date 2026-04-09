import type { Metadata } from "next";
import HomeView from "@/components/pharmacy/HomeView";
import { PharmacySchema } from "@/components/seo/PharmacySchema";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import SeoFooterMessage from "@/components/seo/SeoFooterMessage";
import { CityLinksGrid } from "@/components/seo/CityLinksGrid";
import { WebsiteSchema } from "@/components/seo/WebsiteSchema";
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
  return (
    <>
      <WebsiteSchema />
      <PharmacySchema pharmacies={[]} cityName="Türkiye" />
      <BreadcrumbJsonLd items={[]} />
      <HomeView initialPharmacies={[]} initialCitySlug="" initialCityName="" />
      <SeoFooterMessage />
      <CityLinksGrid />
    </>
  );
}
