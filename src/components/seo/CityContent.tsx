interface CityContentProps {
    cityName: string;
    districtName?: string;
    pharmacyCount: number;
}

export function CityContent({ cityName, districtName, pharmacyCount }: CityContentProps) {
    const locationText = districtName ? `${cityName} ${districtName}` : cityName;
    const isDistrict = !!districtName;

    const today = new Date().toLocaleDateString('tr-TR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <article className="px-4 py-4 max-w-[1920px] mx-auto text-dark-200">
            <h1 className="text-xl md:text-2xl font-bold text-dark-100 mb-2">
                {locationText} Nöbetçi Eczaneleri
            </h1>

            <p className="text-sm md:text-base text-dark-300 leading-relaxed mb-4">
                {today} tarihi itibarıyla <strong>{locationText} nöbetçi eczane</strong> listesi aşağıda yer almaktadır.
                Şu an {locationText} genelinde hizmet veren toplam <strong>{pharmacyCount} adet nöbetçi eczane</strong> bulunmaktadır.
                İhtiyacınıza en yakın nöbetçi eczaneyi bulmak için haritayı kullanabilir, yol tarifi alabilir ve doğrudan eczaneyi arayabilirsiniz.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-dark-400 bg-dark-950/50 p-4 rounded-xl border border-dark-800">
                <div>
                    <h2 className="font-semibold text-primary-400 mb-1">Neden Nöbetçi Eczane Arıyoruz?</h2>
                    <p>Mesai saatleri dışında (akşam, gece, hafta sonu ve resmi tatillerde) acil ilaç ve sağlık ürünü ihtiyaçlarınızı karşılamak için {locationText} nöbetçi eczaneleri kesintisiz hizmet vermektedir.</p>
                </div>
                <div>
                    <h2 className="font-semibold text-primary-400 mb-1">{locationText} Eczane Çalışma Saatleri</h2>
                    <p>{isDistrict ? `${districtName} ilçesindeki` : `${cityName} ilindeki`} normal eczaneler hafta içi 08:30 - 19:00 saatleri arası çalışırken, nöbetçi statüsündeki eczaneler ertesi gün sabah 08:30'a kadar kesintisiz açıktır.</p>
                </div>
            </div>

            {/* SEO için gizli semantik kelimeler. Tasarımı bozmaması için sr-only yapılabilir ama Google okunabilir olmasını tercih eder. */}
            <div className="mt-4 text-[10px] text-white flex flex-wrap gap-2">
                <span>Anahtar Kelimeler:</span>
                <span>{locationText.toLowerCase()} acil eczane,</span>
                <span>bugün nöbetçi eczane {locationText.toLowerCase()},</span>
                <span>{locationText.toLowerCase()} açık eczaneler,</span>
                {isDistrict && <span>{cityName.toLowerCase()} {districtName.toLowerCase()} eczane nöbet listesi</span>}
            </div>
        </article>
    );
}
