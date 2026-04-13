"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface Story {
    id: string;
    name: string;
    image: string;
    mediaUrl?: string;
    mediaType?: "image" | "video";
    caption?: string;
    createdAt?: any;
    expiresAt?: any;
}

interface StoryViewerProps {
    stories: Story[];
    initialStoryIndex: number;
    onClose: () => void;
}

function timeAgo(ts: any): string {
    if (!ts) return "";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

export function StoryViewer({ stories, initialStoryIndex, onClose }: StoryViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const currentStory = stories[currentIndex];
    const isVideo = currentStory?.mediaType === "video";
    // Videos get 15s, images get 5s
    const duration = isVideo ? 15000 : 5000;
    const increment = (50 / duration) * 100; // percent per 50ms tick

    useEffect(() => {
        setProgress(0);
        setIsPaused(false);
    }, [currentIndex]);

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    handleNext();
                    return 0;
                }
                return prev + increment;
            });
        }, 50);
        return () => clearInterval(timer);
    }, [currentIndex, isPaused]);

    const handleNext = () => {
        if (currentIndex < stories.length - 1) setCurrentIndex(currentIndex + 1);
        else onClose();
    };

    const handlePrev = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    };

    if (!currentStory) return null;

    const mediaUrl = currentStory.mediaUrl || currentStory.image;

    return (
        <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center">
            {/* Progress bars */}
            <div className="absolute top-3 left-3 right-3 flex gap-1 z-20">
                {stories.map((_, idx) => (
                    <div key={idx} className="h-0.5 flex-1 bg-white/30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white transition-none rounded-full"
                            style={{
                                width: idx < currentIndex ? "100%" : idx === currentIndex ? `${Math.min(progress, 100)}%` : "0%",
                                transition: idx === currentIndex ? "width 50ms linear" : "none"
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Header */}
            <div className="absolute top-6 left-4 right-4 flex items-center justify-between z-20 text-white">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/60">
                        <img src={currentStory.image} alt={currentStory.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="font-semibold text-sm leading-tight">{currentStory.name}</p>
                        <p className="text-xs text-white/70">{timeAgo(currentStory.createdAt)} · disappears in 24h</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-1">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Tap areas (left = prev, right = next) */}
            <div className="absolute inset-0 flex z-10">
                <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
                <div className="w-1/3 h-full" onMouseDown={() => setIsPaused(true)} onMouseUp={() => setIsPaused(false)} onTouchStart={() => setIsPaused(true)} onTouchEnd={() => setIsPaused(false)} />
                <div className="w-1/3 h-full cursor-pointer" onClick={handleNext} />
            </div>

            {/* Media */}
            <div className="w-full h-full relative flex items-center justify-center bg-black">
                {isVideo ? (
                    <video
                        key={mediaUrl}
                        src={mediaUrl}
                        autoPlay
                        playsInline
                        className="max-w-full max-h-full object-contain"
                        onEnded={handleNext}
                    />
                ) : (
                    <img
                        src={mediaUrl}
                        alt={currentStory.name}
                        className="w-full h-full object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none" />
            </div>

            {/* Caption */}
            {currentStory.caption && (
                <div className="absolute bottom-16 left-4 right-4 z-20">
                    <p className="text-white text-base font-medium text-center drop-shadow-lg">{currentStory.caption}</p>
                </div>
            )}

            {/* Reply bar */}
            <div className="absolute bottom-4 left-4 right-4 z-20">
                <input
                    type="text"
                    placeholder={`Reply to ${currentStory.name?.split(" ")[0] || "story"}...`}
                    className="w-full bg-transparent border border-white/50 rounded-full px-4 py-3 text-white text-sm placeholder-white/60 focus:outline-none focus:border-white"
                />
            </div>
        </div>
    );
}
