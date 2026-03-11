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

    const prioritySlugs = ["istanbul", "izmir", "ankara"];

    const sortedCities = useMemo(() => {
        const priority = allCities.filter((c) => prioritySlugs.includes(c.slug));
        const rest = allCities.filter((c) => !prioritySlugs.includes(c.slug));
        // Öncelikli şehirleri belirlenen sırada döndür
        priority.sort((a, b) => prioritySlugs.indexOf(a.slug) - prioritySlugs.indexOf(b.slug));
        return [...priority, ...rest];
    }, [allCities]);

    const searchCities = useCallback(
        (query: string): City[] => {
            if (!query) return sortedCities;
            const q = query.toLowerCase();
            const results = sortedCities.filter(
                (c) => c.name.toLowerCase().includes(q) || c.slug.includes(q)
            );
            return results;
        },
        [sortedCities]
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
