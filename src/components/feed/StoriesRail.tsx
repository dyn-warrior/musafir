"use client";

import { Plus } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { StoryViewer } from "./StoryViewer";
import { CreateStoryModal } from "./CreateStoryModal";
import { useAuth } from "@/context/AuthContext";

export function StoriesRail() {
    const { user } = useAuth();
    const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const fetchStories = useCallback(async () => {
        try {
            const { getActiveStories } = await import('@/lib/firestore');
            const data = await getActiveStories();
            setStories(data);
        } catch (err: any) {
            console.error("Failed to fetch stories:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStories();
    }, [fetchStories]);

    if (loading) {
        return (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-4 md:px-0">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 min-w-[72px]">
                        <div className="w-16 h-16 rounded-full bg-muted animate-pulse" />
                        <div className="h-2 w-12 bg-muted rounded animate-pulse" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-4 md:px-0">
                {/* + Add Story button — only for logged-in users */}
                {user && (
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="flex flex-col items-center space-y-2 min-w-[72px] focus:outline-none group"
                    >
                        <div className="relative w-16 h-16 rounded-full bg-muted border-2 border-dashed border-gray-300 group-hover:border-primary group-hover:bg-primary/5 transition-all flex items-center justify-center">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt="You" className="w-full h-full rounded-full object-cover opacity-40" />
                            ) : null}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg">
                                    <Plus className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </div>
                        <span className="text-xs font-medium truncate w-full text-center text-muted-foreground group-hover:text-foreground transition-colors">
                            Your Story
                        </span>
                    </button>
                )}

                {/* Story bubbles */}
                {stories.map((story, index) => (
                    <button
                        key={story.id}
                        onClick={() => setSelectedStoryIndex(index)}
                        className="flex flex-col items-center space-y-2 min-w-[72px] focus:outline-none group"
                    >
                        <div className="relative w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-primary via-secondary to-orange-400 group-hover:scale-105 transition-transform duration-300">
                            <div className="w-full h-full rounded-full border-2 border-background overflow-hidden">
                                <img
                                    src={story.image || story.mediaUrl}
                                    alt={story.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Video indicator */}
                            {story.mediaType === "video" && (
                                <div className="absolute bottom-0 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 24 24">
                                        <polygon points="5,3 19,12 5,21" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <span className="text-xs font-medium truncate w-full text-center text-muted-foreground group-hover:text-foreground transition-colors">
                            {story.name?.split(" ")[0] || "Story"}
                        </span>
                    </button>
                ))}

                {/* Empty state for no stories */}
                {stories.length === 0 && !user && (
                    <p className="text-sm text-muted-foreground py-4">No stories yet. Sign in to post one!</p>
                )}
                {stories.length === 0 && user && (
                    <p className="text-sm text-muted-foreground py-4 ml-2">No stories yet — be the first to share one!</p>
                )}
            </div>

            {/* Story Viewer */}
            {selectedStoryIndex !== null && (
                <StoryViewer
                    stories={stories}
                    initialStoryIndex={selectedStoryIndex}
                    onClose={() => setSelectedStoryIndex(null)}
                />
            )}

            {/* Create Story Modal */}
            <CreateStoryModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onStoryCreated={() => {
                    setIsCreateOpen(false);
                    fetchStories(); // Refresh stories list
                }}
            />
        </>
    );
}
