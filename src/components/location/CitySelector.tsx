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
        onDistrictClear?: () => void;
        variant?: "default" | "listHeader";
        resultCount?: number;
        onOpen?: () => void;
        onClose?: () => void;
    }

    export default function CitySelector({
        selectedCity,
        selectedDistrict,
        onCityChange,
        onDistrictChange,
        onClear,
        onDistrictClear,
        variant = "default",
        resultCount,
        onOpen,
        onClose,
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
            } else {
                setSelectedCityData(null);
            }
        }, [selectedCity, getCityBySlug]);

        useEffect(() => {
            if (isOpen && inputRef.current) {
                inputRef.current.focus();
            }
        }, [isOpen]);

        useEffect(() => {
            const handleKeyDown = (e: KeyboardEvent) => {
                if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                    e.preventDefault();
                    setIsOpen(true);
                    if (onOpen) onOpen();
                }
                if (e.key === "Escape" && isOpen) {
                    setIsOpen(false);
                    if (onClose) onClose();
                }
            };
            window.addEventListener("keydown", handleKeyDown);
            return () => window.removeEventListener("keydown", handleKeyDown);
        }, [isOpen, onOpen, onClose]);

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
            if (onClose) onClose();
        }

        function clearSelection() {
            setSelectedCityData(null);
            setSearchQuery("");
            onClear();
        }

        function toggleOpen() {
            const newState = !isOpen;
            setIsOpen(newState);
            if (!newState) {
                setSearchQuery("");
                if (onClose) onClose();
            } else if (onOpen) {
                onOpen();
            }
        }

        if (variant === "listHeader") {
            return (
                <div className="w-full relative z-[200]">
                    <button
                        onClick={toggleOpen}
                        className="w-full flex items-center text-left transition-all duration-200 shadow-sm group bg-dark-800/80 border border-dark-700/80 rounded-xl px-3 py-3 hover:border-primary-500/50 hover:bg-dark-800 gap-3"
                    >
                        <svg className="w-5 h-5 text-dark-400 group-hover:text-primary-400 shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        
                        <div className="flex-1 flex flex-col justify-center min-w-0">
                            <span className="truncate text-[14px] text-dark-100 font-medium">
                                {selectedCityData ? (
                                    <>
                                        {selectedCityData.name}
                                        {selectedDistrict && <span className="text-dark-400 font-normal"> / {selectedDistrict}</span>}
                                    </>
                                ) : "Şehir veya İlçe Ara"}
                            </span>
                        </div>

                        {resultCount !== undefined && (
                            <div className="shrink-0 px-2 py-0.5 rounded-md bg-dark-700/50 text-xs font-medium text-dark-300">
                                {resultCount} sonuç
                            </div>
                        )}

                        <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-md border border-dark-600 bg-dark-900/50 text-dark-500 font-mono text-[10px] select-none shrink-0">
                            <span>⌘</span>
                            <span className="text-[12px] leading-none mb-0.5">K</span>
                        </div>
                    </button>

                    {isOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-40 bg-dark-950/20 md:bg-transparent"
                                onClick={() => {
                                    setIsOpen(false);
                                    if (onClose) onClose();
                                }}
                            />
                            <div className="absolute z-50 w-full bg-dark-900 border border-dark-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col top-full mt-3 animate-in fade-in zoom-in-95 duration-200">
                                
                                <div className="p-3 border-b border-dark-700 flex flex-wrap items-center gap-2 bg-dark-800/50">
                                    <svg className="w-5 h-5 text-primary-500 shrink-0 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    
                                    {selectedCityData && (
                                        <div className="flex items-center gap-1 bg-primary-500/10 text-primary-400 px-2.5 py-1 rounded-lg text-sm font-medium border border-primary-500/20">
                                            <span>{selectedCityData.name}</span>
                                            <button
                                                onClick={clearSelection}
                                                className="hover:text-primary-300 ml-1 p-0.5 rounded-md hover:bg-primary-500/20 transition-colors"
                                                title="Şehri temizle"
                                            >
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}

                                    {selectedCityData && selectedDistrict && (
                                        <div className="flex items-center gap-1 bg-primary-500/10 text-primary-400 px-2.5 py-1 rounded-lg text-sm font-medium border border-primary-500/20">
                                            <span>{selectedDistrict}</span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onDistrictClear ? onDistrictClear() : undefined; }}
                                                className="hover:text-primary-300 ml-1 p-0.5 rounded-md hover:bg-primary-500/20 transition-colors"
                                                title="İlçeyi temizle"
                                            >
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}

                                    <input
                                        ref={inputRef}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        type="text"
                                        placeholder={selectedCityData ? "İlçe ara..." : "Şehir ara..."}
                                        className="flex-1 min-w-[120px] bg-transparent px-2 py-1 text-base text-dark-100 placeholder:text-dark-400 outline-none"
                                    />
                                </div>

                                <div className="overflow-y-auto flex-1 p-2 custom-scrollbar max-h-[260px]">
                                    {selectedCityData ? (
                                        <div className="space-y-0.5">
                                            {filteredDistricts.length > 0 ? (
                                                filteredDistricts.map((district) => (
                                                    <button
                                                        key={district.slug}
                                                        onClick={() => selectDistrict(district)}
                                                        className={`w-full group flex items-center px-3 py-2.5 rounded-xl transition-all ${
                                                            selectedDistrict === district.name
                                                                ? "bg-primary-500/10 text-primary-400"
                                                                : "text-dark-300 hover:bg-dark-800 hover:text-white"
                                                        }`}
                                                    >
                                                        <svg className={`w-4 h-4 mr-3 shrink-0 ${selectedDistrict === district.name ? "text-primary-400" : "text-dark-500 group-hover:text-dark-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <span className="font-medium text-[15px]">{district.name}</span>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="py-8 flex flex-col items-center justify-center text-dark-400">
                                                    <p className="text-sm">İlçe bulunamadı</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-0.5">
                                            {filteredCities.length > 0 ? (
                                                filteredCities.map((city) => (
                                                    <button
                                                        key={city.slug}
                                                        onClick={() => selectCity(city)}
                                                        className="w-full group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-dark-300 hover:bg-dark-800 hover:text-white"
                                                    >
                                                        <div className="flex items-center">
                                                            <svg className="w-4 h-4 mr-3 shrink-0 text-dark-500 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                            </svg>
                                                            <span className="font-medium text-[15px]">{city.name}</span>
                                                        </div>
                                                        <span className="text-[11px] font-medium px-2 py-0.5 rounded pointer-events-none bg-dark-800 text-dark-400 group-hover:bg-dark-700 group-hover:text-dark-300 transition-colors">
                                                            {city.districts.length} ilçe
                                                        </span>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="py-8 flex flex-col items-center justify-center text-dark-400">
                                                    <p className="text-sm">Şehir bulunamadı</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            );
        }

        // Default variant
        return (
            <div className="relative">
                <button
                    onClick={toggleOpen}
                    className="w-full flex items-center text-left transition-all duration-200 shadow-sm group bg-white border border-slate-200 rounded-2xl px-4 py-3 hover:border-emerald-300 gap-3"
                >
                    <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    
                    <span className={`flex-1 truncate text-sm ${selectedCityData ? "text-slate-800 font-medium" : "text-slate-400"}`}>
                        {selectedCityData ? (
                            <>
                                {selectedCityData.name}
                                {selectedDistrict && <span className="text-slate-400 font-normal"> / {selectedDistrict}</span>}
                            </>
                        ) : "Şehir seçin..."}
                    </span>

                    <svg
                        className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => {
                                setIsOpen(false);
                                if (onClose) onClose();
                            }}
                        />
                        <div className="mt-2 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col bg-white border border-slate-200 absolute top-full left-0 right-0 max-h-80">
                            <div className="p-3 border-b border-slate-100 bg-white">
                                <div className="flex flex-wrap items-center gap-2">
                                    {selectedCityData && (
                                        <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-1 rounded-lg text-sm font-medium">
                                            <span>{selectedCityData.name}</span>
                                            <button
                                                onClick={clearSelection}
                                                className="hover:text-emerald-800 ml-1 p-0.5 rounded-md hover:bg-emerald-100 transition-colors"
                                                title="Şehri temizle"
                                            >
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                    {selectedCityData && selectedDistrict && (
                                        <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-1 rounded-lg text-sm font-medium">
                                            <span>{selectedDistrict}</span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onDistrictClear ? onDistrictClear() : undefined; }}
                                                className="hover:text-emerald-800 ml-1 p-0.5 rounded-md hover:bg-emerald-100 transition-colors"
                                                title="İlçeyi temizle"
                                            >
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                    <input
                                        ref={inputRef}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        type="text"
                                        placeholder={selectedCityData ? "İlçe ara..." : "Şehir ara..."}
                                        className="flex-1 min-w-[120px] px-2 py-1.5 text-sm outline-none rounded-xl border transition-colors text-dark-900 bg-slate-50 border-slate-200 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>

                            <div className="overflow-y-auto flex-1 p-2">
                                {selectedCityData ? (
                                    <>
                                        {filteredDistricts.map((district) => (
                                            <button
                                                key={district.slug}
                                                onClick={() => selectDistrict(district)}
                                                className={`w-full text-left px-3 py-2.5 text-sm rounded-xl transition-colors ${
                                                    selectedDistrict === district.name ? "bg-emerald-50 text-emerald-700 font-medium" : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                                                }`}
                                            >
                                                {district.name}
                                            </button>
                                        ))}
                                        {filteredDistricts.length === 0 && (
                                            <p className="text-center text-sm py-6 text-slate-400">İlçe bulunamadı</p>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {filteredCities.map((city) => (
                                            <button
                                                key={city.slug}
                                                onClick={() => selectCity(city)}
                                                className="w-full text-left px-3 py-2.5 text-sm rounded-xl transition-colors flex items-center justify-between text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                                            >
                                                <span>{city.name}</span>
                                                <span className="text-xs text-slate-400">{city.districts.length} ilçe</span>
                                            </button>
                                        ))}
                                        {filteredCities.length === 0 && (
                                            <p className="text-center text-sm py-6 text-slate-400">Sonuç bulunamadı</p>
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
