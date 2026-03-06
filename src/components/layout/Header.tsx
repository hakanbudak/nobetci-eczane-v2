"use client";

import Link from "next/link";
import type { LocationStatus } from "@/types/pharmacy";
import CitySelector from "@/components/location/CitySelector";

interface HeaderProps {
    locationStatus: LocationStatus;
    pharmacyCount: number;
    cityName: string;
    citySelectorProps?: {
        selectedCity: string;
        selectedDistrict: string;
        onCityChange: (name: string, slug: string) => void;
        onDistrictChange: (name: string, slug: string) => void;
        onClear: () => void;
    };
}

export default function Header({ locationStatus, pharmacyCount, cityName, citySelectorProps }: HeaderProps) {
    return (
        <header className="h-14 bg-dark-950 border-b border-dark-700/50 flex items-center px-4 shrink-0">
            <div className="flex items-center justify-between w-full max-w-[1920px] mx-auto">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-primary-400 font-bold text-base tracking-tight hover:text-primary-300 transition-colors"
                >
                    <span className="w-7 h-7 bg-[#FF0000] rounded-lg flex items-center justify-center text-white text-sm font-black border-2 border-white">
                        E
                    </span>
                    <span className="text-dark-100">Nöbetçi Eczane</span>
                </Link>

                <div className="lg:hidden flex items-center justify-end flex-1 min-w-0 ml-4">
                    {citySelectorProps ? (
                        <div className="w-full max-w-[220px]">
                            <CitySelector {...citySelectorProps} variant="header" />
                        </div>
                    ) : (
                        <>
                            {(locationStatus === "idle" || locationStatus === "requesting") && (
                                <div className="inline-flex items-center gap-1.5 text-dark-300 text-xs">
                                    <svg className="w-3 h-3 animate-spin text-primary-400 shrink-0" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Konum...</span>
                                </div>
                            )}

                            {locationStatus === "granted" && cityName && (
                                <div className="inline-flex items-center gap-1.5 text-dark-200 text-xs truncate">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />
                                    <span className="truncate max-w-[120px]">{cityName}</span>
                                    {pharmacyCount > 0 && (
                                        <span className="bg-primary-500/20 text-primary-300 rounded-full px-1.5 py-0.5 text-[10px] font-semibold border border-primary-500/30">
                                            {pharmacyCount}
                                        </span>
                                    )}
                                </div>
                            )}

                            {(locationStatus === "denied" || locationStatus === "unavailable") && (
                                <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs">
                                    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>Konum yok</span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
