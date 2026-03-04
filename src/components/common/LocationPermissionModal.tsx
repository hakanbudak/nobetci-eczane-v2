"use client";

interface LocationPermissionModalProps {
    onAllow: () => void;
    onDeny: () => void;
}

export default function LocationPermissionModal({ onAllow, onDeny }: LocationPermissionModalProps) {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <div className="bg-dark-800 border border-dark-600/50 rounded-2xl shadow-2xl max-w-[340px] w-full p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-600/10 border border-primary-500/20 flex items-center justify-center mb-5">
                    <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>

                <h3 className="text-dark-50 font-bold text-base mb-2">Konum Erişimi</h3>
                <p className="text-dark-400 text-sm leading-relaxed mb-6">
                    Size en yakın nöbetçi eczaneleri gösterebilmemiz için konum bilginize ihtiyacımız var.
                </p>

                <div className="flex gap-3 w-full">
                    <button
                        onClick={onAllow}
                        className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm py-3 rounded-xl transition-colors shadow-lg shadow-primary-500/20"
                    >
                        İzin Ver
                    </button>
                    <button
                        onClick={onDeny}
                        className="flex-1 bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-dark-200 font-semibold text-sm py-3 rounded-xl border border-dark-600/50 transition-colors"
                    >
                        Hayır
                    </button>
                </div>
            </div>
        </div>
    );
}
