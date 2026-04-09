const BASE_URL = "https://eczanebul.co";

export function WebsiteSchema() {
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "EczaneBul — Nöbetçi Eczane",
        "alternateName": "Nöbetçi Eczane",
        "url": BASE_URL,
        "description": "Türkiye genelinde güncel nöbetçi eczane listesi. Harita üzerinden en yakın nöbetçi eczaneyi bulun.",
        "inLanguage": "tr-TR",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${BASE_URL}/{search_term_string}/nobetci`,
            },
            "query-input": "required name=search_term_string",
        },
    };

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "EczaneBul",
        "url": BASE_URL,
        "logo": {
            "@type": "ImageObject",
            "url": `${BASE_URL}/icon.png`,
            "width": 192,
            "height": 192,
        },
        "description": "Türkiye'nin en hızlı nöbetçi eczane bulma platformu. 81 ilde güncel nöbet listeleri, harita ve yol tarifi.",
        "foundingDate": "2024",
        "areaServed": {
            "@type": "Country",
            "name": "Turkey",
        },
        "sameAs": [
            "https://twitter.com/eczanebul",
            "https://instagram.com/eczanebul",
            "https://facebook.com/eczanebul",
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
        </>
    );
}
