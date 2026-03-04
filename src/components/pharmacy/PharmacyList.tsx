"use client";

import type { Pharmacy } from "@/types/pharmacy";
import PharmacyCard from "./PharmacyCard";

interface PharmacyListProps {
    pharmacies: Pharmacy[];
    isLoading: boolean;
    activePharmacy: Pharmacy | null;
    onSelect: (pharmacy: Pharmacy) => void;
}

export default function PharmacyList({ pharmacies, isLoading, activePharmacy, onSelect }: PharmacyListProps) {
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
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-16 h-16 bg-dark-800 rounded-2xl flex items-center justify-center mb-4 border border-dark-700/50">
                    <span className="text-2xl">💊</span>
                </div>
                <p className="text-sm font-medium text-dark-300 mb-1">Nöbetçi eczane bulunamadı</p>
                <p className="text-xs text-dark-500">Konumunuz alındığında en yakın eczaneler burada görünecek.</p>
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
