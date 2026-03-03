"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchOnDutyPharmacies } from "@/services/pharmacyService";
import { calculateDistance } from "@/utils/distance";
import { usePharmacyStore } from "@/store/pharmacyStore";
import type { Coordinates } from "@/types/pharmacy";

export function usePharmacies(citySlug: string, districtSlug?: string) {
    const setPharmacies = usePharmacyStore((s) => s.setPharmacies);

    const query = useQuery({
        queryKey: ["pharmacies", citySlug, districtSlug || "all"],
        queryFn: () => fetchOnDutyPharmacies(citySlug, districtSlug),
        enabled: !!citySlug,
        staleTime: 1000 * 60 * 60,
    });

    function sortByDistance(coords: Coordinates) {
        if (!query.data) return;
        const sorted = [...query.data]
            .map((p) => ({ ...p, distance: calculateDistance(coords, p.location) }))
            .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
        setPharmacies(sorted);
    }

    return {
        pharmacies: query.data || [],
        isLoading: query.isLoading,
        error: query.error?.message || null,
        refetch: query.refetch,
        sortByDistance,
    };
}
