"use client";

import { useEffect, useState } from "react";
import LocationPermissionModal from "./LocationPermissionModal";
import { findNearestCity } from "@/utils/reverseGeocode";
import { fetchOnDutyPharmacies } from "@/services/pharmacyService";
import { usePharmacyStore } from "@/store/pharmacyStore";
import { useRouter } from "next/navigation";

export default function LocationDetector() {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const status = localStorage.getItem("locationPermission");
        if (!status) setShowModal(true);
    }, []);

    const handleAllow = () => {
        setShowModal(false);
        try {
            localStorage.setItem("locationPermission", "granted");
        } catch { }
        // After allowing, let the user's action trigger location tracking via banner
    };

    const handleDeny = () => {
        setShowModal(false);
        try {
            localStorage.setItem("locationPermission", "denied");
        } catch { }
    };

    return showModal ? <LocationPermissionModal onAllow={handleAllow} onDeny={handleDeny} /> : null;
}
