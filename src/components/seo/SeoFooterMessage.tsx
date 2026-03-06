import Link from "next/link";
import React from "react";

interface SeoFooterMessageProps {
    cityName?: string;
    districtName?: string;
    pharmacyCount?: number;
    selectedCitySlug?: string;
    selectedDistrictSlug?: string;
}

export default function SeoFooterMessage({
    cityName,
    districtName,
    pharmacyCount,
    selectedCitySlug,
    selectedDistrictSlug
}: SeoFooterMessageProps) {
    const displayCity = cityName || "Türkiye";
    const displayTitle = districtName
        ? `${cityName} ${districtName} Nöbetçi Eczaneleri`
        : `${displayCity} Nöbetçi Eczaneleri`;

    return (
        <div className="w-full bg-dark-950 border-t border-dark-800 text-dark-300 py-10 px-4 mt-0 shrink-0 max-h-[75vh] md:max-h-[80vh] overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-8 text-sm leading-relaxed">
                <header>
                    <h1 className="text-xl md:text-3xl font-black text-dark-100 mb-6 tracking-tight">
                        {displayTitle}
                    </h1>
                </header>

                <section className="space-y-4">
                    <p>
                        {displayCity} genelindeki tüm il ve ilçelerdeki güncel <strong>nöbetçi eczane listesi</strong>ne harita üzerinden anında
                        ulaşabilirsiniz. Acil ilaç veya tıbbi malzeme ihtiyacınız olduğunda harita teknolojimiz sayesinde
                        konumunuza en yakın açık eczaneleri saniyeler içinde tespit edebilirsiniz. Güvenilir ve hızlı
                        altyapımızla <Link href="/istanbul/nobetci" className="text-primary-400 hover:text-primary-300 underline underline-offset-2">İstanbul nöbetçi eczaneleri</Link>, <Link href="/ankara/nobetci" className="text-primary-400 hover:text-primary-300 underline underline-offset-2">Ankara nöbetçi eczaneleri</Link> ve <Link href="/izmir/nobetci" className="text-primary-400 hover:text-primary-300 underline underline-offset-2">İzmir nöbetçi eczaneleri</Link> başta olmak üzere 81 ildeki sonuçlara anında ulaşın. Eczanelerin adres, telefon
                        numarası ve kesin konumlarına ulaşarak Google Haritalar üzerinden direkt olarak yol tarifi alabilirsiniz.
                    </p>

                    <p>
                        <strong>Nöbetçi Eczane Sistemi Nasıl Çalışır?</strong> Normal çalışma saatleri dışında (genellikle hafta içi 19:00'dan sonra) veya resmi tatil / pazar
                        günlerinde hizmet vermeye devam eden eczanelere "nöbetçi" denilmektedir. Sağlık problemlerinin zamanı
                        olmadığı için en acil ihtiyaç anında yanı başınızdaki sağlık destekçisini bulmak büyük önem taşır. Bu
                        platformdaki nöbet bilgileri anlık veritabanlarından çekilmekte olup eczanelerin rotalarını, nöbet
                        saatlerini ve hangi saat dilimleri aralığında görevde olduklarını doğru bir şekilde listelemeyi hedefler.
                    </p>
                </section>

                <section className="space-y-4 bg-dark-900/50 p-6 rounded-2xl border border-dark-800">
                    <h2 className="text-lg font-bold text-dark-100 italic underline decoration-primary-500/50">Kapsamlı Eczane Rehberi ve Kullanım İpuçları</h2>
                    <p>
                        Sitemiz üzerinden arama yaparken <strong>"En Yakın Eczaneyi Bul"</strong> özelliğini kullanmanız, acil durumlarda size dakikalar kazandıracaktır.
                        Özellikle gece saatlerinde ilaç temini yaparken, gitmek istediğiniz eczaneyi gitmeden önce sitemizdeki <strong>"Ara"</strong> butonu yardımıyla
                        telefonla aramanız tavsiye edilir. Nadir bulunan ilaçlar veya özel tıbbi cihazlar için stok durumunu sormak, zaman kaybının önüne geçer.
                        Harita üzerindeki <strong>"Yol Tarifi"</strong> butonu; konumunuzu otomatik algılayarak sizi en kısa trafik rotasıyla eczaneye ulaştırır.
                    </p>
                    <p>
                        Nöbetçi eczaneler, 6197 sayılı Eczacılar ve Eczaneler Hakkında Kanun uyarınca hizmet vermektedir. Bu eczaneler sadece ilaç temini değil,
                        aynı zamanda acil durumlarda ilk danışmanlık hizmetini de sunarlar. Belirlenen nöbet listeleri, bölge eczacı odaları tarafından
                        aylık veya haftalık olarak duyurulur ve denetlenir. Bizim platformumuz bu verileri dijitalleştirerek size en kullanıcı dostu
                        şekilde sunmayı amaçlar.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-lg font-bold text-dark-100">Güvenilir Bilgi & Doğrulanmış Kaynaklar</h2>
                    <p>
                        Sistemimizdeki tüm harita, veri ve listeler periyodik aralıklarla kontrol edilir. Daha kesin tıbbi konular, eczane çalışma prensipleri ve mevzuatlar hakkında detaylı bilgiler için <a href="https://www.saglik.gov.tr/" target="_blank" rel="noopener nofollow external" className="text-primary-400 hover:text-primary-300 border-b border-primary-500/30 border-dashed">T.C. Sağlık Bakanlığı</a> veya <a href="https://www.teb.org.tr/" target="_blank" rel="noopener nofollow external" className="text-primary-400 hover:text-primary-300 border-b border-primary-500/30 border-dashed">Türk Eczacıları Birliği (TEB)</a> resmi web sitelerini ziyaret edebilirsiniz. Ayrıca e-Devlet kapısı üzerinden sunulan sağlık hizmetlerini incelemek için <a href="https://www.turkiye.gov.tr/saglik-bakanligi" target="_blank" rel="noopener nofollow external" className="text-primary-400 hover:text-primary-300 border-b border-primary-500/30 border-dashed">e-Devlet Sağlık Hizmetleri</a> sayfasından da kamu güvencesiyle faydalanabilirsiniz.
                    </p>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="bg-dark-900/40 p-5 rounded-xl border border-dark-800">
                        <h3 className="font-bold text-primary-400 mb-2 whitespace-nowrap">Gece Açık Eczanelerin Görevleri</h3>
                        <ul className="list-disc list-inside space-y-1 text-xs text-dark-400">
                            <li>Reçeteli ilaçların kesintisiz temini</li>
                            <li>Tıbbi danışmanlık ve acil ilaç desteği</li>
                            <li>Bebek maması ve temel hijyen malzemeleri</li>
                            <li>Resmi tatil ve bayramlarda hizmet devamlılığı</li>
                        </ul>
                    </div>
                    <div className="bg-dark-900/40 p-5 rounded-xl border border-dark-800">
                        <h3 className="font-bold text-primary-400 mb-2 whitespace-nowrap">Neden Bizim Haritamız?</h3>
                        <p className="text-xs text-dark-400">
                            Sade arayüz, yüksek hız ve doğruluk odaklı sistemimizle hiçbir reklam veya karmaşa ile karşılaşmadan
                            hedefinize ulaşırsınız. Mobil uyumlu tasarımı sayesinde telefonunuzdan tek dokunuşla eczaneyi
                            bulabilir ve hemen yola çıkabilirsiniz.
                        </p>
                    </div>
                </section>

                <p className="border-l-4 border-primary-500/50 pl-4 py-2 bg-dark-900/20 italic">
                    Hastalık ve tedavi süreçlerinizde gecikmelere yer bırakmamak adına konum hizmetlerinizi etkinleştirerek
                    "Sana En Yakın Eczaneler" modülünü kullanmanızı öneririz. Amacımız, Türkiye'nin neresinde olursanız olun
                    sağlığa ve güvene ulaşmanızı en kısa yoldan sağlamaktır.
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-10 mt-10 border-t border-dark-800">
                    <p className="text-xs text-dark-500 font-medium">
                        &copy; {new Date().getFullYear()} EczaneBul.co - Türkiye'nin En Hızlı Nöbetçi Eczane Sistemi.
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="https://twitter.com/eczanebul" target="_blank" rel="noopener nofollow" className="text-dark-400 hover:text-primary-400 transition-all hover:scale-110 p-2 lg:p-0" aria-label="Twitter">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                        </a>
                        <a href="https://instagram.com/eczanebul" target="_blank" rel="noopener nofollow" className="text-dark-400 hover:text-pink-500 transition-all hover:scale-110 p-2 lg:p-0" aria-label="Instagram">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                        </a>
                        <a href="https://facebook.com/eczanebul" target="_blank" rel="noopener nofollow" className="text-dark-400 hover:text-blue-500 transition-all hover:scale-110 p-2 lg:p-0" aria-label="Facebook">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
