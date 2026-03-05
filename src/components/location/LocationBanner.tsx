"use client";

import { useState, useEffect } from "react";

interface LocationBannerProps {
    status: string;
    onRequest: () => void;
}

export default function LocationBanner({ status, onRequest }: LocationBannerProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // SSR hatası almamak için sadece client-side değerlendir
        try {
            const hasSeen = localStorage.getItem("nobetci_location_banner_seen");
            const permission = localStorage.getItem("locationPermission");

            // Eğer daha önceden reddettiyse, X'e bastıysa veya zaten izinliyse gösterme
            if (!hasSeen && status !== "granted" && status !== "denied" && permission !== "granted" && permission !== "denied") {
                // Hafif bir gecikme ekleyerek sayfa yüklenir yüklenmez patlamasını engelle
                const timer = setTimeout(() => setIsVisible(true), 1500);
                return () => clearTimeout(timer);
            }
        } catch {
            // localStorage engellenmişse / hata verdiyse 
        }
    }, [status]);

    const handleClose = () => {
        setIsVisible(false);
        try {
            localStorage.setItem("nobetci_location_banner_seen", "true");
        } catch {
            // ignore
        }
    };

    const handleAllow = () => {
        onRequest();
        // İstek tetiklendikten sonra görünmez yapmıyoruz, `status` güncellenince kapanacak
    };

    if (!mounted || !isVisible) return null;

    return (
        <div className="relative shrink-0 w-full z-[9999] bg-gradient-to-r from-primary-600 to-red-700 text-white shadow-md animate-in fade-in slide-in-from-top-full duration-500">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between min-h-[50px] md:min-h-[46px] py-2 gap-3">

                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <span className="text-xl md:text-lg shrink-0 animate-bounce">📍</span>
                        <p className="text-[13px] md:text-sm font-medium leading-snug truncate">
                            <span className="md:hidden">Sana en yakın eczaneleri gösterelim</span>
                            <span className="hidden md:inline">Sana en yakın nöbetçi eczaneleri hemen bulmak ister misin?</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={handleAllow}
                            className="bg-white/10 hover:bg-white/20 text-white text-xs md:text-sm font-bold px-3 py-1.5 md:px-4 md:py-1.5 rounded-lg border border-white/20 transition-all active:scale-95 whitespace-nowrap"
                        >
                            İzin Ver
                        </button>
                        <button
                            onClick={handleClose}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors"
                            aria-label="Kapat"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
