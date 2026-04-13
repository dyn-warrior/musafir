"use client";

import { useState } from "react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

export function useCamera() {
    const [photo, setPhoto] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const takePhoto = async () => {
        try {
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Prompt // Asks user: Camera or Photos
            });

            if (image.dataUrl) {
                setPhoto(image.dataUrl);
            }
            setError(null);
        } catch (err) {
            console.error("Camera error:", err);
            // Don't set error if user cancelled
            if ((err as any).message !== "User cancelled photos app") {
                setError("Failed to take photo");
            }
        }
    };

    return { photo, error, takePhoto, setPhoto };
}
