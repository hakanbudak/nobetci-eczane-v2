import type { Metadata } from "next";
import { cities } from "@/data/cities";
import { fetchOnDutyPharmacies } from "@/services/pharmacyService";
import HomeView from "@/components/pharmacy/HomeView";
import { notFound } from "next/navigation";
import type { City, Pharmacy } from "@/types/pharmacy";

interface DistrictPageProps {
    params: Promise<{ city: string; district: string }>;
}

export async function generateMetadata({ params }: DistrictPageProps): Promise<Metadata> {
    const { city: citySlug, district: districtSlug } = await params;
    const city = cities.find((c) => c.slug === citySlug) as City | undefined;
    if (!city) return {};
    const district = city.districts.find((d) => d.slug === districtSlug);
    if (!district) return {};

    return {
        title: `${district.name} (${city.name}) Nöbetçi Eczane — Bugün | Nöbetçi Eczane`,
        description: `${city.name} ${district.name} ilçesinde bugün nöbetçi eczaneler. ${district.name} nöbetçi eczane listesini harita üzerinde görün.`,
        openGraph: {
            title: `${district.name} Nöbetçi Eczane — ${city.name}`,
            description: `${district.name} nöbetçi eczanelerini harita üzerinde bulun.`,
            type: "website",
        },
        twitter: { card: "summary" },
        alternates: { canonical: `https://nobetcieczane.com/${citySlug}/${districtSlug}/nobetci` },
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

    let pharmacies: Pharmacy[];
    try {
        pharmacies = await fetchOnDutyPharmacies(citySlug, districtSlug);
    } catch {
        pharmacies = [];
    }

    return (
        <HomeView
            initialPharmacies={pharmacies}
            initialCitySlug={citySlug}
            initialCityName={city.name}
            initialDistrictSlug={districtSlug}
            initialDistrictName={district.name}
        />
    );
}
