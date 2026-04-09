import { cache } from "react";
import type { Metadata } from "next";
import { cities } from "@/data/cities";
import { fetchOnDutyPharmacies } from "@/services/pharmacyService";
import HomeView from "@/components/pharmacy/HomeView";
import { notFound } from "next/navigation";
import type { Pharmacy } from "@/types/pharmacy";
import { generateCanonicalUrl } from "@/utils/seoHelpers";
import { PharmacySchema } from "@/components/seo/PharmacySchema";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FaqJsonLd, buildCityFaqs } from "@/components/seo/FaqJsonLd";
import { DistrictLinksGrid } from "@/components/seo/DistrictLinksGrid";
import SeoFooterMessage from "@/components/seo/SeoFooterMessage";
import type { City } from "@/types/pharmacy";

interface CityPageProps {
    params: Promise<{ city: string }>;
}

export const revalidate = 43200;

const LARGE_CITY_SLUGS = new Set(["istanbul", "ankara", "izmir"]);

// React.cache: generateMetadata + page aynı veriyi paylaşır, tek API çağrısı
const getPharmacies = cache(async (citySlug: string): Promise<Pharmacy[]> => {
    try {
        const maxPages = LARGE_CITY_SLUGS.has(citySlug) ? 1 : undefined;
        return await fetchOnDutyPharmacies(citySlug, undefined, undefined, maxPages);
    } catch {
        return [];
    }
});

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
    const { city: cityParam } = await params;
    const city = cities.find((c) => c.slug === cityParam);
    if (!city) return { title: "Nöbetçi Eczane Bulunamadı" };

    const canonicalUrl = generateCanonicalUrl(`${city.slug}/nobetci`);

    // Büyük şehirlerde sayı göstermiyoruz (sadece 1. sayfa çekildi, toplam yanıltıcı olur)
    let description: string;
    if (LARGE_CITY_SLUGS.has(city.slug)) {
        description = `Bugün ${city.name}'da nöbetçi eczaneler. İlçe seçerek size en yakın açık eczaneyi harita üzerinde bulun, yol tarifi alın.`;
    } else {
        const pharmacies = await getPharmacies(city.slug);
        const count = pharmacies.length;
        description = count > 0
            ? `${city.name}'da bugün ${count} nöbetçi eczane var. Harita üzerinde konumlar, adres, telefon ve yol tarifi.`
            : `Bugün ${city.name} ilindeki nöbetçi eczaneler. Harita konumları, adres, telefon ve yol tarifi.`;
    }

    return {
        title: `${city.name} Nöbetçi Eczaneleri — Bugün Açık Eczaneler | Nöbetçi Eczane`,
        description,
        keywords: [
            `nöbetçi eczane ${city.name.toLowerCase()}`,
            `${city.name.toLowerCase()} eczane`,
            `bugün açık eczane ${city.name.toLowerCase()}`,
        ],
        alternates: { canonical: canonicalUrl },
        openGraph: {
            title: `${city.name} Nöbetçi Eczaneleri - Haritalı Liste`,
            description,
            url: canonicalUrl,
            type: "website",
            locale: "tr_TR",
            siteName: "Nöbetçi Eczane",
        },
        twitter: { card: "summary_large_image" },
    };
}

export async function generateStaticParams() {
    return cities.map((city) => ({ city: city.slug }));
}

export default async function CityPage({ params }: CityPageProps) {
    const { city: citySlug } = await params;
    const city = cities.find((c) => c.slug === citySlug);
    if (!city) notFound();

    const seoPharmacies = await getPharmacies(citySlug);
    const initialPharmacies = LARGE_CITY_SLUGS.has(citySlug) ? [] : seoPharmacies;

    const cityData = cities.find((c) => c.slug === citySlug) as City;

    return (
        <>
            <PharmacySchema pharmacies={seoPharmacies} cityName={city.name} />
            <BreadcrumbJsonLd items={[{ name: `${city.name} Nöbetçi Eczaneleri`, path: `/${citySlug}/nobetci` }]} />
            <FaqJsonLd items={buildCityFaqs(city.name, seoPharmacies.length)} />
            <HomeView
                initialPharmacies={initialPharmacies}
                initialCitySlug={citySlug}
                initialCityName={city.name}
            />
            <SeoFooterMessage
                cityName={city.name}
                selectedCitySlug={citySlug}
                pharmacyCount={seoPharmacies.length}
            />
            <DistrictLinksGrid
                citySlug={citySlug}
                cityName={city.name}
                districts={cityData.districts}
            />
        </>
    );
}
