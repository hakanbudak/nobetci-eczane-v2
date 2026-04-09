import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cities } from "@/data/cities";
import type { City } from "@/types/pharmacy";
import { fetchOnDutyPharmacies } from "@/services/pharmacyService";
import { parsePharmacyId, pharmacySlug, generateCanonicalUrl } from "@/utils/seoHelpers";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import PharmacyDetailView from "@/components/pharmacy/PharmacyDetailView";

interface PharmacyPageProps {
    params: Promise<{ city: string; district: string; pharmacy: string }>;
}

// 1 saatlik ISR — nöbet listesi gün içinde değişmez, ama geceleri döner
export const revalidate = 3600;

// React.cache: generateMetadata + page aynı veriyi paylaşır
const getDistrictPharmacies = cache(async (citySlug: string, districtSlug: string) => {
    try {
        return await fetchOnDutyPharmacies(citySlug, districtSlug);
    } catch {
        return [];
    }
});

export async function generateMetadata({ params }: PharmacyPageProps): Promise<Metadata> {
    const { city: cityParam, district: districtParam, pharmacy: pharmacyParam } = await params;

    const city = cities.find((c) => c.slug === cityParam) as City | undefined;
    if (!city) return { title: "Eczane Bulunamadı" };

    const district = city.districts.find((d) => d.slug === districtParam);
    if (!district) return { title: "Eczane Bulunamadı" };

    const pharmacyId = parsePharmacyId(pharmacyParam);
    if (!pharmacyId) return { title: "Eczane Bulunamadı" };

    const allPharmacies = await getDistrictPharmacies(cityParam, districtParam);
    const pharmacy = allPharmacies.find((p) => p.id === pharmacyId);

    if (!pharmacy) {
        // Nöbetçi değil ama sayfa var — generic metadata
        return {
            title: `${district.name} Eczane | ${city.name} Nöbetçi Eczane`,
            description: `${city.name} ${district.name} bölgesindeki nöbetçi eczaneleri harita üzerinde bulun.`,
        };
    }

    const canonicalUrl = generateCanonicalUrl(`${cityParam}/${districtParam}/${pharmacySlug(pharmacy.name, pharmacy.id!)}`);
    const description = `${pharmacy.name} bugün nöbetçi. Adres: ${pharmacy.address}${pharmacy.phone ? ` | Tel: ${pharmacy.phone}` : ""}. Harita ve yol tarifi için tıklayın.`;

    return {
        title: `${pharmacy.name} — ${district.name} Nöbetçi Eczane | Bugün Açık`,
        description,
        keywords: [
            pharmacy.name.toLowerCase(),
            `${pharmacy.name.toLowerCase()} ${district.name.toLowerCase()}`,
            `${district.name.toLowerCase()} nöbetçi eczane`,
            `${city.name.toLowerCase()} ${district.name.toLowerCase()} eczane`,
        ],
        alternates: { canonical: canonicalUrl },
        openGraph: {
            title: `${pharmacy.name} — ${district.name} Nöbetçi Eczane`,
            description,
            url: canonicalUrl,
            type: "website",
            locale: "tr_TR",
            siteName: "Nöbetçi Eczane",
        },
        twitter: { card: "summary_large_image" },
    };
}

export default async function PharmacyPage({ params }: PharmacyPageProps) {
    const { city: cityParam, district: districtParam, pharmacy: pharmacyParam } = await params;

    const city = cities.find((c) => c.slug === cityParam) as City | undefined;
    if (!city) notFound();

    const district = city.districts.find((d) => d.slug === districtParam);
    if (!district) notFound();

    const pharmacyId = parsePharmacyId(pharmacyParam);
    if (!pharmacyId) notFound();

    const allPharmacies = await getDistrictPharmacies(cityParam, districtParam);
    const pharmacy = allPharmacies.find((p) => p.id === pharmacyId);

    // Eczane bugün nöbetçi değil — ilçedeki nöbetçileri göster, 404 verme
    const isOnDuty = !!pharmacy;
    const otherPharmacies = allPharmacies.filter((p) => p.id !== pharmacyId);

    // Nöbetçi değilse de bir şeyler göstermek için en az isim lazım
    if (!pharmacy && otherPharmacies.length === 0) notFound();

    const displayPharmacy = pharmacy ?? {
        id: pharmacyId,
        name: pharmacyParam.replace(/-\d+$/, "").replace(/-/g, " "),
        address: `${district.name}, ${city.name}`,
        district: district.name,
        phone: "",
        location: { lat: 0, lng: 0 },
    };

    // MedicalBusiness JSON-LD
    const medicalBusinessSchema = pharmacy ? {
        "@context": "https://schema.org",
        "@type": "MedicalBusiness",
        "name": pharmacy.name,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": pharmacy.address,
            "addressLocality": district.name,
            "addressRegion": city.name,
            "addressCountry": "TR",
        },
        "telephone": pharmacy.phone || undefined,
        "openingHours": "Mo-Su 00:00-23:59",
        ...(pharmacy.location.lat && pharmacy.location.lng ? {
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": pharmacy.location.lat,
                "longitude": pharmacy.location.lng,
            },
        } : {}),
        "url": generateCanonicalUrl(`${cityParam}/${districtParam}/${pharmacySlug(pharmacy.name, pharmacy.id!)}`),
    } : null;

    return (
        <>
            {medicalBusinessSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalBusinessSchema) }}
                />
            )}
            <BreadcrumbJsonLd items={[
                { name: `${city.name} Nöbetçi Eczaneleri`, path: `/${cityParam}/nobetci` },
                { name: `${district.name} Nöbetçi Eczaneleri`, path: `/${cityParam}/${districtParam}/nobetci` },
                { name: displayPharmacy.name, path: `/${cityParam}/${districtParam}/${pharmacyParam}` },
            ]} />
            <PharmacyDetailView
                pharmacy={displayPharmacy}
                isOnDuty={isOnDuty}
                citySlug={cityParam}
                cityName={city.name}
                districtSlug={districtParam}
                districtName={district.name}
                otherPharmacies={otherPharmacies}
            />
        </>
    );
}
