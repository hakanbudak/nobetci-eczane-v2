import type { MetadataRoute } from "next";
import { generateCanonicalUrl } from "@/utils/seoHelpers";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/_next/"],
        },
        sitemap: generateCanonicalUrl("sitemap.xml"),
    };
}
