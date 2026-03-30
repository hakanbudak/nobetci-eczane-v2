"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useCities } from "@/hooks/useCities";
import type { City, District } from "@/types/pharmacy";

interface CitySelectorProps {
    selectedCity: string;
    selectedDistrict: string;
    onCityChange: (cityName: string, citySlug: string) => void;
    onDistrictChange: (districtName: string, districtSlug: string) => void;
    onClear: () => void;
    variant?: "default" | "header";
}

export default function CitySelector({
    selectedCity,
    selectedDistrict,
    onCityChange,
    onDistrictChange,
    onClear,
    variant = "default",
}: CitySelectorProps) {
    const { allCities, searchCities, getCityBySlug } = useCities();
    const [searchQuery, setSearchQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCityData, setSelectedCityData] = useState<City | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (selectedCity) {
            const city = getCityBySlug(selectedCity);
            if (city) setSelectedCityData(city);
        }
    }, [selectedCity, getCityBySlug]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen(true);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const filteredCities = useMemo(() => searchCities(searchQuery), [searchCities, searchQuery]);

    const filteredDistricts = useMemo(() => {
        if (!selectedCityData) return [];
        const q = searchQuery.toLowerCase().trim();
        if (!q) return selectedCityData.districts;
        return selectedCityData.districts.filter((d) => d.name.toLowerCase().includes(q));
    }, [selectedCityData, searchQuery]);

    function selectCity(city: City) {
        setSelectedCityData(city);
        setSearchQuery("");
        onCityChange(city.name, city.slug);
    }

    function selectDistrict(district: District) {
        if (!selectedCityData) return;
        onDistrictChange(district.name, district.slug);
        setIsOpen(false);
    }

    function clearSelection() {
        setSelectedCityData(null);
        setSearchQuery("");
        onClear();
    }

    function toggleOpen() {
        setIsOpen(!isOpen);
        if (!isOpen) setSearchQuery("");
    }

    return (
        <div className={`relative ${variant === "header" ? "w-full" : ""}`}>
            <button
                onClick={toggleOpen}
                className={`w-full flex items-center text-left transition-all duration-200 shadow-sm group ${variant === "header"
                    ? "bg-dark-800/50 border border-dark-700 rounded-xl px-3 py-2 hover:border-dark-500 hover:bg-dark-800 gap-3"
                    : "bg-white border border-slate-200 rounded-2xl px-4 py-3 hover:border-emerald-300 gap-3"
                    }`}
            >
                {variant !== "header" && (
                    <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                )}
                {variant === "header" && (
                    <svg className="w-5 h-5 text-dark-400 group-hover:text-dark-200 shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                )}
                <span className={`flex-1 truncate ${variant === "header" ? "text-[15px]" : "text-sm"
                    } ${selectedCityData ? (variant === "header" ? "text-dark-100 font-medium" : "text-slate-800 font-medium") : (variant === "header" ? "text-dark-400" : "text-slate-400")}`}>
                    {selectedCityData ? (
                        <>
                            {selectedCityData.name}
                            {selectedDistrict && <span className={variant === "header" ? "text-dark-400 font-normal" : "text-slate-400 font-normal"}> / {selectedDistrict}</span>}
                        </>
                    ) : (variant === "header" ? "Search" : "Şehir seçin...")}
                </span>

                {variant === "header" && (
                    <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-md border border-dark-600 bg-dark-900/50 text-dark-500 font-mono text-[10px] select-none">
                        <span>⌘</span>
                        <span>+</span>
                        <span>K</span>
                    </div>
                )}

                {variant !== "header" && (
                    <svg
                        className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className={`fixed inset-0 z-40 ${variant === "header" ? "bg-dark-900/40 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none" : ""}`}
                        onClick={() => setIsOpen(false)}
                    />
                    <div
                        className={`mt-2 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col ${variant === "header"
                            ? "bg-dark-900 border border-dark-700 fixed top-[72px] left-4 right-4 max-h-[75vh] md:absolute md:top-full md:left-auto md:right-0 md:w-[360px] md:max-h-[24rem]"
                            : "bg-white border border-slate-200 absolute top-full left-0 right-0 max-h-80"
                            }`}
                    >
                        <div className={`p-3 border-b ${variant === "header" ? "border-dark-700 bg-dark-900" : "border-slate-100 bg-white"}`}>
                            <div className="flex items-center gap-2">
                                <input
                                    ref={inputRef}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    type="text"
                                    placeholder={selectedCityData ? "İlçe ara..." : "Şehir ara..."}
                                    className={`flex-1 min-w-0 px-3 py-2 text-base md:text-sm outline-none rounded-xl border transition-colors ${variant === "header"
                                            ? "bg-dark-800 border-dark-600 text-dark-100 placeholder:text-dark-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                            : "text-dark-900 bg-slate-50 border-slate-200 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                        }`}
                                />
                                {selectedCityData && (
                                    <button onClick={clearSelection} className={`shrink-0 text-xs font-semibold px-2 py-1 transition-colors ${variant === "header" ? "text-dark-400 hover:text-dark-200" : "text-slate-500 hover:text-slate-800"}`}>
                                        Geri
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="overflow-y-auto flex-1 p-2">
                            {selectedCityData ? (
                                <>
                                    {filteredDistricts.map((district) => (
                                        <button
                                            key={district.slug}
                                            onClick={() => selectDistrict(district)}
                                            className={`w-full text-left px-3 py-2.5 text-sm rounded-xl transition-colors ${variant === "header"
                                                ? (selectedDistrict === district.name ? "bg-primary-500/10 text-primary-400 font-medium" : "text-dark-200 hover:bg-dark-800 hover:text-primary-400")
                                                : (selectedDistrict === district.name ? "bg-emerald-50 text-emerald-700 font-medium" : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700")
                                                }`}
                                        >
                                            {district.name}
                                        </button>
                                    ))}
                                    {filteredDistricts.length === 0 && (
                                        <p className={`text-center text-sm py-6 ${variant === "header" ? "text-dark-400" : "text-slate-400"}`}>İlçe bulunamadı</p>
                                    )}
                                </>
                            ) : (
                                <>
                                    {filteredCities.map((city) => (
                                        <button
                                            key={city.slug}
                                            onClick={() => selectCity(city)}
                                            className={`w-full text-left px-3 py-2.5 text-sm rounded-xl transition-colors flex items-center justify-between ${variant === "header"
                                                ? "text-dark-200 hover:bg-dark-800 hover:text-primary-400"
                                                : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                                                }`}
                                        >
                                            <span>{city.name}</span>
                                            <span className={`text-xs ${variant === "header" ? "text-dark-500" : "text-slate-400"}`}>{city.districts.length} ilçe</span>
                                        </button>
                                    ))}
                                    {filteredCities.length === 0 && (
                                        <p className={`text-center text-sm py-6 ${variant === "header" ? "text-dark-400" : "text-slate-400"}`}>Sonuç bulunamadı</p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
