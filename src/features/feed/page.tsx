"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Loader2 } from "lucide-react";
import { getActiveStories, type Story } from "@/lib/firestore";
import { StoryCard } from "@/components/feed/StoryCard";
import { CreateStoryModal } from "@/components/feed/CreateStoryModal";
import { useAuth } from "@/context/AuthContext";

export default function FeedPage() {
    const { user } = useAuth();
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const fetchStories = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getActiveStories();
            setStories(data);
        } catch (err) {
            console.error("Failed to load stories:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchStories(); }, [fetchStories]);

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-gray-900 font-sans pb-24">
            <div className="max-w-xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-heading font-black tracking-tight text-gray-900">Stories</h1>
                        <p className="text-xs text-gray-400 mt-0.5">Disappear after 24 hours</p>
                    </div>
                    {user && (
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-full shadow-md hover:bg-primary/90 transition-all active:scale-95"
                        >
                            <Plus className="w-4 h-4" />
                            Add Story
                        </button>
                    )}
                </div>

                {/* Stories feed */}
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                                <div className="flex items-center gap-3 px-4 py-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                                    <div className="space-y-1">
                                        <div className="h-3 w-24 bg-gray-200 rounded" />
                                        <div className="h-2 w-16 bg-gray-100 rounded" />
                                    </div>
                                </div>
                                <div className="aspect-[4/5] bg-gray-100" />
                                <div className="px-4 py-3 h-10 bg-gray-50" />
                            </div>
                        ))}
                    </div>
                ) : stories.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <div className="text-5xl mb-3">📸</div>
                        <p className="font-medium text-gray-500">No stories yet</p>
                        {user ? (
                            <button
                                onClick={() => setIsCreateOpen(true)}
                                className="mt-4 px-5 py-2 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary/90 transition"
                            >
                                Be the first to share
                            </button>
                        ) : (
                            <p className="text-sm mt-1">Sign in to post a story</p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {stories.map(story => (
                            <StoryCard key={story.id} story={story} onUpdate={fetchStories} />
                        ))}
                    </div>
                )}
            </div>

            {/* Mobile FAB */}
            {user && (
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="md:hidden fixed bottom-24 right-5 z-40 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center transition-transform active:scale-95"
                >
                    <Plus className="w-7 h-7" />
                </button>
            )}

            <CreateStoryModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onStoryCreated={() => { setIsCreateOpen(false); fetchStories(); }}
            />
        </div>
    );
}
