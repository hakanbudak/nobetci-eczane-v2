"use client";

import { useCallback, useEffect } from "react";
import { usePharmacyStore } from "@/store/pharmacyStore";
import type { Coordinates, LocationStatus } from "@/types/pharmacy";

export function useGeolocation() {
    const setCoordinates = usePharmacyStore((s) => s.setCoordinates);
    const setLocationStatus = usePharmacyStore((s) => s.setLocationStatus);
    const coordinates = usePharmacyStore((s) => s.coordinates);
    const status = usePharmacyStore((s) => s.locationStatus);

    const requestLocation = useCallback(async (silent = false): Promise<Coordinates | null> => {
        if (typeof window === "undefined" || !navigator.geolocation) {
            setLocationStatus("unavailable");
            return null;
        }

        if (!silent) setLocationStatus("requesting");

        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const coords: Coordinates = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    };
                    setCoordinates(coords);
                    setLocationStatus("granted");
                    resolve(coords);
                },
                () => {
                    setLocationStatus("denied");
                    resolve(null);
                },
                { timeout: 10000, enableHighAccuracy: true }
            );
        });
    }, [setCoordinates, setLocationStatus]);

    return { coordinates, status, requestLocation };
}
