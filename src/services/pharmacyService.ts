import api from "./api";
import type { Pharmacy, PharmlushDutyItem, PharmlushResponse } from "@/types/pharmacy";

function mapDutyItem(item: PharmlushDutyItem): Pharmacy {
    const p = item.pharmacy;
    return {
        name: p.name,
        district: p.district || "",
        address: p.address,
        phone: p.phone,
        phone2: null,
        location: {
            lat: parseFloat(p.latitude) || 0,
            lng: parseFloat(p.longitude) || 0,
        },
        googleMapsUrl: p.google_maps_url,
        neighborhood: p.neighborhood,
        dutyNote: item.duty_note,
        distance: p.distance_km ?? undefined,
    };
}

function deduplicateByPhone(items: PharmlushDutyItem[]): PharmlushDutyItem[] {
    const phoneMap = new Map<string, PharmlushDutyItem>();
    for (const item of items) {
        const key = item.pharmacy.phone?.replace(/[\s\-()]/g, "") || String(item.pharmacy.id);
        const existing = phoneMap.get(key);
        if (!existing || (item.pharmacy.address?.length || 0) > (existing.pharmacy.address?.length || 0)) {
            phoneMap.set(key, item);
        }
    }
    return Array.from(phoneMap.values());
}

export async function fetchOnDutyPharmacies(
    citySlug: string,
    districtSlug?: string
): Promise<Pharmacy[]> {
    const params: Record<string, string | number> = {
        province: citySlug,
        limit: 100,
    };
    if (districtSlug) params.district = districtSlug;

    const allItems: PharmlushDutyItem[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        params.page = page;
        const { data } = await api.get<PharmlushResponse>("/v1/duty-pharmacies/", { params });
        allItems.push(...data.results);
        hasMore = data.next !== null && page < 10;
        page++;
    }

    const deduped = deduplicateByPhone(allItems);
    return deduped.map(mapDutyItem);
}

export async function fetchNearbyPharmacies(
    lat: number,
    lng: number,
    radiusKm: number = 5
): Promise<Pharmacy[]> {
    const { data } = await api.get<PharmlushDutyItem[]>("/v1/duty-pharmacies/nearby/", {
        params: { lat, lng, radius_km: radiusKm },
    });

    const deduped = deduplicateByPhone(data);
    return deduped.map(mapDutyItem);
}
