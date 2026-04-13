"use client";

import { useOffline } from "@/hooks/useOffline";
import { WifiOff } from "lucide-react";

export function OfflineBanner() {
    const isOffline = useOffline();

    if (!isOffline) return null;

    return (
        <div className="bg-destructive text-destructive-foreground px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2 animate-in slide-in-from-top">
            <WifiOff className="w-4 h-4" />
            You are currently offline. Some features may be unavailable.
        </div>
    );
}
