"use client";

import Image from "next/image";

interface LocationPermissionModalProps {
    onAllow: () => void;
    onDeny: () => void;
}

export default function LocationPermissionModal({ onAllow, onDeny }: LocationPermissionModalProps) {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
                <div className="mb-6">
                    <Image
                        src="/location-permission.png"
                        alt="Konum izni"
                        width={180}
                        height={180}
                        priority
                    />
                </div>

                <p className="text-slate-700 text-base leading-relaxed font-medium mb-8">
                    Uygulamamız size en iyi hizmeti sağlamak için konum bilgilerinize erişmek istiyor. İzin veriyor musunuz?
                </p>

                <div className="flex gap-4 w-full">
                    <button
                        onClick={onAllow}
                        className="flex-1 bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-bold text-lg py-3.5 rounded-2xl transition-colors shadow-lg"
                    >
                        EVET
                    </button>
                    <button
                        onClick={onDeny}
                        className="flex-1 bg-white hover:bg-slate-50 text-[#1e3a5f] font-bold text-lg py-3.5 rounded-2xl border-2 border-[#1e3a5f]/30 transition-colors"
                    >
                        HAYIR
                    </button>
                </div>
            </div>
        </div>
    );
}
