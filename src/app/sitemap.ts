import type { MetadataRoute } from "next";
import { cities } from "@/data/cities";
import type { City } from "@/types/pharmacy";
import { generateCanonicalUrl } from "@/utils/seoHelpers";

// Sadece statik sayfalar — API çağrısı yok, Googlebot anında okur
export const revalidate = 43200;

export default function sitemap(): MetadataRoute.Sitemap {
    const today = new Date().toISOString();

    const result: MetadataRoute.Sitemap = [
        {
            url: generateCanonicalUrl("/"),
            lastModified: today,
            changeFrequency: "daily",
            priority: 1,
        },
    ];

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

    return result;
}
