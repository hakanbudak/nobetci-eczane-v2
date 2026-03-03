import api from "./api";
import type { Pharmacy, PharmacyApiItem, PharmacyApiResponse } from "@/types/pharmacy";

function mapApiItem(item: PharmacyApiItem): Pharmacy {
    return {
        name: item.name,
        district: item.district?.name || "",
        address: item.address,
        phone: item.phone,
        phone2: item.phone2,
        location: {
            lat: item.location?.latitude,
            lng: item.location?.longitude,
        },
    };
}

function deduplicateByPhone(items: PharmacyApiItem[]): PharmacyApiItem[] {
    const phoneMap = new Map<string, PharmacyApiItem>();
    for (const item of items) {
        const key = item.phone?.replace(/[\s\-()]/g, "") || item.id;
        const existing = phoneMap.get(key);
        if (!existing || (item.address?.length || 0) > (existing.address?.length || 0)) {
            phoneMap.set(key, item);
        }
    }
    return Array.from(phoneMap.values());
}

function extractTodayPharmacies(data: PharmacyApiResponse): PharmacyApiItem[] {
    const groups = data.data || [];
    const todayGroup = groups.find((g) => g.day === "Bugün") || groups[groups.length - 1];
    return todayGroup?.pharmacies || [];
}

export async function fetchOnDutyPharmacies(
    citySlug: string,
    districtSlug?: string
): Promise<Pharmacy[]> {
    const params: Record<string, string> = { city: citySlug };
    if (districtSlug) params.district = districtSlug;

    const { data } = await api.get<PharmacyApiResponse>("/pharmacies/on-duty", { params });

    if (!data.success) {
        throw new Error(data.error || "API başarısız yanıt döndü.");
    }

    const raw = extractTodayPharmacies(data);
    const deduped = deduplicateByPhone(raw);
    return deduped.map(mapApiItem);
}
