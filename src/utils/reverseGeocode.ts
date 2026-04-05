import { cities } from "@/data/cities";
import { CITY_CENTERS } from "@/data/cityCenters";
import { DISTRICT_CENTERS } from "@/data/districtCenters";
import type { District } from "@/types/pharmacy";

interface NearestCity {
    name: string;
    slug: string;
    distance: number;
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export function findNearestCity(lat: number, lng: number): NearestCity {
    let nearestSlug = "istanbul";
    let minDist = Infinity;

    for (const city of cities) {
        const center = CITY_CENTERS[city.slug];
        if (!center) continue;
        const dist = haversineDistance(lat, lng, center.lat, center.lng);
        if (dist < minDist) {
            minDist = dist;
            nearestSlug = city.slug;
        }
    }

    const city = cities.find((c) => c.slug === nearestSlug)!;
    return {
        name: city.name,
        slug: city.slug,
        distance: Math.round(minDist * 10) / 10,
    };
}

export function detectDistrictFromCoords(
    citySlug: string,
    lat: number,
    lng: number
): District | undefined {
    const city = cities.find((c) => c.slug === citySlug);
    const centers = DISTRICT_CENTERS[citySlug];
    if (!city || !centers) return undefined;

    let nearestSlug: string | undefined;
    let minDist = Infinity;

    for (const [slug, center] of Object.entries(centers)) {
        const dist = haversineDistance(lat, lng, center.lat, center.lng);
        if (dist < minDist) {
            minDist = dist;
            nearestSlug = slug;
        }
    }

    if (!nearestSlug) return undefined;
    return city.districts.find((d) => d.slug === nearestSlug);
}
