"use client";

import { Button } from "@/components/ui/button";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function GoogleLoginButton() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Save / update user profile in Firestore
            const { upsertUserProfile } = await import("@/lib/firestore");
            await upsertUserProfile(user.uid, {
                displayName: user.displayName || "Nomadi User",
                email: user.email || "",
                photoURL: user.photoURL || "",
            });

            toast.success(`Welcome, ${user.displayName?.split(" ")[0] || "Nomad"}! 🌏`);
            router.push("/feed");
        } catch (error: any) {
            console.error("Google login failed:", error);
            if (error.code !== "auth/popup-closed-by-user") {
                toast.error("Google sign-in failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            className="w-full h-12 text-base font-medium relative"
            onClick={handleGoogleLogin}
            disabled={isLoading}
        >
            {isLoading ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Signing in...
                </span>
            ) : (
                <>
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        className="w-5 h-5 absolute left-4"
                    />
                    Continue with Google
                </>
            )}
        </Button>
    );
}
