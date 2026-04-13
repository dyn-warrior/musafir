"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { EditProfileModal } from "./EditProfileModal";
import { getUserProfile, getPosts, getMyGoOutRequests, deleteGoOutRequest, updateGoOutRequest, getStoriesByUser, type GoOutRequest, type Story } from "@/lib/firestore";
import { MapPin, Calendar, Grid3X3, Bookmark, Settings, Luggage, Pencil, Trash2, Check, X, Loader2, ImagePlay } from "lucide-react";
import Link from "next/link";
import { StoryCard } from "@/components/feed/StoryCard";

const TABS = ["Stories", "My Trips", "Settings"] as const;
type Tab = typeof TABS[number];

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [userPosts, setUserPosts] = useState<any[]>([]);
    const [myStories, setMyStories] = useState<Story[]>([]);
    const [myTrips, setMyTrips] = useState<GoOutRequest[]>([]);
    const [activeTab, setActiveTab] = useState<Tab>("Stories");
    const [profileLoading, setProfileLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTrip, setEditingTrip] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Record<string, any>>({});
    const [deletingTrip, setDeletingTrip] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;
        async function load() {
            try {
                const firestoreProfile = await getUserProfile(user!.uid);
                setProfile(firestoreProfile || { uid: user!.uid, displayName: user!.displayName || "Musafir User", email: user!.email || "", photoURL: user!.photoURL || "", bio: "", location: "" });

                const [trips, stories] = await Promise.all([
                    getMyGoOutRequests(user!.uid),
                    getStoriesByUser(user!.uid),
                ]);
                setMyTrips(trips);
                setMyStories(stories);
            } catch (err) {
                console.error("Failed to load profile:", err);
            } finally {
                setProfileLoading(false);
            }
        }
        load();
    }, [user]);

    if (authLoading || profileLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
                <p className="text-xl font-semibold">Sign in to view your profile</p>
                <Link href="/login" className="px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary/90">
                    Sign In
                </Link>
            </div>
        );
    }

    const displayName = profile?.displayName || user.displayName || "Musafir User";
    const photoURL = profile?.photoURL || user.photoURL;
    const initials = displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

    const handleProfileUpdate = (updated: any) => {
        setProfile((prev: any) => ({ ...prev, ...updated }));
    };

    const handleDeleteTrip = async (id: string) => {
        if (!confirm("Delete this trip request?")) return;
        setDeletingTrip(id);
        try {
            await deleteGoOutRequest(id);
            setMyTrips(ts => ts.filter(t => t.id !== id));
        } catch { alert("Failed to delete."); }
        finally { setDeletingTrip(null); }
    };

    const startEdit = (trip: GoOutRequest) => {
        setEditingTrip(trip.id);
        setEditForm({ title: trip.trip?.title, destination: trip.trip?.destination, description: trip.description, budget: trip.trip?.budget });
    };

    const saveEdit = async (trip: GoOutRequest) => {
        try {
            await updateGoOutRequest(trip.id, {
                description: editForm.description,
                trip: { ...trip.trip, title: editForm.title, destination: editForm.destination, budget: editForm.budget },
            });
            setMyTrips(ts => ts.map(t => t.id === trip.id ? { ...t, description: editForm.description, trip: { ...t.trip, title: editForm.title, destination: editForm.destination, budget: editForm.budget } } : t));
            setEditingTrip(null);
        } catch { alert("Failed to save."); }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-gray-900 font-sans pb-20">
            <div className="max-w-3xl mx-auto py-12 px-6">

                {/* Avatar + Name */}
                <div className="flex flex-col items-center text-center space-y-4 mb-10">
                    <div className="relative">
                        {photoURL ? (
                            <img
                                src={photoURL}
                                alt={displayName}
                                className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-green-700 flex items-center justify-center border-4 border-white shadow-xl">
                                <span className="text-4xl font-bold text-white">{initials}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-1">
                        <h1 className="font-heading text-3xl font-bold">{displayName}</h1>
                        <p className="text-gray-500 text-sm">{user.email}</p>
                        {profile?.bio && (
                            <p className="text-gray-600 max-w-sm text-sm leading-relaxed">{profile.bio}</p>
                        )}
                        {profile?.location && (
                            <p className="text-gray-400 text-xs flex items-center justify-center gap-1">
                                <MapPin className="w-3 h-3" /> {profile.location}
                            </p>
                        )}
                        {profile?.joinedAt && (
                            <p className="text-gray-400 text-xs flex items-center justify-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Joined {profile.joinedAt.toDate
                                    ? profile.joinedAt.toDate().toLocaleDateString("en-US", { month: "long", year: "numeric" })
                                    : "recently"}
                            </p>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="flex gap-8 py-2">
                        <div className="text-center">
                            <p className="font-bold text-lg">{userPosts.length}</p>
                            <p className="text-xs text-gray-400">Posts</p>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-lg">{profile?.followersCount || 0}</p>
                            <p className="text-xs text-gray-400">Followers</p>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-lg">{profile?.followingCount || 0}</p>
                            <p className="text-xs text-gray-400">Following</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="px-8 py-2 border border-gray-300 rounded-full text-sm font-semibold hover:bg-gray-50 transition"
                    >
                        Edit Profile
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-8">
                    {TABS.map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold uppercase tracking-widest transition-colors ${activeTab === tab ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            {tab === "Stories" && <ImagePlay className="w-4 h-4" />}
                            {tab === "My Trips" && <Luggage className="w-4 h-4" />}
                            {tab === "Settings" && <Settings className="w-4 h-4" />}
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {/* Stories tab */}
                {activeTab === "Stories" && (
                    <>
                        {myStories.length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <ImagePlay className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p className="font-medium">No active stories</p>
                                <p className="text-sm mt-1">Your stories will appear here for 24 hours after posting.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {myStories.map(story => (
                                    <StoryCard key={story.id} story={story} />
                                ))}
                            </div>
                        )}
                    </>
                )}
                {activeTab === "My Trips" && (
                    <div className="space-y-4" id="my-trips">
                        {myTrips.length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <Luggage className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p className="font-medium">No trip requests posted yet</p>
                                <p className="text-sm mt-1">Post a trip on the <Link href="/go-out" className="text-primary underline">Go Out</Link> page to find travel partners.</p>
                            </div>
                        ) : myTrips.map(trip => (
                            <div key={trip.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
                                {editingTrip === trip.id ? (
                                    /* Edit form */
                                    <div className="space-y-3">
                                        <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Trip title" value={editForm.title || ""} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />
                                        <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Destination" value={editForm.destination || ""} onChange={e => setEditForm(f => ({ ...f, destination: e.target.value }))} />
                                        <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Budget" value={editForm.budget || ""} onChange={e => setEditForm(f => ({ ...f, budget: e.target.value }))} />
                                        <textarea className="w-full border rounded-lg px-3 py-2 text-sm resize-none" rows={3} placeholder="Description" value={editForm.description || ""} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
                                        <div className="flex gap-2">
                                            <button onClick={() => saveEdit(trip)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90"><Check className="w-3.5 h-3.5" /> Save</button>
                                            <button onClick={() => setEditingTrip(null)} className="flex-1 flex items-center justify-center gap-1.5 py-2 border rounded-lg text-sm hover:bg-gray-50"><X className="w-3.5 h-3.5" /> Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    /* View mode */
                                    <>
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="font-semibold">{trip.trip?.title || "Untitled"}</p>
                                                <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{trip.trip?.destination}</span>
                                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{trip.trip?.date}</span>
                                                    <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded-full">{trip.trip?.type}</span>
                                                </div>
                                                {trip.description && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{trip.description}</p>}
                                            </div>
                                            <div className="flex gap-2 flex-shrink-0">
                                                <button onClick={() => startEdit(trip)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Edit"><Pencil className="w-4 h-4" /></button>
                                                <button onClick={() => handleDeleteTrip(trip.id)} disabled={deletingTrip === trip.id} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 disabled:opacity-40" title="Delete">
                                                    {deletingTrip === trip.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}


                {activeTab === "Settings" && (
                    <div className="space-y-3 max-w-md mx-auto">
                        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
                            <h3 className="font-semibold text-sm uppercase tracking-widest text-gray-400">Account</h3>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Email</span>
                                <span className="text-sm text-gray-400">{user.email}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Display Name</span>
                                <span className="text-sm text-gray-400">{displayName}</span>
                            </div>
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="w-full mt-2 py-2 rounded-xl bg-muted text-sm font-medium hover:bg-muted/80 transition"
                            >
                                Edit Profile Details
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                profile={profile}
                authUser={user}
                onUpdate={handleProfileUpdate}
            />
        </div>
    );
}
