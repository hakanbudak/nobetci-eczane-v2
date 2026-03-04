"use client";

import { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Pharmacy, Coordinates } from "@/types/pharmacy";

interface PharmacyMapProps {
    pharmacies: Pharmacy[];
    userLocation: Coordinates | null;
    activePharmacy: Pharmacy | null;
    bottomPadding?: number;
    mapCenterOffset?: number;
    onSelectPharmacy: (pharmacy: Pharmacy) => void;
}

export interface PharmacyMapRef {
    focusOnPharmacy: (pharmacy: Pharmacy) => void;
    triggerResize: () => void;
    zoomToPharmacies: () => void;
}

function getMarkerKey(pharmacy: Pharmacy): string {
    return `${pharmacy.name}__${pharmacy.location.lat}__${pharmacy.location.lng}`;
}

function createPharmacyIcon(name: string, isActive: boolean): L.DivIcon {
    const scale = isActive ? "transform: scale(1.1);" : "";
    return L.divIcon({
        html: `
      <div style="display: flex; align-items: center; gap: 4px; ${scale}">
        <div class="pharmacy-pin is-active">
          <span class="pulse-ring"></span>
          <span class="pin-core" style="background:#FF0000; border-color:#FFFFFF;">E</span>
        </div>
        <span class="pharmacy-label">${name}</span>
      </div>
    `,
        className: "pharmacy-marker",
        iconSize: [200, 32],
        iconAnchor: [14, 16],
        popupAnchor: [80, -20],
    });
}

const userIcon = L.divIcon({
    html: `<div style="position: relative;">
    <div style="width: 14px; height: 14px; background: #3b82f6; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4);"></div>
    <div style="position: absolute; inset: 0; width: 14px; height: 14px; background: #60a5fa; border-radius: 50%; animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite; opacity: 0.6;"></div>
  </div>`,
    className: "user-marker",
    iconSize: [14, 14],
    iconAnchor: [7, 7],
});

