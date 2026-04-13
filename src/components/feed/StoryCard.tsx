"use client";

import { useState } from "react";
import { Heart, MessageCircle, Share2, Clock, X, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { likeStory, unlikeStory, addStoryComment, getStoryComments, type Story, type StoryComment } from "@/lib/firestore";
import { toast } from "sonner";

interface StoryCardProps {
    story: Story;
    onUpdate?: () => void;
}

function timeLeft(expiresAt: any): string {
    if (!expiresAt) return "";
    const expiry = expiresAt.toDate ? expiresAt.toDate() : new Date(expiresAt.seconds * 1000);
    const diff = expiry.getTime() - Date.now();
    if (diff < 0) return "Expired";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    if (h > 0) return `${h}h ${m}m left`;
    return `${m}m left`;
}

export function StoryCard({ story, onUpdate }: StoryCardProps) {
    const { user } = useAuth();
    const [liked, setLiked] = useState(story.likedBy?.includes(user?.uid || "") ?? false);
    const [likeCount, setLikeCount] = useState(story.likes ?? 0);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<StoryComment[]>([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleLike = async () => {
        if (!user) { toast.error("Login to like stories"); return; }
        if (liked) {
            setLiked(false);
            setLikeCount(c => c - 1);
            await unlikeStory(story.id, user.uid);
        } else {
            setLiked(true);
            setLikeCount(c => c + 1);
            await likeStory(story.id, user.uid);
        }
    };

    const openComments = async () => {
        setShowComments(true);
        if (comments.length === 0) {
            setCommentsLoading(true);
            try {
                const data = await getStoryComments(story.id);
                setComments(data);
            } finally {
                setCommentsLoading(false);
            }
        }
    };

    const handleComment = async () => {
        if (!user) { toast.error("Login to comment"); return; }
        if (!commentText.trim()) return;
        setSubmitting(true);
        try {
            const newComment: StoryComment = {
                id: Date.now().toString(),
                uid: user.uid,
                name: user.displayName || "Nomadi User",
                avatar: user.photoURL || `https://ui-avatars.com/api/?name=N`,
                text: commentText.trim(),
                createdAt: null,
            };
            setComments(prev => [...prev, newComment]);
            setCommentText("");
            await addStoryComment(story.id, {
                uid: user.uid,
                name: user.displayName || "Nomadi User",
                avatar: user.photoURL || `https://ui-avatars.com/api/?name=N`,
                text: newComment.text,
            });
        } catch {
            toast.error("Failed to post comment");
        } finally {
            setSubmitting(false);
        }
    };

    const handleShare = async () => {
        const url = `${window.location.origin}/feed#story-${story.id}`;
        if (navigator.share) {
            await navigator.share({ title: story.name, text: story.caption || "", url });
        } else {
            await navigator.clipboard.writeText(url);
            toast.success("Link copied!");
        }
    };

    return (
        <div id={`story-${story.id}`} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Author header */}
            <div className="flex items-center gap-3 px-4 py-3">
                <div className="relative">
                    <img
                        src={story.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(story.name)}&background=14532d&color=fff`}
                        alt={story.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-primary ring-offset-1"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">{story.name}</p>
                    <div className="flex items-center gap-1 text-xs text-amber-600">
                        <Clock className="w-3 h-3" />
                        <span>{(story as any).expiresAt ? timeLeft((story as any).expiresAt) : ""}</span>
                    </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">Story</span>
            </div>

            {/* Media */}
            <div className="relative w-full bg-black aspect-[4/5] max-h-[560px] overflow-hidden">
                {story.mediaType === "video" ? (
                    <video
                        src={story.mediaUrl}
                        controls
                        playsInline
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <img
                        src={story.mediaUrl}
                        alt={story.caption || story.name}
                        className="w-full h-full object-cover"
                    />
                )}
                {story.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
                        <p className="text-white text-sm font-medium">{story.caption}</p>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="px-4 py-3 flex items-center gap-5 border-t border-gray-50">
                <button
                    onClick={handleLike}
                    className={cn("flex items-center gap-1.5 text-sm font-medium transition-colors", liked ? "text-red-500" : "text-gray-500 hover:text-red-400")}
                >
                    <Heart className={cn("w-5 h-5 transition-transform active:scale-125", liked && "fill-red-500")} />
                    <span>{likeCount}</span>
                </button>

                <button
                    onClick={openComments}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary transition-colors"
                >
                    <MessageCircle className="w-5 h-5" />
                    <span>{story.comments ?? 0}</span>
                </button>

                <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary transition-colors ml-auto"
                >
                    <Share2 className="w-5 h-5" />
                </button>
            </div>

            {/* Comments drawer */}
            {showComments && (
                <div className="border-t border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between px-4 py-2">
                        <p className="text-sm font-semibold text-gray-700">Comments</p>
                        <button onClick={() => setShowComments(false)} className="p-1 hover:bg-gray-200 rounded-full">
                            <X className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                    <div className="px-4 pb-2 max-h-48 overflow-y-auto space-y-3">
                        {commentsLoading && (
                            <div className="flex justify-center py-4">
                                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                            </div>
                        )}
                        {!commentsLoading && comments.length === 0 && (
                            <p className="text-xs text-gray-400 text-center py-2">No comments yet. Be first!</p>
                        )}
                        {comments.map(c => (
                            <div key={c.id} className="flex gap-2 items-start">
                                <img src={c.avatar} alt={c.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5" />
                                <div className="bg-white rounded-xl px-3 py-2 text-sm flex-1 shadow-sm">
                                    <span className="font-semibold text-gray-800 mr-1.5">{c.name}</span>
                                    <span className="text-gray-600">{c.text}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100">
                        <input
                            className="flex-1 rounded-full bg-white border border-gray-200 px-4 py-2 text-sm outline-none focus:border-primary"
                            placeholder="Add a comment…"
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleComment()}
                        />
                        <button
                            onClick={handleComment}
                            disabled={submitting || !commentText.trim()}
                            className="p-2 bg-primary text-white rounded-full disabled:opacity-40 hover:bg-primary/90 transition-colors"
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
