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

export const pharmacySlug = (name: string, id: number): string => {
    const nameSlug = name
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
    return `${nameSlug}-${id}`;
};

export const parsePharmacyId = (slug: string): number | null => {
    const parts = slug.split('-');
    const id = parseInt(parts[parts.length - 1], 10);
    return isNaN(id) ? null : id;
};

export const generateCanonicalUrl = (path: string): string => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eczanebul.co';
    return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};
