"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Loader2, Users, Globe, Lock } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated?: (groupId: string) => void;
}

export function CreateGroupModal({ isOpen, onClose, onCreated }: CreateGroupModalProps) {
    const { user } = useAuth();
    const [groupName, setGroupName] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!user) return toast.error("You must be signed in.");
        if (!user.emailVerified) {
            toast.error("Please verify your email before creating groups.");
            return;
        }
        if (!groupName.trim()) return toast.error("Please enter a group name.");

        setLoading(true);
        try {
            const { createCommunityGroup } = await import("@/lib/firestore");
            const groupId = await createCommunityGroup({
                name: groupName.trim(),
                description: description.trim(),
                isPublic,
                creatorUid: user.uid,
                creatorName: user.displayName || "Musafir User",
                creatorAvatar: user.photoURL || "",
            });

            toast.success(`"${groupName.trim()}" created! 🎉`);
            onCreated?.(groupId);
            handleClose();
        } catch (err) {
            console.error("Group creation failed:", err);
            toast.error("Failed to create group. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setGroupName("");
        setDescription("");
        setIsPublic(true);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between">
                    <button onClick={handleClose} className="p-1 hover:bg-muted rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                    <h3 className="font-bold text-base">New Group</h3>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !groupName.trim()}
                        className="text-sm font-semibold text-primary hover:text-primary/80 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Group icon preview */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                            <Users className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground">Icon auto-generated from name</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Group Name *</label>
                            <Input
                                placeholder="e.g. Kasol Spring Trek 2025"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                maxLength={60}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Description</label>
                            <textarea
                                className="w-full min-h-[70px] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                                placeholder="What's this group about?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                maxLength={200}
                            />
                        </div>

                        {/* Visibility */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Visibility</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsPublic(true)}
                                    className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${isPublic ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-muted-foreground"
                                        }`}
                                >
                                    <Globe className="w-4 h-4" />
                                    Public
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsPublic(false)}
                                    className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${!isPublic ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-muted-foreground"
                                        }`}
                                >
                                    <Lock className="w-4 h-4" />
                                    Private
                                </button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {isPublic ? "Anyone can find and join this group." : "Only people you invite can join."}
                            </p>
                        </div>
                    </div>

                    <Button className="w-full h-11" onClick={handleSubmit} disabled={loading || !groupName.trim()}>
                        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : "Create Group"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
