"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export function RequireUsername({ children }: { children: React.ReactNode }) {
    const { user, userProfile, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && user && userProfile) {
            // Exceptions: we don't force them out if they are already on /onboarding or /login
            if (!userProfile.username && pathname !== "/onboarding" && pathname !== "/login" && pathname !== "/") {
                router.push("/onboarding");
            }
        }
    }, [user, userProfile, loading, pathname, router]);

    return <>{children}</>;
}
