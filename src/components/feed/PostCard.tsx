"use client";

import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, Send, X, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
    toggleLike,
    toggleSave,
    addComment,
    subscribeToComments,
    type Comment,
} from "@/lib/firestore";

interface PostProps {
    post: {
        id: string;           // Firestore doc ID (string)
        authorUid?: string;
        user: {
            name: string;
            image: string;
            location: string;
        };
        content: {
            image?: string;
            text: string;
            date?: string;
            tags?: string[];
        };
        stats: {
            likes: number;
            comments: number;
        };
        likedBy?: string[];   // list of UIDs who liked
    };
    /** UIDs of posts the *current user* has saved — passed from parent */
    savedPostIds?: string[];
    variant?: "default" | "compact";
}

export function PostCard({ post, savedPostIds = [], variant = "default" }: PostProps) {
    const { user } = useAuth();
    const uid = user?.uid ?? null;

    /* ── Like state (optimistic) ── */
    const [isLiked, setIsLiked] = useState(() => uid ? (post.likedBy ?? []).includes(uid) : false);
    const [likeCount, setLikeCount] = useState(post.stats.likes ?? 0);
    const [likeBusy, setLikeBusy] = useState(false);

    /* ── Save state (optimistic) ── */
    const [isSaved, setIsSaved] = useState(() => savedPostIds.includes(post.id));
    const [saveBusy, setSaveBusy] = useState(false);

    /* ── Comments panel ── */
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState("");
    const [commentBusy, setCommentBusy] = useState(false);
    const [commentCount, setCommentCount] = useState(post.stats.comments ?? 0);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Sync savedPostIds from parent
    useEffect(() => {
        setIsSaved(savedPostIds.includes(post.id));
    }, [savedPostIds, post.id]);

    // Sync likedBy if post prop changes
    useEffect(() => {
        if (uid) setIsLiked((post.likedBy ?? []).includes(uid));
    }, [post.likedBy, uid]);

    // Real-time comments when panel is open
    useEffect(() => {
        if (!showComments) return;
        const unsub = subscribeToComments(post.id, (c) => {
            setComments(c);
            setCommentCount(c.length);
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
        });
        return unsub;
    }, [showComments, post.id]);

    /* ── Handlers ── */
    const handleLike = async () => {
        if (!uid || likeBusy) return;
        // Optimistic update
        const next = !isLiked;
        setIsLiked(next);
        setLikeCount(c => next ? c + 1 : c - 1);
        setLikeBusy(true);
        try {
            await toggleLike(post.id, uid);
        } catch {
            // Revert
            setIsLiked(!next);
            setLikeCount(c => next ? c - 1 : c + 1);
        } finally {
            setLikeBusy(false);
        }
    };

    const handleSave = async () => {
        if (!uid || saveBusy) return;
        const next = !isSaved;
        setIsSaved(next);
        setSaveBusy(true);
        try {
            await toggleSave(post.id, uid);
        } catch {
            setIsSaved(!next);
        } finally {
            setSaveBusy(false);
        }
    };

    const handleComment = async () => {
        if (!uid || !commentText.trim() || commentBusy) return;
        setCommentBusy(true);
        try {
            await addComment(post.id, commentText.trim(), {
                uid,
                name: user?.displayName || user?.email?.split("@")[0] || "Anonymous",
                avatar: user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || "U")}&background=random`,
            });
            setCommentText("");
        } catch (err) {
            console.error("Comment failed:", err);
        } finally {
            setCommentBusy(false);
        }
    };

    /* ── Compact variant ── */
    if (variant === "compact") {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <img src={post.user.image} className="w-8 h-8 rounded-full object-cover" alt={post.user.name} />
                        <h4 className="font-semibold text-xs text-gray-900">{post.user.name} • {post.user.location.split(',')[0]}</h4>
                    </div>
                    <button className="text-gray-400 text-xs"><MoreHorizontal className="w-4 h-4" /></button>
                </div>
                {post.content.image && (
                    <img src={post.content.image} className="w-full h-48 object-cover" alt="Post content" />
                )}
                <div className="p-3 space-y-2">
                    <p className="text-xs text-gray-700 line-clamp-2">{post.content.text}</p>
                    <div className="flex justify-between text-[10px] text-gray-400 items-center">
                        <div className="flex gap-3">
                            <button onClick={handleLike} className={cn("flex items-center gap-1 transition-colors", isLiked ? "text-red-500" : "hover:text-red-400")}>
                                <Heart className={cn("w-3 h-3", isLiked && "fill-current")} /> {likeCount}
                            </button>
                            <button onClick={() => setShowComments(v => !v)} className="flex items-center gap-1 hover:text-blue-400">
                                <MessageCircle className="w-3 h-3" /> {commentCount}
                            </button>
                        </div>
                        <button onClick={handleSave} className={cn("transition-colors", isSaved ? "text-green-700" : "hover:text-green-600")}>
                            <Bookmark className={cn("w-3 h-3", isSaved && "fill-current")} />
                        </button>
                    </div>
                </div>
                {showComments && <CommentsPanel postId={post.id} uid={uid} user={user} showComments={showComments} />}
            </div>
        );
    }

    /* ── Default variant ── */
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <img src={post.user.image} className="w-10 h-10 rounded-full object-cover" alt={post.user.name} />
                    <div>
                        <h4 className="font-semibold text-sm text-gray-900">{post.user.name} • {post.user.location}</h4>
                        <p className="text-[10px] text-gray-400">{post.content.date || "Just now"}</p>
                    </div>
                </div>
                <button className="text-gray-400"><MoreHorizontal className="w-5 h-5" /></button>
            </div>

            {/* Image */}
            {post.content.image && (
                <img src={post.content.image} className="w-full object-cover max-h-[500px]" alt="Post content" />
            )}

            {/* Caption */}
            <div className="p-4 space-y-3">
                <p className="text-sm text-gray-700 leading-relaxed">
                    {post.content.text}
                    {post.content.tags && post.content.tags.length > 0 && (
                        <span className="block mt-1 text-green-700 font-medium cursor-pointer">
                            {post.content.tags.map(tag => `#${tag}`).join(' ')}
                        </span>
                    )}
                </p>

                {/* Action bar */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                    <div className="flex gap-4">
                        {/* Like */}
                        <button
                            onClick={handleLike}
                            disabled={!uid || likeBusy}
                            className={cn(
                                "flex items-center gap-1.5 text-sm transition-all active:scale-90",
                                isLiked ? "text-red-500" : "text-gray-500 hover:text-red-400",
                                (!uid) && "opacity-50 cursor-not-allowed"
                            )}
                            title={uid ? (isLiked ? "Unlike" : "Like") : "Sign in to like"}
                        >
                            <Heart className={cn("w-5 h-5 transition-transform", isLiked && "fill-current scale-110")} />
                            <span>{likeCount}</span>
                        </button>

                        {/* Comment toggle */}
                        <button
                            onClick={() => setShowComments(v => !v)}
                            className={cn(
                                "flex items-center gap-1.5 text-sm transition-colors",
                                showComments ? "text-blue-500" : "text-gray-500 hover:text-blue-400"
                            )}
                        >
                            <MessageCircle className="w-5 h-5" />
                            <span>{commentCount}</span>
                        </button>
                    </div>

                    <div className="flex gap-3">
                        {/* Save */}
                        <button
                            onClick={handleSave}
                            disabled={!uid || saveBusy}
                            className={cn(
                                "transition-all active:scale-90",
                                isSaved ? "text-green-700" : "text-gray-400 hover:text-green-600",
                                (!uid) && "opacity-50 cursor-not-allowed"
                            )}
                            title={uid ? (isSaved ? "Unsave" : "Save to profile") : "Sign in to save"}
                        >
                            <Bookmark className={cn("w-5 h-5", isSaved && "fill-current")} />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Comments section */}
            {showComments && (
                <div className="border-t border-gray-100">
                    {/* Comments list */}
                    <div className="max-h-64 overflow-y-auto px-4 py-3 space-y-3">
                        {comments.length === 0 && (
                            <p className="text-xs text-gray-400 text-center py-4">No comments yet. Be the first!</p>
                        )}
                        {comments.map(c => (
                            <div key={c.id} className="flex gap-2.5">
                                <img
                                    src={c.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.authorName)}&background=random`}
                                    className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5"
                                    alt={c.authorName}
                                />
                                <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2">
                                    <span className="text-xs font-semibold text-gray-800">{c.authorName} </span>
                                    <span className="text-xs text-gray-600">{c.text}</span>
                                </div>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    {/* Comment input */}
                    {uid ? (
                        <div className="px-4 pb-4 flex gap-2 items-center">
                            <img
                                src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || "U")}&background=random`}
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                alt="You"
                            />
                            <div className="flex-1 flex gap-2 bg-gray-100 rounded-full px-4 py-2 items-center">
                                <input
                                    value={commentText}
                                    onChange={e => setCommentText(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleComment()}
                                    placeholder="Add a comment…"
                                    className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400"
                                />
                                <button
                                    onClick={handleComment}
                                    disabled={!commentText.trim() || commentBusy}
                                    className="text-green-700 disabled:opacity-40 transition-opacity"
                                >
                                    {commentBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-xs text-center text-gray-400 pb-3">
                            <a href="/login" className="underline text-green-700">Sign in</a> to comment
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

/* Extracted inline for compact variant */
function CommentsPanel({ postId, uid, user, showComments }: any) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [text, setText] = useState("");
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (!showComments) return;
        const unsub = subscribeToComments(postId, setComments);
        return unsub;
    }, [showComments, postId]);

    const submit = async () => {
        if (!uid || !text.trim() || busy) return;
        setBusy(true);
        try {
            await addComment(postId, text.trim(), {
                uid,
                name: user?.displayName || "Anonymous",
                avatar: user?.photoURL || `https://ui-avatars.com/api/?name=U&background=random`,
            });
            setText("");
        } finally { setBusy(false); }
    };

    return (
        <div className="border-t border-gray-100">
            <div className="max-h-40 overflow-y-auto px-3 py-2 space-y-2">
                {comments.map(c => (
                    <div key={c.id} className="text-xs"><span className="font-semibold">{c.authorName}: </span>{c.text}</div>
                ))}
            </div>
            {uid && (
                <div className="px-3 pb-3 flex gap-2">
                    <input value={text} onChange={e => setText(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && submit()}
                        placeholder="Comment…"
                        className="flex-1 text-xs border border-gray-200 rounded-full px-3 py-1.5 outline-none" />
                    <button onClick={submit} disabled={!text.trim() || busy} className="text-green-700 disabled:opacity-40">
                        <Send className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}
        </div>
    );
}
