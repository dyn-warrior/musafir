"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export function NotificationTest() {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        // Check if running in Tauri
        if (typeof window !== "undefined" && "__TAURI_INTERNALS__" in window) {
            setIsDesktop(true);
        }
    }, []);

    const sendNotification = async () => {
        try {
            // Dynamically import to avoid SSR issues
            const { isPermissionGranted, requestPermission, sendNotification } = await import("@tauri-apps/plugin-notification");

            let permission = await isPermissionGranted();
            if (!permission) {
                const permissionStatus = await requestPermission();
                permission = permissionStatus === "granted";
            }

            if (permission) {
                sendNotification({
                    title: "Musafir",
                    body: "This is a native desktop notification! 🚀",
                });
            }
        } catch (error) {
            console.error("Failed to send notification:", error);
        }
    };

    if (!isDesktop) return null;

    return (
        <Button
            variant="outline"
            className="gap-2"
            onClick={sendNotification}
        >
            <Bell className="w-4 h-4" />
            Test Notification
        </Button>
    );
}
