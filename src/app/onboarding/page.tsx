"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfile, isUsernameTaken } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { MapPin } from "lucide-react";

export default function OnboardingPage() {
    const { user, userProfile, refreshProfile } = useAuth();
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || username.trim().length < 3) {
            toast.error("Username must be at least 3 characters.");
            return;
        }

        const formatted = username.trim().toLowerCase();
        if (/[^a-z0-9_]/.test(formatted)) {
            toast.error("Username can only contain letters, numbers, and underscores.");
            return;
        }

        if (!user) return;

        setLoading(true);
        try {
            const taken = await isUsernameTaken(formatted);
            if (taken) {
                toast.error("This username is already taken. Try another one.");
                setLoading(false);
                return;
            }

            // Update user profile
            await updateUserProfile(user.uid, { username: formatted });
            await refreshProfile();

            toast.success("Profile updated successfully!");
            router.push("/feed");
        } catch (error) {
            console.error("Error setting username:", error);
            toast.error("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return null; // Will be handled by AuthGuard or Splash
    }

    return (
        <div className="min-h-screen bg-brand-dark-1 flex flex-col items-center justify-center -mt-16 px-4">
            <div className="max-w-md w-full bg-brand-dark-2 border border-white/10 p-8 rounded-3xl shadow-xl text-center">
                <MapPin className="w-12 h-12 text-brand-teal mx-auto mb-4" />
                <h1 className="text-3xl font-serif text-white mb-2">Claim your username</h1>
                <p className="text-sm text-gray-400 mb-8">
                    Choose a unique username so fellow travelers can easily find you on Musafir.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Input
                            placeholder="e.g. wanderlust99"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="h-14 text-center font-bold text-lg bg-white/5 border-white/20 text-white placeholder:text-gray-600 focus-visible:ring-brand-teal"
                        />
                    </div>
                    <Button
                        disabled={loading}
                        className="w-full h-12 bg-brand-teal hover:bg-brand-teal-light text-brand-dark-1 font-bold text-lg"
                    >
                        {loading ? "Checking..." : "Continue"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
