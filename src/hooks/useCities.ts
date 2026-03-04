import { useMemo, useCallback } from "react";
import { cities } from "@/data/cities";
import type { City, District } from "@/types/pharmacy";

export function useCities() {
    const allCities = cities as City[];

    const slugToNameMap = useMemo(() => {
        const map = new Map<string, string>();
        for (const city of cities) {
            map.set(city.slug, city.name);
            for (const district of (city as City).districts) {
                map.set(`${city.slug}__${district.slug}`, district.name);
            }
        }
        return map;
    }, []);

    const getCityBySlug = useCallback(
        (slug: string): City | undefined => allCities.find((c) => c.slug === slug),
        [allCities]
    );

    const getCityName = useCallback(
        (slug: string): string => slugToNameMap.get(slug) || slug,
        [slugToNameMap]
    );

    const getDistrictBySlug = useCallback(
        (citySlug: string, districtSlug: string): District | undefined => {
            const city = getCityBySlug(citySlug);
            return city?.districts.find((d) => d.slug === districtSlug);
        },
        [getCityBySlug]
    );

    const getDistrictName = useCallback(
        (citySlug: string, districtSlug: string): string =>
            slugToNameMap.get(`${citySlug}__${districtSlug}`) || districtSlug,
        [slugToNameMap]
    );

    const searchCities = useCallback(
        (query: string): City[] => {
            if (!query) return allCities;
            const q = query.toLowerCase();
            return allCities.filter(
                (c) => c.name.toLowerCase().includes(q) || c.slug.includes(q)
            );
        },
        [allCities]
    );

    return {
        allCities,
        slugToNameMap,
        getCityBySlug,
        getCityName,
        getDistrictBySlug,
        getDistrictName,
        searchCities,
    };
}
