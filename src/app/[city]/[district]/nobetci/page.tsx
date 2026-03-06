import type { Metadata } from "next";
import { cities } from "@/data/cities";
import { fetchOnDutyPharmacies } from "@/services/pharmacyService";
import HomeView from "@/components/pharmacy/HomeView";
import { notFound } from "next/navigation";
import type { City, Pharmacy } from "@/types/pharmacy";

interface DistrictPageProps {
    params: Promise<{ city: string; district: string }>;
}

import { citySlug, generateCanonicalUrl } from "@/utils/seoHelpers";

export const revalidate = 43200; // 12 saatte bir sayfa statik olarak güncellenecek (ISR)

export async function generateMetadata({ params }: DistrictPageProps): Promise<Metadata> {
    const { city: cityParam, district: districtParam } = await params;
    const city = cities.find((c) => c.slug === cityParam) as City | undefined;
    if (!city) return { title: "Nöbetçi Eczane Bulunamadı" };

    const district = city.districts.find((d) => d.slug === districtParam);
    if (!district) return { title: "Nöbetçi Eczane Bulunamadı" };

    const canonicalUrl = generateCanonicalUrl(`${city.slug}/${district.slug}/nobetci`);

    return {
        title: `${district.name} Nöbetçi Eczaneleri — ${city.name} Bugün Açık Eczaneler | Nöbetçi Eczane`,
        description: `Bugün ${city.name} ${district.name} ilçesindeki tüm nöbetçi eczaneler. ${district.name} nöbetçi eczane listesi, harita konumları ve telefon numaraları.`,
        keywords: [`nöbetçi eczane ${district.name.toLowerCase()}`, `${district.name.toLowerCase()} nöbetçi eczane ${city.name.toLowerCase()}`, `bugün açık eczane ${district.name.toLowerCase()}`],
        alternates: { canonical: canonicalUrl },
        openGraph: {
            title: `${district.name} Nöbetçi Eczaneleri - Haritalı Liste`,
            description: `${city.name} ${district.name} güncel nöbetçi eczanelerini harita üzerinde bulun, nöbet çizelgelerine anında ulaşın.`,
            url: canonicalUrl,
            type: "website",
            locale: "tr_TR",
            siteName: "Nöbetçi Eczane"
        },
        twitter: { card: "summary_large_image" },
    };
}

export async function generateStaticParams() {
    const params: Array<{ city: string; district: string }> = [];
    for (const city of cities) {
        for (const district of (city as City).districts) {
            params.push({ city: city.slug, district: district.slug });
        }
    }
    return params;
}

import { PharmacySchema } from "@/components/seo/PharmacySchema";
import LocationDetector from "@/components/common/LocationDetector";

export default async function DistrictPage({ params }: DistrictPageProps) {
    const { city: citySlug, district: districtSlug } = await params;
    const city = cities.find((c) => c.slug === citySlug) as City | undefined;
    if (!city) notFound();
    const district = city.districts.find((d) => d.slug === districtSlug);
    if (!district) notFound();

    let pharmacies: Pharmacy[];
    try {
        pharmacies = await fetchOnDutyPharmacies(citySlug, districtSlug);
    } catch {
        pharmacies = [];
    }

    return (
        <>
            <PharmacySchema pharmacies={pharmacies} cityName={city.name} districtName={district.name} />
            <HomeView
                initialPharmacies={pharmacies}
                initialCitySlug={citySlug}
                initialCityName={city.name}
                initialDistrictSlug={districtSlug}
                initialDistrictName={district.name}
            />
        </>
    );
}
