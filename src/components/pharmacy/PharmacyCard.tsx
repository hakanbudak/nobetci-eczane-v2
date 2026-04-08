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
            className={`rounded-lg p-2.5 cursor-pointer transition-all duration-200 hover:bg-dark-750 border relative overflow-hidden ${isActive ? colorClasses.activeBorder : colorClasses.border
                } ${colorClasses.bg}`}
            onClick={onSelect}
        >
            {distanceStatus === "closest" && (
                <div className="absolute top-0 right-0 bg-green-500/20 text-green-400 text-[9px] font-bold px-1.5 py-px rounded-bl-md border-b border-l border-green-500/20">
                    En Yakın
                </div>
            )}

            <div className="flex items-start gap-2 mb-2">
                <div
                    className="w-7 h-7 rounded-md flex items-center justify-center font-black text-xs shrink-0 mt-0.5 bg-[#FF0000] text-white border border-white/80"
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                >
                    E
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-dark-50 text-xs leading-tight line-clamp-2">{pharmacy.name}</h3>
                    <p className="text-[11px] text-dark-400 leading-snug mt-0.5 line-clamp-2">{pharmacy.address}</p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-1 mb-1.5">
                {pharmacy.distance != null && (
                    <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-px rounded border ${colorClasses.badge}`}>
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {formatDistance(pharmacy.distance)}
                    </span>
                )}
                {pharmacy.district && (
                    <span className="text-[10px] px-1.5 py-px rounded bg-dark-700/60 text-dark-400 border border-dark-600/30">
                        {pharmacy.district}
                    </span>
                )}
            </div>

            {pharmacy.phone && (
                <div className="flex items-center gap-1">
                    <svg className="w-2.5 h-2.5 text-dark-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
                    </svg>
                    <a
                        href={`tel:${pharmacy.phone}`}
                        className="text-[11px] text-primary-400 hover:text-primary-300 font-medium transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {pharmacy.phone}
                    </a>
                </div>
            )}

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    const mapsUrl = pharmacy.location
                        ? `https://www.google.com/maps?q=${pharmacy.location.lat},${pharmacy.location.lng}`
                        : null;
                    const text = [
                        `🏥 *Nöbetçi Eczane*`,
                        ``,
                        `*${pharmacy.name.toUpperCase()}*`,
                        `📍 ${pharmacy.address}`,
                        `📞 ${pharmacy.phone || "-"}`,
                        ...(mapsUrl ? [``, `🗺 ${mapsUrl}`] : []),
                        ``,
                        `_eczanebul.co_`,
                    ].join("\n");

                    if (navigator.share) {
                        navigator.share({ text }).catch(() => {});
                    } else {
                        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
                    }
                }}
                className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-bold text-white transition-all hover:brightness-110 active:scale-95 shadow-sm"
                style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}
            >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.413A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm4.93 13.643c-.207.581-1.22 1.113-1.676 1.176-.456.063-.883.302-2.97-.618-2.52-1.115-4.14-3.668-4.265-3.836-.127-.168-1.03-1.37-1.03-2.613 0-1.243.65-1.855.88-2.11.23-.254.5-.318.667-.318.166 0 .333 0 .48.009.153.008.36-.058.563.43.207.5.703 1.724.764 1.85.062.127.103.276.02.444-.082.168-.124.272-.248.42-.124.147-.26.328-.372.44-.124.124-.253.258-.109.506.145.248.644 1.063 1.382 1.721.951.847 1.753 1.11 2.001 1.234.249.124.394.104.54-.062.145-.166.622-.727.788-.977.166-.249.332-.207.56-.124.229.082 1.452.684 1.7.808.248.124.414.186.476.29.062.103.062.597-.145 1.178z"/>
                </svg>
                Arkadaşına Gönder
            </button>
        </div>
    );
}
