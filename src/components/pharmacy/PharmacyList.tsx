"use client";

import type { Pharmacy } from "@/types/pharmacy";
import PharmacyCard from "./PharmacyCard";

interface PharmacyListProps {
    pharmacies: Pharmacy[];
    isLoading: boolean;
    activePharmacy: Pharmacy | null;
    onSelect: (pharmacy: Pharmacy) => void;
    onRequestLocation?: () => void;
}

export default function PharmacyList({ pharmacies, isLoading, activePharmacy, onSelect, onRequestLocation }: PharmacyListProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-1">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-dark-800 border border-dark-700/50 rounded-xl p-4">
                        <div className="flex items-start gap-3 mb-3">
                            <div className="skeleton w-9 h-9 rounded-lg shrink-0" />
                            <div className="skeleton h-4 w-3/4 rounded" />
                        </div>
                        <div className="flex gap-2 mb-2.5">
                            <div className="skeleton h-5 w-20 rounded-md" />
                            <div className="skeleton h-5 w-14 rounded-md" />
                        </div>
                        <div className="skeleton h-3 w-full rounded mb-1.5" />
                        <div className="skeleton h-3 w-2/3 rounded mb-3" />
                        <div className="skeleton h-3 w-1/2 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    if (pharmacies.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-4 lg:p-8 text-center min-h-[220px]">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-primary-500/10 rounded-2xl flex items-center justify-center mb-4 lg:mb-6 border border-primary-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)] relative">
                    <span className="text-3xl lg:text-4xl relative z-10 animate-bounce">📍</span>
                    <div className="absolute inset-0 bg-primary-500/20 rounded-2xl animate-ping opacity-75" style={{ animationDuration: '3s' }}></div>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-dark-100 mb-2">Sana En Yakın Nöbetçi Eczaneler</h3>
                <p className="text-xs lg:text-base text-dark-400 mb-6 lg:mb-8 max-w-[300px]">
                    Acil nöbetçi eczaneleri görmek için konum erişimine izin verin veya yukarıdan şehrinizi seçin.
                </p>

                {onRequestLocation && (
                    <button
                        onClick={onRequestLocation}
                        className="w-full max-w-[280px] cursor-pointer flex items-center justify-center gap-2.5 bg-primary-600 hover:bg-primary-500 text-white font-semibold py-3 lg:py-3.5 px-6 rounded-xl transition-all active:scale-[0.98] shadow-[0_4px_20px_rgba(239,68,68,0.3)] hover:shadow-[0_4px_25px_rgba(239,68,68,0.4)]"
                    >
                        <svg className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm lg:text-base">Konumumu Kullanarak Bul</span>
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-1">
            {pharmacies.map((pharmacy, index) => (
                <PharmacyCard
                    key={`${pharmacy.name}__${pharmacy.address}`}
                    pharmacy={pharmacy}
                    isActive={
                        activePharmacy?.name === pharmacy.name &&
                        activePharmacy?.address === pharmacy.address
                    }
                    isNearest={index === 0 && pharmacy.distance != null}
                    onSelect={() => onSelect(pharmacy)}
                />
            ))}
        </div>
    );
}
