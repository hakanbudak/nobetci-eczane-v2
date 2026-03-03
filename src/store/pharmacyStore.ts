import { create } from "zustand";
import type { Pharmacy, Coordinates, LocationStatus } from "@/types/pharmacy";

interface PharmacyState {
    pharmacies: Pharmacy[];
    activePharmacy: Pharmacy | null;
    isLoading: boolean;
    error: string | null;
    selectedCitySlug: string;
    selectedDistrictSlug: string;
    selectedDistrictName: string;
    detectedCityName: string;
    coordinates: Coordinates | null;
    locationStatus: LocationStatus;
    isListVisible: boolean;

    setPharmacies: (pharmacies: Pharmacy[]) => void;
    setActivePharmacy: (pharmacy: Pharmacy | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setSelectedCity: (slug: string) => void;
    setSelectedDistrict: (slug: string, name: string) => void;
    setDetectedCityName: (name: string) => void;
    setCoordinates: (coords: Coordinates | null) => void;
    setLocationStatus: (status: LocationStatus) => void;
    setListVisible: (visible: boolean) => void;
    clearSelection: () => void;
}

export const usePharmacyStore = create<PharmacyState>((set) => ({
    pharmacies: [],
    activePharmacy: null,
    isLoading: false,
    error: null,
    selectedCitySlug: "",
    selectedDistrictSlug: "",
    selectedDistrictName: "",
    detectedCityName: "",
    coordinates: null,
    locationStatus: "idle",
    isListVisible: true,

    setPharmacies: (pharmacies) => set({ pharmacies }),
    setActivePharmacy: (pharmacy) => set({ activePharmacy: pharmacy }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    setSelectedCity: (slug) =>
        set({ selectedCitySlug: slug, selectedDistrictSlug: "", selectedDistrictName: "" }),
    setSelectedDistrict: (slug, name) =>
        set({ selectedDistrictSlug: slug, selectedDistrictName: name }),
    setDetectedCityName: (name) => set({ detectedCityName: name }),
    setCoordinates: (coordinates) => set({ coordinates }),
    setLocationStatus: (locationStatus) => set({ locationStatus }),
    setListVisible: (isListVisible) => set({ isListVisible }),
    clearSelection: () =>
        set({
            selectedCitySlug: "",
            selectedDistrictSlug: "",
            selectedDistrictName: "",
            detectedCityName: "",
            pharmacies: [],
            error: null,
        }),
}));
