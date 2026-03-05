import Link from "next/link";
import { generateCanonicalUrl } from "@/utils/seoHelpers";

interface BreadcrumbItem {
    name: string;
    path: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": generateCanonicalUrl(item.path),
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <nav aria-label="Breadcrumb" className="px-4 py-2 mt-2 max-w-[1920px] mx-auto z-50">
                <ol className="flex items-center gap-2 text-xs text-dark-400">
                    <li>
                        <Link href="/" className="hover:text-primary-400 transition-colors">Ana Sayfa</Link>
                    </li>
                    {items.map((item, index) => {
                        const isLast = index === items.length - 1;
                        return (
                            <li key={item.path} className="flex items-center gap-2">
                                <span className="text-dark-600">/</span>
                                {isLast ? (
                                    <span className="text-dark-200 font-medium" aria-current="page">
                                        {item.name}
                                    </span>
                                ) : (
                                    <Link href={item.path} className="hover:text-primary-400 transition-colors">
                                        {item.name}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </>
    );
}
