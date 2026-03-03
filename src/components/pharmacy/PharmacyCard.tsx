"use client";

import type { Pharmacy } from "@/types/pharmacy";
import { formatDistance } from "@/utils/distance";
import { useMemo } from "react";

interface PharmacyCardProps {
    pharmacy: Pharmacy;
    isActive: boolean;
    isNearest: boolean;
    onSelect: () => void;
}

export default function PharmacyCard({ pharmacy, isActive, isNearest, onSelect }: PharmacyCardProps) {
    const distanceStatus = useMemo(() => {
        const dist = pharmacy.distance;
        if (dist === undefined) return "neutral";
        if (isNearest || dist < 1.0) return "closest";
        if (dist < 3.0) return "close";
        return "neutral";
    }, [pharmacy.distance, isNearest]);

    const colorClasses = useMemo(() => {
        switch (distanceStatus) {
            case "closest":
                return {
                    border: "border-green-500/30 hover:border-green-500/50",
                    bg: "bg-dark-800",
                    badge: "bg-green-500/10 text-green-400 border-green-500/20",
                    activeBorder: "border-green-500 ring-1 ring-green-500/20",
                };
            case "close":
                return {
                    border: "border-amber-500/30 hover:border-amber-500/50",
                    bg: "bg-dark-800",
                    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                    activeBorder: "border-amber-500 ring-1 ring-amber-500/20",
                };
            default:
                return {
                    border: "border-dark-700/50 hover:border-primary-500/40",
                    bg: "bg-dark-800",
                    badge: "bg-dark-700 text-dark-300",
                    activeBorder: "border-primary-500/60 ring-1 ring-primary-500/20",
                };
        }
    }, [distanceStatus]);

    return (
        <div
            className={`rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-dark-750 border relative overflow-hidden ${isActive ? colorClasses.activeBorder : colorClasses.border
                } ${colorClasses.bg}`}
            onClick={onSelect}
        >
            {distanceStatus === "closest" && (
                <div className="absolute top-0 right-0 bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg border-b border-l border-green-500/20">
                    En Yakın
                </div>
            )}

            <div className="flex items-start gap-3 mb-3">
                <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm shrink-0 mt-0.5 bg-[#FF0000] text-white border border-white"
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                >
                    E
                </div>
                <div className="flex-1 min-w-0 pr-12">
                    <h3 className="font-bold text-dark-50 text-sm leading-tight truncate">{pharmacy.name}</h3>
                    <p className="text-xs text-dark-400 leading-relaxed mt-1 line-clamp-1">{pharmacy.address}</p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                {pharmacy.distance != null && (
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md border ${colorClasses.badge}`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {formatDistance(pharmacy.distance)}
                    </span>
                )}
                {pharmacy.district && (
                    <span className="text-xs px-2 py-0.5 rounded-md bg-dark-700/60 text-dark-400 border border-dark-600/30">
                        {pharmacy.district}
                    </span>
                )}
            </div>

            {pharmacy.phone && (
                <div className="flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-dark-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
                    </svg>
                    <a
                        href={`tel:${pharmacy.phone}`}
                        className="text-xs text-primary-400 hover:text-primary-300 font-medium transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {pharmacy.phone}
                    </a>
                </div>
            )}
        </div>
    );
}
