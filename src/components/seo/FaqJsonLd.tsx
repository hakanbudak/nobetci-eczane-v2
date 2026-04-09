interface FaqItem {
    question: string;
    answer: string;
}

interface FaqJsonLdProps {
    items: FaqItem[];
}

export function FaqJsonLd({ items }: FaqJsonLdProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": items.map((item) => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer,
            },
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// Şehir sayfaları için hazır FAQ soruları
export function buildCityFaqs(cityName: string, pharmacyCount: number): FaqItem[] {
    return [
        {
            question: `${cityName}'da nöbetçi eczane nasıl bulunur?`,
            answer: `${cityName} nöbetçi eczanelerini bulmak için eczanebul.co'yu kullanabilirsiniz. Harita üzerinden en yakın nöbetçi eczaneyi görebilir, adres ve telefon bilgilerine ulaşabilirsiniz.`,
        },
        {
            question: `${cityName}'da bugün kaç nöbetçi eczane var?`,
            answer: pharmacyCount > 0
                ? `Bugün ${cityName}'da ${pharmacyCount} nöbetçi eczane bulunmaktadır. Liste gün içinde güncel tutulmaktadır.`
                : `${cityName}'daki güncel nöbetçi eczane sayısına eczanebul.co üzerinden ulaşabilirsiniz.`,
        },
        {
            question: `Nöbetçi eczane saat kaçta açılır, kaçta kapanır?`,
            answer: `Nöbetçi eczaneler genellikle hafta içi saat 19:00'dan itibaren ve hafta sonları ile resmi tatillerde gün boyu açık kalır. Bazı eczaneler 24 saat hizmet verebilir. Kesin saatler için ilgili eczaneyi araymanız önerilir.`,
        },
        {
            question: `Nöbetçi eczanede reçeteli ilaç alınabilir mi?`,
            answer: `Evet, nöbetçi eczaneler reçeteli ilaçları karşılamaktadır. Acil durumlarda e-reçete veya kâğıt reçetenizle nöbetçi eczaneden ilaç temin edebilirsiniz.`,
        },
    ];
}

// İlçe sayfaları için hazır FAQ soruları
export function buildDistrictFaqs(cityName: string, districtName: string, pharmacyCount: number): FaqItem[] {
    return [
        {
            question: `${districtName}'da nöbetçi eczane nerede?`,
            answer: `${cityName} ${districtName} nöbetçi eczanelerini eczanebul.co'da harita üzerinde görebilirsiniz. Adres, telefon numarası ve yol tarifi bilgilerine anında ulaşabilirsiniz.`,
        },
        {
            question: `${districtName}'da bugün kaç nöbetçi eczane açık?`,
            answer: pharmacyCount > 0
                ? `Bugün ${districtName}'da ${pharmacyCount} nöbetçi eczane hizmet vermektedir.`
                : `${districtName}'daki güncel nöbetçi eczane bilgilerine eczanebul.co üzerinden ulaşabilirsiniz.`,
        },
        {
            question: `${districtName} nöbetçi eczane telefon numarasına nasıl ulaşırım?`,
            answer: `eczanebul.co'da ${districtName} nöbetçi eczaneleri listelenirken her eczanenin telefon numarası da gösterilmektedir. Telefon numarasına tıklayarak doğrudan arayabilirsiniz.`,
        },
        {
            question: `${cityName} ${districtName}'da gece açık eczane var mı?`,
            answer: `Nöbetçi eczaneler gece saatlerinde de hizmet vermektedir. ${districtName} gece açık eczanelerini eczanebul.co haritasında bulabilir, yol tarifi alabilirsiniz.`,
        },
    ];
}
