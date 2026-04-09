import type { MetadataRoute } from "next";
import { cities } from "@/data/cities";
import type { City } from "@/types/pharmacy";
import { generateCanonicalUrl, pharmacySlug } from "@/utils/seoHelpers";
import { fetchOnDutyPharmacies } from "@/services/pharmacyService";

// Sitemap her saat yenilenir — nöbetçi eczane URL'leri güncel kalır
export const revalidate = 3600;

// Sitemap'e eklenecek iller — çok fazla API çağrısı yapmamak için seçili
const SITEMAP_PHARMACY_CITIES = [
    { citySlug: "ankara", districts: ["cankaya", "kecioren", "mamak", "etimesgut", "sincan"] },
    { citySlug: "izmir", districts: ["konak", "bornova", "karsiyaka", "buca", "cigli"] },
    { citySlug: "bursa", districts: ["nilufer", "osmangazi", "yildirim"] },
    { citySlug: "antalya", districts: ["muratpasa", "kepez", "konyaalti"] },
    { citySlug: "istanbul", districts: ["kadikoy", "besiktas", "sisli", "fatih", "uskudar"] },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const today = new Date().toISOString();

    const result: MetadataRoute.Sitemap = [
        {
            url: generateCanonicalUrl("/"),
            lastModified: today,
            changeFrequency: "daily",
            priority: 1,
        },
    ];

    // İl ve ilçe sayfaları
    for (const city of cities) {
        result.push({
            url: generateCanonicalUrl(`${city.slug}/nobetci`),
            lastModified: today,
            changeFrequency: "daily",
            priority: 0.9,
        });

        for (const district of (city as City).districts) {
            result.push({
                url: generateCanonicalUrl(`${city.slug}/${district.slug}/nobetci`),
                lastModified: today,
                changeFrequency: "daily",
                priority: 0.8,
            });
        }
    }

    // Eczane detay sayfaları — seçili iller/ilçelerden bugünkü nöbetçiler
    const pharmacyFetches = SITEMAP_PHARMACY_CITIES.flatMap(({ citySlug, districts }) =>
        districts.map(async (districtSlug) => {
            try {
                const pharmacies = await fetchOnDutyPharmacies(citySlug, districtSlug);
                return pharmacies
                    .filter((p) => p.id != null)
                    .map((p) => ({
                        url: generateCanonicalUrl(`${citySlug}/${districtSlug}/${pharmacySlug(p.name, p.id!)}`),
                        lastModified: today,
                        changeFrequency: "daily" as const,
                        priority: 0.7,
                    }));
            } catch {
                return [];
            }
        })
    );

    const pharmacyResults = await Promise.all(pharmacyFetches);
    for (const entries of pharmacyResults) {
        result.push(...entries);
    }

    return result;
}
