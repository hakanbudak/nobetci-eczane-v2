const TURKISH_CHAR_MAP: Record<string, string> = {
    ç: "c", Ç: "C",
    ğ: "g", Ğ: "G",
    ı: "i", İ: "I",
    ö: "o", Ö: "O",
    ş: "s", Ş: "S",
    ü: "u", Ü: "U",
};

export function replaceTurkishChars(text: string): string {
    return text.replace(/[çÇğĞıİöÖşŞüÜ]/g, (char) => TURKISH_CHAR_MAP[char] || char);
}

export function toSlug(text: string): string {
    return replaceTurkishChars(text)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/[\s]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

export function buildCityRoute(citySlug: string): string {
    return `/${citySlug}/nobetci`;
}

export function buildDistrictRoute(citySlug: string, districtSlug: string): string {
    return `/${citySlug}/${districtSlug}/nobetci`;
}
