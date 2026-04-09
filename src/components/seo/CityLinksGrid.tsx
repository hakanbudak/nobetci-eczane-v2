import Link from "next/link";
import { cities } from "@/data/cities";

export function CityLinksGrid() {
    return (
        <section className="w-full bg-dark-950 border-t border-dark-800 px-4 py-10">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-base font-bold text-dark-200 mb-6">
                    Türkiye'nin Tüm İllerinde Nöbetçi Eczane
                </h2>
                <ul className="flex flex-wrap gap-2">
                    {cities.map((city) => (
                        <li key={city.slug}>
                            <Link
                                href={`/${city.slug}/nobetci`}
                                className="inline-block text-xs px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-dark-300 hover:text-primary-300 border border-dark-700/50 hover:border-primary-500/30 transition-all"
                            >
                                {city.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
