import type { Metadata } from "next";
import { cities } from "@/data/cities";
import { fetchOnDutyPharmacies } from "@/services/pharmacyService";
import HomeView from "@/components/pharmacy/HomeView";
import { notFound } from "next/navigation";
import type { Pharmacy } from "@/types/pharmacy";

interface CityPageProps {
    params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
    const { city: citySlug } = await params;
    const city = cities.find((c) => c.slug === citySlug);
    if (!city) return {};

    return {
        title: `${city.name} Nöbetçi Eczane — Bugün | Nöbetçi Eczane`,
        description: `${city.name} ilinde bugün nöbetçi eczaneler. ${city.name} nöbetçi eczane listesini harita üzerinde görün, yol tarifi alın.`,
        openGraph: {
            title: `${city.name} Nöbetçi Eczane`,
            description: `${city.name} nöbetçi eczanelerini harita üzerinde bulun.`,
            type: "website",
        },
        twitter: { card: "summary" },
        alternates: { canonical: `https://nobetcieczane.com/${citySlug}/nobetci` },
    };
}

export async function generateStaticParams() {
    return cities.map((city) => ({ city: city.slug }));
}

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
        <HomeView
            initialPharmacies={pharmacies}
            initialCitySlug={citySlug}
            initialCityName={city.name}
        />
    );
}
