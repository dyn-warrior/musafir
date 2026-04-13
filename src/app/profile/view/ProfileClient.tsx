"use client";

import { useEffect, useState } from "react";
import { getUserProfile, getPosts } from "@/lib/firestore";
import { MapPin, Calendar, Grid3X3 } from "lucide-react";
import { BottomNav } from "@/components/layout/BottomNav";
import Link from "next/link";

export default function ProfileClient({ uid }: { uid: string }) {
    const [profile, setProfile] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!uid) return;
        async function load() {
            try {
                const p = await getUserProfile(uid);
                setProfile(p);
                const allPosts = await getPosts();
                const userPosts = allPosts.filter((post: any) =>
                    post.authorUid === uid ||
                    (!post.authorUid && p?.displayName && post.user_name === p.displayName)
                );
                setPosts(userPosts);
            } catch (e) {
                console.error("Failed to load public profile:", e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [uid]);

    if (!uid) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center px-4 pb-20">
                <p className="text-xl font-semibold">No user specified</p>
                <Link href="/" className="text-primary underline text-sm">Go home</Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center px-4 pb-20">
                <p className="text-xl font-semibold">User not found</p>
                <Link href="/" className="text-primary underline text-sm">Go home</Link>
            </div>
        );
    }

    const displayName = profile.displayName || "Musafir User";
    const photoURL = profile.photoURL;
    const initials = displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-gray-900 font-sans pb-24">
            <div className="max-w-2xl mx-auto py-12 px-6">

                {/* Back link */}
                <button
                    onClick={() => window.history.back()}
                    className="text-sm text-gray-400 hover:text-gray-700 mb-8 inline-flex items-center gap-1"
                >
                    ← Back
                </button>

                {/* Avatar + Name */}
                <div className="flex flex-col items-center text-center space-y-4 mb-10 mt-4">
                    <div className="relative">
                        {photoURL ? (
                            <img src={photoURL} alt={displayName} className="w-28 h-28 rounded-full border-4 border-white shadow-xl object-cover" />
                        ) : (
                            <div className="w-28 h-28 rounded-full bg-green-700 flex items-center justify-center border-4 border-white shadow-xl">
                                <span className="text-3xl font-bold text-white">{initials}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-1">
                        <h1 className="font-heading text-2xl font-bold">{displayName}</h1>
                        {profile.bio && (
                            <p className="text-gray-600 max-w-sm text-sm leading-relaxed">{profile.bio}</p>
                        )}
                        {profile.location && (
                            <p className="text-gray-400 text-xs flex items-center justify-center gap-1">
                                <MapPin className="w-3 h-3" /> {profile.location}
                            </p>
                        )}
                        {profile.joinedAt && (
                            <p className="text-gray-400 text-xs flex items-center justify-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Joined {profile.joinedAt.toDate
                                    ? profile.joinedAt.toDate().toLocaleDateString("en-US", { month: "long", year: "numeric" })
                                    : "recently"}
                            </p>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="flex gap-8 py-1">
                        <div className="text-center">
                            <p className="font-bold text-lg">{posts.length}</p>
                            <p className="text-xs text-gray-400">Posts</p>
                        </div>
                    </div>
                </div>

                {/* Posts grid */}
                <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4 justify-center">
                        <Grid3X3 className="w-4 h-4" /> Posts
                    </div>
                    {posts.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <Grid3X3 className="w-10 h-10 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No posts yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-1">
                            {posts.map((post: any) => (
                                <div key={post.id} className="aspect-square overflow-hidden rounded-sm cursor-pointer hover:opacity-80 transition">
                                    {post.image ? (
                                        <img src={post.image} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-muted flex items-center justify-center p-2">
                                            <p className="text-xs text-center text-muted-foreground line-clamp-3">{post.caption}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
