"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { LocationStatus } from "@/types/pharmacy";
import CitySelector from "@/components/location/CitySelector";

interface HeaderProps {
    cityName: string;
    citySelectorProps?: {
        selectedCity: string;
        selectedDistrict: string;
        onCityChange: (name: string, slug: string) => void;
        onDistrictChange: (name: string, slug: string) => void;
        onClear: () => void;
    };
}

export default function Header({ cityName, citySelectorProps }: HeaderProps) {
    useEffect(() => {
        // Cihaza/kullanıcıya ait tema ayarlarını yükle
        const theme = localStorage.getItem("theme");
        if (theme === "light") {
            document.documentElement.classList.add("theme-light");
        }

        const color = localStorage.getItem("colorTheme");
        if (color) {
            document.documentElement.classList.add(color);
        }
    }, []);

    const toggleTheme = () => {
        const isLight = document.documentElement.classList.toggle("theme-light");
        localStorage.setItem("theme", isLight ? "light" : "dark");
    };

    return (
        <header className="h-16 bg-dark-950/80 backdrop-blur-md border-b border-dark-700/50 flex items-center px-4 sticky top-0 z-[2000]">
            <div className="flex items-center justify-between w-full max-w-[1920px] mx-auto gap-4">
                {/* Sol: Logo */}
                <div className="flex-1 flex justify-start shrink-0 min-w-0">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-primary-400 font-bold text-base tracking-tight hover:text-primary-300 transition-colors shrink-0"
                    >
                        <span className="w-8 h-8 bg-[#FF0000] rounded-lg flex items-center justify-center text-white text-sm font-black border-2 border-white shadow-lg shadow-red-500/20">
                            E
                        </span>
                        <span className="text-dark-100 hidden sm:inline-block whitespace-nowrap overflow-hidden text-ellipsis">
                            {cityName ? `${cityName} Nöbetçi Eczane` : "Nöbetçi Eczane"}
                        </span>
                    </Link>
                </div>

                {/* Orta: Arama (Merkezi) */}
                <div className="flex-[2] w-full max-w-2xl relative z-[100] flex justify-center">
                    {citySelectorProps && (
                        <div className="w-full">
                            <CitySelector {...citySelectorProps} variant="header" />
                        </div>
                    )}
                </div>

                {/* Sağ: İkonlar */}
                <div className="flex-1 flex justify-end items-center gap-2 lg:gap-3 shrink-0">
                    {/* İkonlar (Mobil & Desktop Görünür) */}
                    <div className="flex items-center gap-1 md:gap-2">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-xl border border-dark-700 bg-dark-800/50 text-dark-300 hover:text-dark-100 hover:border-dark-500 transition-all"
                            title="GitHub"
                        >
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>
                        <button
                            onClick={toggleTheme}
                            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-xl border border-dark-700 bg-dark-800/50 text-dark-300 hover:text-dark-100 hover:border-dark-500 transition-all"
                            title="Tema Değiştir"
                        >
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
