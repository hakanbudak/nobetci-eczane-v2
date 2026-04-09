import Link from "next/link";
import type { District } from "@/types/pharmacy";

interface DistrictLinksGridProps {
    citySlug: string;
    cityName: string;
    districts: District[];
    currentDistrictSlug?: string;
}

export function DistrictLinksGrid({ citySlug, cityName, districts, currentDistrictSlug }: DistrictLinksGridProps) {
    const filtered = currentDistrictSlug
        ? districts.filter((d) => d.slug !== currentDistrictSlug)
        : districts;

    if (filtered.length === 0) return null;

    const title = currentDistrictSlug
        ? `${cityName}'ın Diğer İlçelerinde Nöbetçi Eczane`
        : `${cityName} İlçelerinde Nöbetçi Eczane`;

    return (
        <section className="w-full bg-dark-950 border-t border-dark-800 px-4 py-10">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-base font-bold text-dark-200 mb-6">{title}</h2>
                <ul className="flex flex-wrap gap-2">
                    {filtered.map((district) => (
                        <li key={district.slug}>
                            <Link
                                href={`/${citySlug}/${district.slug}/nobetci`}
                                className="inline-block text-xs px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-dark-300 hover:text-primary-300 border border-dark-700/50 hover:border-primary-500/30 transition-all"
                            >
                                {district.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
