import { cache } from "react";
import type { Metadata } from "next";
import { cities } from "@/data/cities";
import { fetchOnDutyPharmacies } from "@/services/pharmacyService";
import HomeView from "@/components/pharmacy/HomeView";
import { notFound } from "next/navigation";
import type { City, Pharmacy } from "@/types/pharmacy";
import { generateCanonicalUrl } from "@/utils/seoHelpers";
import { PharmacySchema } from "@/components/seo/PharmacySchema";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FaqJsonLd, buildDistrictFaqs } from "@/components/seo/FaqJsonLd";
import { DistrictLinksGrid } from "@/components/seo/DistrictLinksGrid";
import SeoFooterMessage from "@/components/seo/SeoFooterMessage";

interface DistrictPageProps {
    params: Promise<{ city: string; district: string }>;
}

export const revalidate = 43200;

// React.cache: aynı istek içinde generateMetadata + page aynı veriyi paylaşır, tek API çağrısı
const getPharmacies = cache(async (citySlug: string, districtSlug: string): Promise<Pharmacy[]> => {
    try {
        return await fetchOnDutyPharmacies(citySlug, districtSlug);
    } catch {
        return [];
    }
});

export async function generateMetadata({ params }: DistrictPageProps): Promise<Metadata> {
    const { city: cityParam, district: districtParam } = await params;
    const city = cities.find((c) => c.slug === cityParam) as City | undefined;
    if (!city) return { title: "Nöbetçi Eczane Bulunamadı" };

    const district = city.districts.find((d) => d.slug === districtParam);
    if (!district) return { title: "Nöbetçi Eczane Bulunamadı" };

    const pharmacies = await getPharmacies(city.slug, district.slug);
    const count = pharmacies.length;
    const canonicalUrl = generateCanonicalUrl(`${city.slug}/${district.slug}/nobetci`);

    const description = count > 0
        ? `${city.name} ${district.name}'da bugün ${count} nöbetçi eczane var. Harita üzerinde konumlar, adres, telefon ve yol tarifi.`
        : `Bugün ${city.name} ${district.name} ilçesindeki nöbetçi eczaneler. Harita konumları, adres ve telefon numaraları.`;

    return {
        title: `${district.name} Nöbetçi Eczaneleri — ${city.name} Bugün Açık Eczaneler | Nöbetçi Eczane`,
        description,
        keywords: [
            `nöbetçi eczane ${district.name.toLowerCase()}`,
            `${district.name.toLowerCase()} nöbetçi eczane ${city.name.toLowerCase()}`,
            `bugün açık eczane ${district.name.toLowerCase()}`,
        ],
        alternates: { canonical: canonicalUrl },
        openGraph: {
            title: `${district.name} Nöbetçi Eczaneleri - Haritalı Liste`,
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
    const params: Array<{ city: string; district: string }> = [];
    for (const city of cities) {
        for (const district of (city as City).districts) {
            params.push({ city: city.slug, district: district.slug });
        }
    }
    return params;
}

export default async function DistrictPage({ params }: DistrictPageProps) {
    const { city: citySlug, district: districtSlug } = await params;
    const city = cities.find((c) => c.slug === citySlug) as City | undefined;
    if (!city) notFound();
    const district = city.districts.find((d) => d.slug === districtSlug);
    if (!district) notFound();

    const pharmacies = await getPharmacies(citySlug, districtSlug);

    return (
        <>
            <PharmacySchema pharmacies={pharmacies} cityName={city.name} districtName={district.name} />
            <BreadcrumbJsonLd items={[
                { name: `${city.name} Nöbetçi Eczaneleri`, path: `/${citySlug}/nobetci` },
                { name: `${district.name} Nöbetçi Eczaneleri`, path: `/${citySlug}/${districtSlug}/nobetci` },
            ]} />
            <HomeView
                initialPharmacies={pharmacies}
                initialCitySlug={citySlug}
                initialCityName={city.name}
                initialDistrictSlug={districtSlug}
                initialDistrictName={district.name}
            />
            <SeoFooterMessage
                cityName={city.name}
                districtName={district.name}
                selectedCitySlug={citySlug}
                selectedDistrictSlug={districtSlug}
                pharmacyCount={pharmacies.length}
            />
            <DistrictLinksGrid
                citySlug={citySlug}
                cityName={city.name}
                districts={city.districts}
                currentDistrictSlug={districtSlug}
            />
            <FaqJsonLd items={buildDistrictFaqs(city.name, district.name, pharmacies.length)} />
        </>
    );
}
