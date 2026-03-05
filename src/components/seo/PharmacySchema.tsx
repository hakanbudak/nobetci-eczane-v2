import type { Pharmacy } from "@/types/pharmacy";

interface PharmacySchemaProps {
    pharmacies: Pharmacy[];
    cityName: string;
    districtName?: string;
}

export function PharmacySchema({ pharmacies, cityName, districtName }: PharmacySchemaProps) {
    if (!pharmacies || pharmacies.length === 0) return null;

    const locationName = districtName ? `${cityName} ${districtName}` : cityName;

    const schema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": `${locationName} Nöbetçi Eczaneleri`,
        "description": `Bugün ${locationName} bölgesinde nöbetçi olan eczanelerin güncel listesi.`,
        "numberOfItems": pharmacies.length,
        "itemListElement": pharmacies.map((pharmacy, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Pharmacy",
                "name": pharmacy.name,
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": pharmacy.address,
                    "addressLocality": pharmacy.district || districtName || cityName,
                    "addressRegion": cityName,
                    "addressCountry": "TR"
                },
                "telephone": pharmacy.phone || "",
                "openingHours": "Mo-Su 00:00-23:59", // Nöbetçi eczaneler 24 saat açıktır
                ...(pharmacy.location.lat && pharmacy.location.lng ? {
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": pharmacy.location.lat,
                        "longitude": pharmacy.location.lng
                    }
                } : {})
            }
        }))
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
