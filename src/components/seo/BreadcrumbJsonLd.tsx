import { generateCanonicalUrl } from "@/utils/seoHelpers";

interface BreadcrumbItem {
    name: string;
    path: string;
}

interface BreadcrumbJsonLdProps {
    items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
    const allItems = [{ name: "Ana Sayfa", path: "/" }, ...items];

    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": allItems.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": generateCanonicalUrl(item.path),
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
