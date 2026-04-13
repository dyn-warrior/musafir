"use client";

import { useState, useEffect } from "react";
import { Geolocation } from "@capacitor/geolocation";

export function useGeolocation() {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const getCurrentPosition = async () => {
        try {
            const permission = await Geolocation.checkPermissions();

            if (permission.location !== 'granted') {
                const request = await Geolocation.requestPermissions();
                if (request.location !== 'granted') {
                    setError("Location permission denied");
                    return;
                }
            }

            const coordinates = await Geolocation.getCurrentPosition();
            setLocation({
                lat: coordinates.coords.latitude,
                lng: coordinates.coords.longitude
            });
            setError(null);
        } catch (err) {
            setError("Error getting location");
            console.error(err);
        }
    };

    return { location, error, getCurrentPosition };
}
