"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";
import LocationPermissionModal from "@/components/common/LocationPermissionModal";
import LocationBanner from "@/components/location/LocationBanner";
import PharmacyList from "@/components/pharmacy/PharmacyList";
import CitySelector from "@/components/location/CitySelector";
import { usePharmacyStore } from "@/store/pharmacyStore";
import { useGeolocation } from "@/hooks/useGeolocation";
import { fetchOnDutyPharmacies } from "@/services/pharmacyService";
import { findNearestCity } from "@/utils/reverseGeocode";
import { calculateDistance } from "@/utils/distance";
import type { Pharmacy, Coordinates } from "@/types/pharmacy";
import type { PharmacyMapRef } from "./PharmacyMap";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { CityContent } from "@/components/seo/CityContent";

const PharmacyMap = dynamic(() => import("./PharmacyMap"), { ssr: false });

interface HomeViewProps {
    initialPharmacies?: Pharmacy[];
    initialCitySlug?: string;
    initialCityName?: string;
    initialDistrictSlug?: string;
    initialDistrictName?: string;
}

export default function HomeView({
    initialPharmacies = [],
    initialCitySlug = "",
    initialCityName = "",
    initialDistrictSlug = "",
    initialDistrictName = "",
}: HomeViewProps) {
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>(initialPharmacies);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activePharmacy, setActivePharmacy] = useState<Pharmacy | null>(null);
    const [isListVisible, setIsListVisible] = useState(true);
    const [isSeoVisible, setIsSeoVisible] = useState(false);

    const [selectedCitySlug, setSelectedCitySlug] = useState(initialCitySlug);
    const [selectedDistrictSlug, setSelectedDistrictSlug] = useState(initialDistrictSlug);
    const [selectedDistrictName, setSelectedDistrictName] = useState(initialDistrictName);
    const [detectedCityName, setDetectedCityName] = useState(initialCityName);

    const { coordinates, status, requestLocation } = useGeolocation();
    const desktopMapRef = useRef<PharmacyMapRef>(null);
    const mobileMapRef = useRef<PharmacyMapRef>(null);

    const [translateY, setTranslateY] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const [showLocationModal, setShowLocationModal] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const permissionStatus = localStorage.getItem("locationPermission");
            if (!permissionStatus) {
                setShowLocationModal(true);
            } else if (permissionStatus === "granted" && status !== "granted") {
                // Önceden izin verildiyse sayfa yenilendiğinde (F5) eczaneleri sessizce çek
                handleLocationRequest(true);
            }
        }
    }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

    // Mobil harita offset hesabı doğrudan renderda translateY'den alınacak
    const pointerStartY = useRef(0);
    const translateAtDragStart = useRef(0);
    const velocityHistory = useRef<Array<{ t: number; y: number }>>([]);


    function zoomAllMaps() {
        desktopMapRef.current?.zoomToPharmacies();
        mobileMapRef.current?.zoomToPharmacies();
    }

    function sortByDistance(coords: Coordinates, list: Pharmacy[]) {
        return [...list]
            .map((p) => ({ ...p, distance: calculateDistance(coords, p.location) }))
            .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    }

    useEffect(() => {
        // Otomatik konum istemek yerine mevcut konuma göre sadece mesafeleri sırala
        if (pharmacies.length > 0 && status === "granted") {
            requestLocation().then((coords) => {
                if (coords) setPharmacies(sortByDistance(coords, pharmacies));
            });
        }
    }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (typeof window !== "undefined") {
            setTranslateY(Math.round(window.innerHeight * 0.85 - 200));
        }
    }, []);

    const handleLocationRequest = useCallback(async (silent = false) => {
        const coords = await requestLocation(silent);
        if (coords) {
            setTranslateY(typeof window !== "undefined" ? Math.round(window.innerHeight * 0.85 - 200) : 0);
            setTimeout(() => mobileMapRef.current?.triggerResize(), 400);

            const nearest = findNearestCity(coords.lat, coords.lng);
            setDetectedCityName(nearest.name);
            setSelectedCitySlug(nearest.slug);
            if (!silent) setIsLoading(true);
            try {
                const data = await fetchOnDutyPharmacies(nearest.slug);
                setPharmacies(sortByDistance(coords, data));
            } catch {
                if (!silent) setError("Eczane verileri yüklenemedi.");
            }
            if (!silent) setIsLoading(false);
        }
    }, [requestLocation]);

    const handleCityChange = useCallback(async (_cityName: string, citySlug: string) => {
        setSelectedCitySlug(citySlug);
        setSelectedDistrictSlug("");
        setSelectedDistrictName("");
        setDetectedCityName("");
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchOnDutyPharmacies(citySlug);
            const sorted = coordinates ? sortByDistance(coordinates, data) : data;
            setPharmacies(sorted);
        } catch {
            setError("Eczane verileri yüklenemedi.");
        }
        setIsLoading(false);
        setTimeout(() => zoomAllMaps(), 100);
    }, [coordinates]);

    const handleDistrictChange = useCallback(async (districtName: string, districtSlug: string) => {
        setSelectedDistrictSlug(districtSlug);
        setSelectedDistrictName(districtName);
        if (selectedCitySlug) {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchOnDutyPharmacies(selectedCitySlug, districtSlug);
                const sorted = coordinates ? sortByDistance(coordinates, data) : data;
                setPharmacies(sorted);
            } catch {
                setError("Eczane verileri yüklenemedi.");
            }
            setIsLoading(false);
            setTimeout(() => zoomAllMaps(), 100);
        }
    }, [selectedCitySlug, coordinates]);

    const handleInitialLocationAllow = useCallback(() => {
        setShowLocationModal(false);
        try {
            localStorage.setItem("locationPermission", "granted");
        } catch { }
        handleLocationRequest(); // doğrudan tetikle
    }, [handleLocationRequest]);

    const handleInitialLocationDeny = useCallback(() => {
        setShowLocationModal(false);
        try {
            localStorage.setItem("locationPermission", "denied");
        } catch { }
    }, []);

    const handleCityClear = useCallback(() => {
        setSelectedCitySlug("");
        setSelectedDistrictSlug("");
        setSelectedDistrictName("");
        setDetectedCityName("");
        setPharmacies([]);
        setActivePharmacy(null);
    }, []);

    const handleSelectPharmacy = useCallback((pharmacy: Pharmacy) => {
        setActivePharmacy(pharmacy);
        desktopMapRef.current?.focusOnPharmacy(pharmacy);
        mobileMapRef.current?.focusOnPharmacy(pharmacy);
    }, []);

    const getMaxTranslate = () => typeof window !== "undefined" ? Math.round(window.innerHeight * 0.85 - 120) : 600;

    function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
        setIsDragging(true);
        setIsAnimating(false);
        pointerStartY.current = e.clientY;
        translateAtDragStart.current = translateY;
        velocityHistory.current = [{ t: Date.now(), y: e.clientY }];
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }

    function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
        if (!isDragging) return;
        const deltaY = e.clientY - pointerStartY.current;
        let newY = translateAtDragStart.current + deltaY;
        const maxT = getMaxTranslate();
        if (newY < 0) newY = newY * 0.2;
        else if (newY > maxT) newY = maxT + (newY - maxT) * 0.2;

        setTranslateY(newY);

        const now = Date.now();
        velocityHistory.current.push({ t: now, y: e.clientY });
        while (velocityHistory.current.length > 1 && now - velocityHistory.current[0].t > 80) {
            velocityHistory.current.shift();
        }
    }

    function onPointerUp() {
        if (!isDragging) return;
        setIsDragging(false);

        let velocity = 0;
        const vh = velocityHistory.current;
        if (vh.length >= 2) {
            const first = vh[0];
            const last = vh[vh.length - 1];
            const dt = last.t - first.t;
            if (dt > 0) velocity = (last.y - first.y) / dt;
        }
        const momentum = velocity * 150;
        const target = Math.max(60, Math.min(translateY + momentum, getMaxTranslate()));
        setIsAnimating(true);
        setTranslateY(target);
        setTimeout(() => setIsAnimating(false), 420);
    }

    return (
        <div className="h-[100dvh] w-full overflow-hidden bg-dark-900 flex flex-col">
            {showLocationModal && (
                <LocationPermissionModal onAllow={handleInitialLocationAllow} onDeny={handleInitialLocationDeny} />
            )}
            <LocationBanner status={status} onRequest={handleLocationRequest} />
            <Header
                locationStatus={status}
                pharmacyCount={pharmacies.length}
                cityName={detectedCityName || selectedCitySlug}
                citySelectorProps={{
                    selectedCity: selectedCitySlug,
                    selectedDistrict: selectedDistrictName,
                    onCityChange: handleCityChange,
                    onDistrictChange: handleDistrictChange,
                    onClear: handleCityClear,
                }}
            />



            <div className="flex-1 overflow-hidden">
                {/* ═══════════ DESKTOP ═══════════ */}
                <div className="hidden lg:flex h-full w-full">
                    <div className="relative flex-1 h-full min-w-0">
                        <div className="absolute top-3 left-3 z-[1000] flex flex-col gap-2 pointer-events-none">

                            {status === "granted" && detectedCityName && (
                                <div className="inline-flex items-center gap-2 bg-dark-900/90 backdrop-blur-sm text-dark-200 rounded-lg px-3 py-2 text-xs border border-primary-700/30 shadow-lg pointer-events-auto w-fit">
                                    <span className="w-2 h-2 bg-green-500 rounded-full shrink-0" />
                                    <span>📍 {detectedCityName} · {pharmacies.length} eczane</span>
                                </div>
                            )}
                            {(status === "idle" || status === "requesting" || status === "denied" || status === "unavailable") && (
                                <button
                                    onClick={() => handleLocationRequest()}
                                    className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-[11px] font-semibold text-primary-300 hover:text-primary-200 cursor-pointer shadow-lg transition-colors border border-primary-500/20"
                                >
                                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    <span>{status === "requesting" ? "Konum aranıyor..." : "Yakındaki Eczaneler"}</span>
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => {
                                setIsListVisible(!isListVisible);
                                setTimeout(() => desktopMapRef.current?.triggerResize(), 370);
                            }}
                            title={isListVisible ? "Listeyi Gizle" : "Listeyi Göster"}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-[1001] flex flex-col items-center justify-center gap-1 w-5 h-16 bg-dark-800 hover:bg-dark-700 border border-dark-600 hover:border-primary-500/60 rounded-l-lg shadow-xl transition-all duration-200 group"
                        >
                            <svg
                                className={`w-3 h-3 text-dark-400 group-hover:text-primary-400 transition-all ${!isListVisible ? "rotate-180" : ""}`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                style={{ transition: "transform 0.3s ease, color 0.2s" }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        <PharmacyMap
                            ref={desktopMapRef}
                            pharmacies={pharmacies}
                            userLocation={coordinates}
                            activePharmacy={activePharmacy}
                            onSelectPharmacy={setActivePharmacy}
                        />
                    </div>

                    {isListVisible && (
                        <div className="w-[480px] shrink-0 h-full flex flex-col border-l border-dark-700/50">
                            <div className="shrink-0 p-4 border-b border-dark-700/50 space-y-3 bg-dark-900">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm font-bold text-dark-100 truncate pr-2">
                                        {detectedCityName ? `${detectedCityName} Nöbetçi Eczaneler` : "Nöbetçi Eczaneler"}
                                    </h2>
                                    {!isLoading && pharmacies.length > 0 && (
                                        <span className="text-xs text-dark-500 font-medium whitespace-nowrap">{pharmacies.length} sonuç</span>
                                    )}
                                </div>
                                <CitySelector
                                    selectedCity={selectedCitySlug}
                                    selectedDistrict={selectedDistrictName}
                                    onCityChange={handleCityChange}
                                    onDistrictChange={handleDistrictChange}
                                    onClear={handleCityClear}
                                />
                            </div>
                            {error && (
                                <div className="mx-4 mt-3 bg-red-950/50 text-red-400 text-xs rounded-lg px-4 py-3 border border-red-800/30 shrink-0">
                                    {error}
                                </div>
                            )}
                            <div className="flex-1 overflow-y-auto p-4 min-h-0 overscroll-contain bg-dark-900">
                                <PharmacyList pharmacies={pharmacies} isLoading={isLoading} activePharmacy={activePharmacy} onSelect={setActivePharmacy} onRequestLocation={handleLocationRequest} />
                            </div>
                        </div>
                    )}
                </div>

                {/* ═══════════ MOBİL ═══════════ */}
                <div className="lg:hidden relative h-full w-full">
                    <div className="absolute inset-0 z-0">
                        <PharmacyMap
                            ref={mobileMapRef}
                            pharmacies={pharmacies}
                            userLocation={coordinates}
                            activePharmacy={activePharmacy}
                            mapCenterOffset={typeof window !== "undefined" ? Math.round((window.innerHeight * 0.85 - translateY) / 2) : 130}
                            onSelectPharmacy={setActivePharmacy}
                        />
                    </div>
                    <div
                        className="absolute inset-x-0 bottom-0 z-10 flex flex-col bg-dark-900 rounded-t-2xl shadow-[0_-8px_40px_rgba(0,0,0,0.5)] will-change-transform"
                        style={{
                            height: typeof window !== "undefined" ? Math.max(300, window.innerHeight * 0.85) : "85dvh",
                            transform: `translateY(${translateY}px)`,
                            transition: isAnimating ? "transform 0.42s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
                        }}
                    >
                        <div
                            className="shrink-0 flex justify-center items-center h-8 cursor-grab active:cursor-grabbing select-none"
                            style={{ touchAction: "none" }}
                            onPointerDown={onPointerDown}
                            onPointerMove={onPointerMove}
                            onPointerUp={onPointerUp}
                            onPointerCancel={onPointerUp}
                        >
                            <div className={`w-10 h-1.5 rounded-full transition-colors duration-150 ${isDragging ? "bg-primary-400" : "bg-dark-600"}`} />
                        </div>
                        <div className="shrink-0 px-4 pb-3 border-b border-dark-700/50">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-bold text-dark-100 truncate pr-2">
                                    {detectedCityName ? `${detectedCityName} Nöbetçi Eczaneler` : "Nöbetçi Eczaneler"}
                                </h2>
                                {!isLoading && pharmacies.length > 0 && (
                                    <span className="text-xs text-dark-500 font-medium whitespace-nowrap">{pharmacies.length} sonuç</span>
                                )}
                            </div>
                        </div>
                        {error && (
                            <div className="mx-4 mt-3 bg-red-950/50 text-red-400 text-xs rounded-lg px-4 py-3 border border-red-800/30 shrink-0">
                                {error}
                            </div>
                        )}
                        <div className="flex-1 overflow-y-auto p-4 min-h-0 overscroll-contain" style={{ touchAction: "pan-y" }}>
                            <PharmacyList pharmacies={pharmacies} isLoading={isLoading} activePharmacy={activePharmacy} onSelect={setActivePharmacy} onRequestLocation={handleLocationRequest} />
                        </div>
                    </div>
                </div>
            </div>

            {/* SEO Bileşenleri EN ALTTA (Toggle ile) */}
            <div className="shrink-0 bg-dark-900 border-t border-dark-800 relative z-[5]">
                {(selectedCitySlug || detectedCityName) && (
                    <div className="xl:container mx-auto">
                        <button
                            onClick={() => setIsSeoVisible(!isSeoVisible)}
                            className="w-full py-2.5 flex items-center justify-center gap-2 text-[11px] lg:text-xs font-semibold text-dark-400 hover:text-dark-200 bg-dark-800/30 hover:bg-dark-800 transition-colors"
                        >
                            <span>{isSeoVisible ? "Şehir Bilgilerini Gizle (Haritayı Büyüt)" : "Şehir Hakkında SEO Bilgilerini Göster"}</span>
                            <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isSeoVisible ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isSeoVisible ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"}`}>
                            <div className="px-4 pb-4 lg:px-6 pt-2">
                                <Breadcrumb
                                    items={[
                                        { name: detectedCityName || initialCityName || selectedCitySlug, path: `/${selectedCitySlug}/nobetci` },
                                        ...(selectedDistrictSlug ? [{ name: selectedDistrictName || initialDistrictName || selectedDistrictSlug, path: `/${selectedCitySlug}/${selectedDistrictSlug}/nobetci` }] : [])
                                    ]}
                                />
                                <div className="mt-3">
                                    <CityContent
                                        cityName={detectedCityName || initialCityName || selectedCitySlug}
                                        districtName={selectedDistrictName || initialDistrictName || selectedDistrictSlug}
                                        pharmacyCount={pharmacies.length}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