function createPopupContent(pharmacy: Pharmacy): string {
    const phone = pharmacy.phone?.replace(/\s/g, "") || "";
    const hasPhone = phone.length > 0;
    return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; min-width: 230px; max-width: 275px; overflow: hidden; border-radius: 14px;">
      <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 12px 14px 11px; position: relative; overflow: hidden;">
        <div style="position:absolute;top:-20px;right:-20px;width:75px;height:75px;background:rgba(255,255,255,0.08);border-radius:50%;pointer-events:none;"></div>
        <div style="display:flex;align-items:flex-start;gap:10px;position:relative;">
          <div style="width:38px;height:38px;min-width:38px;background:rgba(255,255,255,0.18);border-radius:11px;display:flex;align-items:center;justify-content:center;border:1.5px solid rgba(255,255,255,0.30);font-weight:900;font-size:20px;color:#fff;box-shadow:0 2px 10px rgba(0,0,0,0.25);line-height:1;">+</div>
          <div style="flex:1;min-width:0;">
            <div style="font-weight:700;font-size:13px;color:#fff;line-height:1.35;word-break:break-word;margin-bottom:6px;">${pharmacy.name}</div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;">
              <span style="font-size:10px;font-weight:600;background:rgba(255,255,255,0.20);color:#fff;border-radius:20px;padding:2px 8px;border:1px solid rgba(255,255,255,0.25);">📍 ${pharmacy.district}</span>
              <span style="font-size:10px;font-weight:700;background:rgba(16,185,129,0.80);color:#fff;border-radius:20px;padding:2px 8px;">✦ Nöbetçi</span>
            </div>
          </div>
        </div>
      </div>
      <div style="background:#1e293b;padding:11px 13px 12px;">
        <div style="display:flex;align-items:flex-start;gap:8px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.07);border-radius:9px;padding:8px 10px;margin-bottom:${hasPhone ? "7px" : "10px"};">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-top:2px;flex-shrink:0;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span style="font-size:11.5px;color:#cbd5e1;line-height:1.5;word-break:break-word;">${pharmacy.address}</span>
        </div>
        ${hasPhone ? `
        <div style="display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.07);border-radius:9px;padding:8px 10px;margin-bottom:10px;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 14a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 3.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.68a16 16 0 0 0 6 6l.54-.54a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 18.92z"/></svg>
          <span style="font-size:12px;color:#cbd5e1;letter-spacing:0.3px;">${pharmacy.phone}</span>
        </div>
        ` : ""}
        <div style="display:flex;gap:7px;">
          ${hasPhone ? `
          <a href="tel:${phone}" style="flex:1;display:flex;align-items:center;justify-content:center;gap:5px;font-size:12px;font-weight:700;color:#fff;background:linear-gradient(135deg,#059669,#047857);border-radius:9px;padding:9px 6px;text-decoration:none;box-shadow:0 2px 8px rgba(5,150,105,0.35);">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 14a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 3.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.68a16 16 0 0 0 6 6l.54-.54a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 18.92z"/></svg>
            Ara
          </a>
          ` : ""}
          <a href="https://www.google.com/maps/dir/?api=1&destination=${pharmacy.location.lat},${pharmacy.location.lng}" target="_blank" rel="noopener" style="flex:${hasPhone ? "1.5" : "1"};display:flex;align-items:center;justify-content:center;gap:5px;font-size:12px;font-weight:700;color:#fff;background:linear-gradient(135deg,#2563eb,#1d4ed8);border-radius:9px;padding:9px 6px;text-decoration:none;box-shadow:0 2px 8px rgba(37,99,235,0.35);">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
            Yol Tarifi
          </a>
        </div>
      </div>
    </div>
  `;
}

const PharmacyMap = forwardRef<PharmacyMapRef, PharmacyMapProps>(function PharmacyMap(
    { pharmacies, userLocation, activePharmacy, bottomPadding = 0, mapCenterOffset = 0, onSelectPharmacy },
    ref
) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const markersGroupRef = useRef<L.LayerGroup | null>(null);
    const userMarkerRef = useRef<L.Marker | null>(null);
    const markerMapRef = useRef(new Map<string, L.Marker>());
    const lastUserLocationTimeRef = useRef(0);

    const initMap = useCallback(() => {
        if (!mapContainer.current || mapRef.current) return;
        const map = L.map(mapContainer.current, { zoomControl: false, attributionControl: false })
            .setView([39.925, 32.866], 6);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18 }).addTo(map);
        L.control.zoom({ position: "bottomright" }).addTo(map);
        L.control.attribution({ position: "bottomleft" }).addAttribution('© <a href="https://openstreetmap.org">OSM</a>').addTo(map);
        markersGroupRef.current = L.layerGroup().addTo(map);
        mapRef.current = map;
    }, []);

    const fitBounds = useCallback(() => {
        const map = mapRef.current;
        if (!map || pharmacies.length === 0) return;
        if (Date.now() - lastUserLocationTimeRef.current < 5000) return;
        const points = pharmacies
            .filter((p) => p.location.lat && p.location.lng)
            .map((p) => [p.location.lat, p.location.lng] as L.LatLngExpression);
        if (points.length > 0) {
            map.fitBounds(L.latLngBounds(points), {
                paddingTopLeft: [40, 40],
                paddingBottomRight: [20, 20],
                maxZoom: 15,
            });
        }
    }, [pharmacies]);

    const updateMarkers = useCallback(() => {
        const map = mapRef.current;
        const markersGroup = markersGroupRef.current;
        if (!map || !markersGroup) return;

        markersGroup.clearLayers();
        markerMapRef.current.clear();

        for (const pharmacy of pharmacies) {
            if (!pharmacy.location.lat || !pharmacy.location.lng) continue;
            const marker = L.marker([pharmacy.location.lat, pharmacy.location.lng], {
                icon: createPharmacyIcon(pharmacy.name, false),
            });
            marker.bindPopup(createPopupContent(pharmacy), { closeButton: false, maxWidth: 250, autoPan: false });
            marker.on("click", () => onSelectPharmacy(pharmacy));
            markersGroup.addLayer(marker);
            markerMapRef.current.set(getMarkerKey(pharmacy), marker);
        }

        if (userLocation) {
            if (userMarkerRef.current) map.removeLayer(userMarkerRef.current);
            userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon, zIndexOffset: 1000 })
                .bindPopup('<div style="padding: 8px; font-size: 11px; font-weight: 600; color: #60a5fa;">📍 Konumunuz</div>', { closeButton: false })
                .addTo(map);
        }

        fitBounds();
    }, [pharmacies, userLocation, onSelectPharmacy, fitBounds]);

    const focusOnPharmacy = useCallback((pharmacy: Pharmacy) => {
        const map = mapRef.current;
        if (!map) return;
        map.setView([pharmacy.location.lat, pharmacy.location.lng], 14, { animate: false });
        markerMapRef.current.get(getMarkerKey(pharmacy))?.openPopup();
        if (bottomPadding > 0) {
            requestAnimationFrame(() => {
                map.panBy([50, bottomPadding / 5.5], { animate: true, duration: 0.5 });
            });
        }
    }, [bottomPadding]);

    useImperativeHandle(ref, () => ({
        focusOnPharmacy,
        triggerResize: () => mapRef.current?.invalidateSize(),
        zoomToPharmacies: () => {
            lastUserLocationTimeRef.current = 0;
            fitBounds();
        },
    }), [focusOnPharmacy, fitBounds]);

    useEffect(() => {
        initMap();
        const timer = setTimeout(() => mapRef.current?.invalidateSize(), 300);
        return () => {
            clearTimeout(timer);
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [initMap]);

    useEffect(() => {
        updateMarkers();
    }, [updateMarkers]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map || !userLocation) return;
        lastUserLocationTimeRef.current = Date.now();
        map.invalidateSize();
        setTimeout(() => {
            map.setView([userLocation.lat, userLocation.lng], 14, { animate: true, duration: 1 });
            if (mapCenterOffset > 0) {
                setTimeout(() => {
                    map.panBy([0, mapCenterOffset], { animate: true, duration: 0.5 });
                }, 400);
            }
        }, 300);
    }, [userLocation, mapCenterOffset]);

    useEffect(() => {
        if (!activePharmacy) return;
        const markersGroup = markersGroupRef.current;
        if (!markersGroup) return;
        markersGroup.eachLayer((layer) => {
            const marker = layer as L.Marker;
            for (const p of pharmacies) {
                if (marker.getLatLng().lat === p.location.lat && marker.getLatLng().lng === p.location.lng) {
                    const isActive = activePharmacy.name === p.name && activePharmacy.address === p.address;
                    marker.setIcon(createPharmacyIcon(p.name, isActive));
                    break;
                }
            }
        });
        focusOnPharmacy(activePharmacy);
    }, [activePharmacy, pharmacies, focusOnPharmacy]);

    return <div ref={mapContainer} className="w-full h-full" />;
});

export default PharmacyMap;
