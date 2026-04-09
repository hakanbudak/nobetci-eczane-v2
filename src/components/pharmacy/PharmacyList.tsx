"use client";

import type { Pharmacy } from "@/types/pharmacy";
import PharmacyCard from "./PharmacyCard";

interface PharmacyListProps {
    pharmacies: Pharmacy[];
    isLoading: boolean;
    activePharmacy: Pharmacy | null;
    onSelect: (pharmacy: Pharmacy) => void;
    onRequestLocation?: () => void;
    districtRequired?: boolean;
    districtName?: string;
    citySlug?: string;
    districtSlug?: string;
}

export default function PharmacyList({ pharmacies, isLoading, activePharmacy, onSelect, onRequestLocation, districtRequired, districtName, citySlug, districtSlug }: PharmacyListProps) {
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
        if (districtRequired) {
            return (
                <div className="flex flex-col items-center justify-center p-4 lg:p-8 text-center min-h-[220px]">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-primary-500/10 rounded-2xl flex items-center justify-center mb-4 lg:mb-6 border border-primary-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
                        <span className="text-3xl lg:text-4xl">🏙️</span>
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold text-dark-100 mb-2">İlçe Seçin</h3>
                    <p className="text-xs lg:text-base text-dark-400 max-w-[300px]">
                        Bu şehirde hızlı sonuç için yukarıdan bir ilçe seçin.
                    </p>
                </div>
            );
        }

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

    const handleShareList = () => {
        const MAX_SHOWN = 5;
        const shown = pharmacies.slice(0, MAX_SHOWN);

        const entries = shown.map((p, i) =>
            `*${i + 1}. ${p.name.toUpperCase()}*\n📞 ${p.phone || "-"}\n📍 ${p.address}`
        ).join("\n\n");

        const header = districtName
            ? `🏥 *${districtName} Nöbetçi Eczaneler*`
            : `🏥 *Nöbetçi Eczaneler*`;

        const footer = pharmacies.length > MAX_SHOWN
            ? `_...ve ${pharmacies.length - MAX_SHOWN} eczane daha_\nTümü için: eczanebul.co`
            : `_eczanebul.co_`;

        const text = `${header}\n\n${entries}\n\n${footer}`;

        if (navigator.share) {
            navigator.share({ text }).catch(() => {});
        } else {
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <div>
            <div className="sticky z-10 flex items-center justify-between px-1 py-2 mb-1 bg-dark-900 border-b border-dark-700/40">
                <span className="text-[11px] text-dark-400">{pharmacies.length} nöbetçi eczane</span>
                <button
                    onClick={handleShareList}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white transition-all hover:brightness-110 active:scale-95 shadow-sm"
                    style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}
                >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.413A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm4.93 13.643c-.207.581-1.22 1.113-1.676 1.176-.456.063-.883.302-2.97-.618-2.52-1.115-4.14-3.668-4.265-3.836-.127-.168-1.03-1.37-1.03-2.613 0-1.243.65-1.855.88-2.11.23-.254.5-.318.667-.318.166 0 .333 0 .48.009.153.008.36-.058.563.43.207.5.703 1.724.764 1.85.062.127.103.276.02.444-.082.168-.124.272-.248.42-.124.147-.26.328-.372.44-.124.124-.253.258-.109.506.145.248.644 1.063 1.382 1.721.951.847 1.753 1.11 2.001 1.234.249.124.394.104.54-.062.145-.166.622-.727.788-.977.166-.249.332-.207.56-.124.229.082 1.452.684 1.7.808.248.124.414.186.476.29.062.103.062.597-.145 1.178z"/>
                    </svg>
                    Listeyi Paylaş
                </button>
            </div>
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
                        citySlug={citySlug}
                        districtSlug={districtSlug}
                    />
                ))}
            </div>
        </div>
    );
}
