"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { updateUserProfile } from "@/lib/firestore";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: any;
    authUser: any;
    onUpdate: (updated: any) => void;
}

export function EditProfileModal({ isOpen, onClose, profile, authUser, onUpdate }: EditProfileModalProps) {
    const [displayName, setDisplayName] = useState(profile?.displayName || authUser?.displayName || "");
    const [bio, setBio] = useState(profile?.bio || "");
    const [location, setLocation] = useState(profile?.location || "");
    const [loading, setLoading] = useState(false);

    // Sync state when profile changes
    useEffect(() => {
        setDisplayName(profile?.displayName || authUser?.displayName || "");
        setBio(profile?.bio || "");
        setLocation(profile?.location || "");
    }, [profile, authUser, isOpen]);

    // Close on Escape
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape" && isOpen) onClose(); };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!authUser) return;
        if (!displayName.trim()) return toast.error("Display name cannot be empty.");
        setLoading(true);
        try {
            // Update Firebase Auth display name
            await updateProfile(auth.currentUser!, { displayName: displayName.trim() });

            // Update Firestore profile
            await updateUserProfile(authUser.uid, {
                displayName: displayName.trim(),
                bio: bio.trim(),
                location: location.trim(),
            });

            onUpdate({ displayName: displayName.trim(), bio: bio.trim(), location: location.trim() });
            toast.success("Profile updated! ✨");
            onClose();
        } catch (err) {
            console.error("Profile update failed:", err);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const photoURL = profile?.photoURL || authUser?.photoURL;
    const initials = (displayName || "U").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between">
                    <button onClick={onClose} className="p-1 hover:bg-muted rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                    <h3 className="font-bold text-base">Edit Profile</h3>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="text-sm font-semibold text-primary hover:text-primary/80 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Avatar display (read-only for now) */}
                    <div className="flex flex-col items-center gap-2">
                        {photoURL ? (
                            <img src={photoURL} alt={displayName} className="w-20 h-20 rounded-full object-cover border-4 border-muted" />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-green-700 flex items-center justify-center border-4 border-muted">
                                <span className="text-2xl font-bold text-white">{initials}</span>
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground">Profile photo from your Google account</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Display Name</label>
                            <Input
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Your name"
                                maxLength={50}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Bio</label>
                            <textarea
                                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell the world about your travel style..."
                                maxLength={200}
                            />
                            <p className="text-xs text-muted-foreground text-right">{bio.length}/200</p>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Location</label>
                            <Input
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g. Mumbai, India"
                                maxLength={60}
                            />
                        </div>
                    </div>

                    <Button className="w-full h-11" onClick={handleSubmit} disabled={loading}>
                        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
