"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { getUserProfile, UserProfile } from "@/lib/firestore";

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    token: string | null;
    loading: boolean;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    userProfile: null,
    token: null,
    loading: true,
    refreshProfile: async () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshProfile = async () => {
        if (user) {
            const profile = await getUserProfile(user.uid);
            setUserProfile(profile);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const idToken = await currentUser.getIdToken();
                setToken(idToken);

                // Fetch internal firestore profile
                const profile = await getUserProfile(currentUser.uid);
                setUserProfile(profile);

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
                setUserProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, userProfile, token, loading, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
