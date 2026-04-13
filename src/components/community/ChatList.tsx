"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Users, Lock, Globe, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { searchUsers, getOrCreateDM, type UserProfile } from "@/lib/firestore";

interface ChatListProps {
    activeChatId: string;
    onSelectChat: (id: string, type?: "group" | "dm", meta?: { name: string; avatar: string; uid?: string }) => void;
    onOpenCreateModal: () => void;
}

function formatTime(ts: any): string {
    if (!ts) return "";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000;
    if (diff < 60) return "now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
}

export function ChatList({ activeChatId, onSelectChat, onOpenCreateModal }: ChatListProps) {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<"groups" | "people">("groups");
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [joining, setJoining] = useState<string | null>(null);

    // People search state
    const [peopleResults, setPeopleResults] = useState<UserProfile[]>([]);
    const [peopleLoading, setPeopleLoading] = useState(false);
    const [openingDM, setOpeningDM] = useState<string | null>(null);

    useEffect(() => {
        let unsub: (() => void) | undefined;
        import("@/lib/firestore").then(({ subscribeToGroups }) => {
            unsub = subscribeToGroups((data) => {
                setGroups(data);
                setLoading(false);
            });
        });
        return () => unsub?.();
    }, []);

    // Search people as user types
    useEffect(() => {
        if (activeTab !== "people" || !search.trim()) { setPeopleResults([]); return; }
        setPeopleLoading(true);
        const t = setTimeout(async () => {
            try {
                const results = await searchUsers(search.trim());
                // Filter out self
                setPeopleResults(results.filter(u => u.uid !== user?.uid));
            } catch { setPeopleResults([]); }
            finally { setPeopleLoading(false); }
        }, 350);
        return () => clearTimeout(t);
    }, [search, activeTab, user?.uid]);

    const handleJoin = async (e: React.MouseEvent, groupId: string) => {
        e.stopPropagation();
        if (!user) return toast.error("Sign in to join groups.");
        setJoining(groupId);
        try {
            const { joinGroup } = await import("@/lib/firestore");
            await joinGroup(groupId, user.uid);
            toast.success("Joined group! 🎉");
            onSelectChat(groupId, "group");
        } catch { toast.error("Failed to join group."); }
        finally { setJoining(null); }
    };

    const handleOpenDM = async (person: UserProfile) => {
        if (!user) return toast.error("Sign in to send messages.");
        setOpeningDM(person.uid);
        try {
            const myAvatar = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "U")}&background=random`;
            const dmId = await getOrCreateDM(
                user.uid,
                { name: user.displayName || "Me", avatar: myAvatar },
                person.uid,
                { name: person.displayName || person.uid, avatar: person.photoURL || "" }
            );
            onSelectChat(dmId, "dm", { name: person.displayName || "User", avatar: person.photoURL || "", uid: person.uid });
        } catch { toast.error("Could not open conversation."); }
        finally { setOpeningDM(null); }
    };

    const filteredGroups = groups.filter(g =>
        g.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-card border-r border-border/50">
            {/* Header */}
            <div className="p-4 border-b border-border/50 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                        <button
                            onClick={() => { setActiveTab("groups"); setSearch(""); }}
                            className={cn("px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                                activeTab === "groups" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}
                        >
                            <Users className="w-4 h-4 inline mr-1" />Groups
                        </button>
                        <button
                            onClick={() => { setActiveTab("people"); setSearch(""); }}
                            className={cn("px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                                activeTab === "people" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}
                        >
                            <MessageCircle className="w-4 h-4 inline mr-1" />People
                        </button>
                    </div>
                    {activeTab === "groups" && (
                        <Button size="icon" variant="ghost" onClick={() => { if (!user) return toast.error("Sign in first."); onOpenCreateModal(); }} title="Create group">
                            <Plus className="w-5 h-5" />
                        </Button>
                    )}
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={activeTab === "groups" ? "Search groups…" : "Search people by name…"}
                        className="pl-9 bg-muted/50 border-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {activeTab === "groups" ? (
                    loading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
                                <div className="w-12 h-12 rounded-full bg-muted animate-pulse flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                                    <div className="h-2 bg-muted rounded animate-pulse w-1/2" />
                                </div>
                            </div>
                        ))
                    ) : filteredGroups.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            {search ? "No groups match your search" : "No groups yet — create one!"}
                        </div>
                    ) : (
                        filteredGroups.map((group) => {
                            const isMember = user && group.memberUids?.includes(user.uid);
                            return (
                                <button
                                    key={group.id}
                                    onClick={() => onSelectChat(group.id, "group")}
                                    className={cn(
                                        "w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left",
                                        activeChatId === group.id ? "bg-muted" : "hover:bg-muted/50"
                                    )}
                                >
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-muted">
                                        <img
                                            src={group.image}
                                            alt={group.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(group.name)}&background=random&size=96`; }}
                                        />
                                        <div className="absolute bottom-0 right-0 bg-background rounded-full p-0.5">
                                            {group.type === "private" ? <Lock className="w-3 h-3 text-muted-foreground" /> : <Globe className="w-3 h-3 text-green-600" />}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <span className="font-semibold truncate text-sm">{group.name}</span>
                                            <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-1">{formatTime(group.lastMessageAt)}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate">{group.lastMessage}</p>
                                        <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                            <Users className="w-2.5 h-2.5" />{group.memberCount || 1} members
                                        </p>
                                    </div>
                                    {!isMember && group.type === "public" && (
                                        <button onClick={(e) => handleJoin(e, group.id)} disabled={joining === group.id}
                                            className="flex-shrink-0 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 font-medium transition-colors">
                                            {joining === group.id ? "…" : "Join"}
                                        </button>
                                    )}
                                </button>
                            );
                        })
                    )
                ) : (
                    /* === People tab === */
                    search.trim() === "" ? (
                        <div className="text-center py-10 text-muted-foreground text-sm space-y-1">
                            <MessageCircle className="w-8 h-8 mx-auto opacity-30 mb-2" />
                            <p>Search for a person's name</p>
                            <p className="text-xs">to start a direct message</p>
                        </div>
                    ) : peopleLoading ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                                <div className="h-3 bg-muted rounded animate-pulse flex-1" />
                            </div>
                        ))
                    ) : peopleResults.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">No users found for "{search}"</div>
                    ) : (
                        peopleResults.map((person) => (
                            <button
                                key={person.uid}
                                onClick={() => handleOpenDM(person)}
                                disabled={openingDM === person.uid}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
                            >
                                <img
                                    src={person.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.displayName || person.uid)}&background=random&size=80`}
                                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                    alt={person.displayName}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm truncate">{person.displayName || "Musafir User"}</p>
                                    {person.location && <p className="text-xs text-muted-foreground truncate">{person.location}</p>}
                                </div>
                                <MessageCircle className={cn("w-4 h-4 flex-shrink-0 text-primary", openingDM === person.uid && "animate-pulse")} />
                            </button>
                        ))
                    )
                )}
            </div>
        </div>
    );
}
