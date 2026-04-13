"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const idToken = await currentUser.getIdToken();
                setToken(idToken);

                // Register FCM token for push notifications (non-blocking)
                import("@/lib/fcm").then(async ({ requestNotificationPermission }) => {
                    try {
                        const fcmToken = await requestNotificationPermission();
                        if (fcmToken) {
                            const { saveFcmToken } = await import("@/lib/firestore");
                            await saveFcmToken(currentUser.uid, fcmToken);
                        }
                    } catch {
                        // FCM is optional — ignore errors silently
                    }
                });
            } else {
                setToken(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
