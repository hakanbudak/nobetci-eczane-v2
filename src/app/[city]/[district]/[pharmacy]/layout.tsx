export default function PharmacyDetailLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* globals.css'deki overflow:hidden'ı sadece bu route için override et */}
            <style>{`html, body { overflow: auto !important; height: auto !important; }`}</style>
            {children}
        </>
    );
}
