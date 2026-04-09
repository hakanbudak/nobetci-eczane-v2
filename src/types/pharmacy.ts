export interface Coordinates {
    lat: number;
    lng: number;
}

export interface Pharmacy {
    id?: number;
    name: string;
    district: string;
    address: string;
    phone: string;
    phone2?: string | null;
    location: Coordinates;
    distance?: number;
    googleMapsUrl?: string;
    neighborhood?: string | null;
    dutyNote?: string | null;
}

export interface PharmlushPharmacy {
    id: number;
    name: string;
    address: string;
    phone: string;
    province: string;
    district: string;
    neighborhood: string | null;
    latitude: string;
    longitude: string;
    has_coordinates: boolean;
    google_maps_url: string;
    distance_km: number | null;
}

export interface PharmlushDutyItem {
    id: number;
    date: string;
    duty_start_time: string | null;
    duty_end_time: string | null;
    duty_note: string | null;
    pharmacy: PharmlushPharmacy;
    source: {
        chamber_name: string;
        slug: string;
    };
}

export interface PharmlushResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PharmlushDutyItem[];
}

export interface City {
    name: string;
    slug: string;
    plateCode: number;
    districts: District[];
}

export interface District {
    name: string;
    slug: string;
}

export type LocationStatus = "idle" | "requesting" | "granted" | "denied" | "unavailable";
