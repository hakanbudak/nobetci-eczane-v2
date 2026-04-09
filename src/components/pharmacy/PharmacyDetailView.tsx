import Link from "next/link";
import type { Pharmacy } from "@/types/pharmacy";
import { pharmacySlug } from "@/utils/seoHelpers";

interface PharmacyDetailViewProps {
    pharmacy: Pharmacy;
    isOnDuty: boolean;
    citySlug: string;
    cityName: string;
    districtSlug: string;
    districtName: string;
    otherPharmacies: Pharmacy[];
}

export default function PharmacyDetailView({
    pharmacy,
    isOnDuty,
    citySlug,
    cityName,
    districtSlug,
    districtName,
    otherPharmacies,
}: PharmacyDetailViewProps) {
    const mapsUrl = pharmacy.location.lat && pharmacy.location.lng
        ? `https://www.google.com/maps?q=${pharmacy.location.lat},${pharmacy.location.lng}`
        : pharmacy.googleMapsUrl;

    return (
        <div className="min-h-screen bg-dark-900 text-dark-100">
            {/* Üst nav */}
            <nav className="bg-dark-800 border-b border-dark-700/50 px-4 py-3">
                <div className="max-w-3xl mx-auto flex items-center gap-3">
                    <Link
                        href={`/${citySlug}/${districtSlug}/nobetci`}
                        className="inline-flex items-center gap-1.5 text-xs text-dark-400 hover:text-primary-400 transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                        {districtName} Nöbetçi Eczaneleri
                    </Link>
                    <span className="text-dark-600">/</span>
                    <span className="text-xs text-dark-300 truncate">{pharmacy.name}</span>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
                {/* Ana kart */}
                <div className="bg-dark-800 rounded-2xl border border-dark-700/50 overflow-hidden">
                    {/* Başlık */}
                    <div className="p-6 border-b border-dark-700/50">
                        <div className="flex items-start gap-4">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shrink-0 bg-[#FF0000] text-white border border-white/80"
                                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                            >
                                E
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <h1 className="text-xl font-black text-dark-50">{pharmacy.name}</h1>
                                    {isOnDuty ? (
                                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/25">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                            Bugün Nöbetçi
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-dark-700 text-dark-400 border border-dark-600/50">
                                            Bugün Nöbetçi Değil
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-dark-400">{districtName}, {cityName}</p>
                            </div>
                        </div>
                    </div>

                    {/* Detaylar */}
                    <div className="divide-y divide-dark-700/40">
                        <div className="px-6 py-4 flex items-start gap-3">
                            <svg className="w-4 h-4 text-dark-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div>
                                <p className="text-xs text-dark-500 mb-0.5">Adres</p>
                                <p className="text-sm text-dark-200">{pharmacy.address}</p>
                                {pharmacy.neighborhood && (
                                    <p className="text-xs text-dark-500 mt-0.5">{pharmacy.neighborhood}</p>
                                )}
                            </div>
                        </div>

                        {pharmacy.phone && (
                            <div className="px-6 py-4 flex items-center gap-3">
                                <svg className="w-4 h-4 text-dark-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
                                </svg>
                                <div>
                                    <p className="text-xs text-dark-500 mb-0.5">Telefon</p>
                                    <a
                                        href={`tel:${pharmacy.phone}`}
                                        className="text-sm font-semibold text-primary-400 hover:text-primary-300 transition-colors"
                                    >
                                        {pharmacy.phone}
                                    </a>
                                </div>
                            </div>
                        )}

                        {pharmacy.dutyNote && (
                            <div className="px-6 py-4 flex items-start gap-3">
                                <svg className="w-4 h-4 text-dark-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className="text-xs text-dark-500 mb-0.5">Nöbet Notu</p>
                                    <p className="text-sm text-dark-300">{pharmacy.dutyNote}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Aksiyon butonları */}
                    {mapsUrl && (
                        <div className="px-6 py-4 bg-dark-800/50">
                            <a
                                href={mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                Google Maps'te Aç
                            </a>
                        </div>
                    )}
                </div>

                {/* Diğer nöbetçi eczaneler */}
                {otherPharmacies.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold text-dark-300 mb-3 px-1">
                            {districtName} Bölgesindeki Diğer Nöbetçi Eczaneler
                        </h2>
                        <div className="space-y-2">
                            {otherPharmacies.slice(0, 6).map((p) => (
                                <Link
                                    key={p.id}
                                    href={`/${citySlug}/${districtSlug}/${pharmacySlug(p.name, p.id!)}`}
                                    className="flex items-center justify-between gap-3 bg-dark-800 hover:bg-dark-750 border border-dark-700/50 hover:border-primary-500/30 rounded-xl px-4 py-3 transition-all group"
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-dark-100 group-hover:text-primary-300 transition-colors truncate">
                                            {p.name}
                                        </p>
                                        <p className="text-xs text-dark-500 truncate mt-0.5">{p.address}</p>
                                    </div>
                                    {p.phone && (
                                        <span className="text-xs text-dark-500 shrink-0">{p.phone}</span>
                                    )}
                                </Link>
                            ))}
                        </div>
                        {otherPharmacies.length > 6 && (
                            <Link
                                href={`/${citySlug}/${districtSlug}/nobetci`}
                                className="mt-3 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border border-dark-700/50 text-xs text-dark-400 hover:text-primary-400 hover:border-primary-500/30 transition-colors"
                            >
                                Tümünü Gör ({otherPharmacies.length} eczane)
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        )}
                    </section>
                )}

                {/* SEO içerik */}
                <section className="text-xs text-dark-500 leading-relaxed space-y-2 pt-2 border-t border-dark-800">
                    <p>
                        <strong className="text-dark-400">{pharmacy.name}</strong>, {cityName} {districtName} ilçesinde hizmet veren bir eczanedir.
                        {isOnDuty
                            ? ` Bugün nöbetçi olan bu eczaneye ${pharmacy.address} adresinden ulaşabilirsiniz.`
                            : ` Bu eczane bugün nöbetçi değil. Yukarıdaki listeden ${districtName} bölgesindeki nöbetçi eczanelere ulaşabilirsiniz.`
                        }
                    </p>
                    <p>
                        <Link href={`/${citySlug}/${districtSlug}/nobetci`} className="text-primary-500 hover:text-primary-400 underline underline-offset-2">
                            {districtName} nöbetçi eczaneleri
                        </Link>
                        {" "}ve{" "}
                        <Link href={`/${citySlug}/nobetci`} className="text-primary-500 hover:text-primary-400 underline underline-offset-2">
                            {cityName} nöbetçi eczaneleri
                        </Link>
                        {" "}sayfalarından tüm güncel listeye ulaşabilirsiniz.
                    </p>
                </section>
            </main>
        </div>
    );
}
