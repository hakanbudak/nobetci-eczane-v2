import type { Metadata } from "next";
import { cities } from "@/data/cities";
import { fetchOnDutyPharmacies } from "@/services/pharmacyService";
import HomeView from "@/components/pharmacy/HomeView";
import { notFound } from "next/navigation";
import type { Pharmacy } from "@/types/pharmacy";

interface CityPageProps {
    params: Promise<{ city: string }>;
}

import { citySlug, generateCanonicalUrl } from "@/utils/seoHelpers";

export const revalidate = 43200; // 12 saatte bir sayfa statik olarak güncellenecek (ISR)

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
    const { city: cityParam } = await params;
    const city = cities.find((c) => c.slug === cityParam);

    if (!city) return { title: "Nöbetçi Eczane Bulunamadı" };

    const canonicalUrl = generateCanonicalUrl(`${city.slug}/nobetci`);

    return {
        title: `${city.name} Nöbetçi Eczaneleri — Bugün Açık Eczaneler | Nöbetçi Eczane`,
        description: `Bugün ${city.name} ilindeki tüm nöbetçi eczaneler. ${city.name} nöbetçi eczane listesi, harita konumları, yol tarifi ve telefon numaraları.`,
        keywords: [`nöbetçi eczane ${city.name.toLowerCase()}`, `${city.name.toLowerCase()} eczane`, `bugün açık eczane ${city.name.toLowerCase()}`],
        alternates: { canonical: canonicalUrl },
        openGraph: {
            title: `${city.name} Nöbetçi Eczaneleri - Haritalı Liste`,
            description: `${city.name} ilindeki güncel nöbetçi eczaneleri harita üzerinde bulun, nöbet çizelgelerine anında ulaşın.`,
            url: canonicalUrl,
            type: "website",
            locale: "tr_TR",
            siteName: "Nöbetçi Eczane"
        },
        twitter: { card: "summary_large_image" },
    };
}

export async function generateStaticParams() {
    return cities.map((city) => ({ city: city.slug }));
}

import { PharmacySchema } from "@/components/seo/PharmacySchema";
import LocationDetector from "@/components/common/LocationDetector";

export default async function CityPage({ params }: CityPageProps) {
    const { city: citySlug } = await params;
    const city = cities.find((c) => c.slug === citySlug);
    if (!city) notFound();

    let pharmacies: Pharmacy[];
    try {
        pharmacies = await fetchOnDutyPharmacies(citySlug);
    } catch {
        pharmacies = [];
    }

    return (
        <>
            <PharmacySchema pharmacies={pharmacies} cityName={city.name} />
            <HomeView
                initialPharmacies={pharmacies}
                initialCitySlug={citySlug}
                initialCityName={city.name}
            />
            <LocationDetector />
        </>
    );
}
