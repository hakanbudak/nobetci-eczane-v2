export const citySlug = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
};

export const generateCanonicalUrl = (path: string): string => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nobetcieczane.com';
    return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};
