"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, MoreVertical, Send, Users, LogOut, ShieldAlert } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ChatWindowProps {
    chatId: string;
    onBack: () => void;
}

function formatMsgTime(ts: any): string {
    if (!ts) return "sending...";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatWindow({ chatId, onBack }: ChatWindowProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState<any[]>([]);
    const [group, setGroup] = useState<any>(null);
    const [inputText, setInputText] = useState("");
    const [sending, setSending] = useState(false);
    const [showMembers, setShowMembers] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Load group info
    useEffect(() => {
        import("@/lib/firestore").then(({ getGroupChat }) => {
            getGroupChat(chatId).then(setGroup);
        });
    }, [chatId]);

    // Real-time messages subscription
    useEffect(() => {
        let unsub: (() => void) | undefined;
        import("@/lib/firestore").then(({ subscribeToChatMessages }) => {
            unsub = subscribeToChatMessages(chatId, (msgs) => {
                setMessages(msgs);
            });
        });
        return () => unsub?.();
    }, [chatId]);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const isMember = user && group?.memberUids?.includes(user.uid);
    const canSend = user && user.emailVerified && isMember;

    const handleSend = async () => {
        if (!inputText.trim()) return;
        if (!user) return toast.error("Sign in to send messages.");
        if (!user.emailVerified) return toast.error("Please verify your email to send messages.");
        if (!isMember) return toast.error("Join the group first.");

        setSending(true);
        const text = inputText.trim();
        setInputText("");

        try {
            const { sendChatMessage } = await import("@/lib/firestore");
            await sendChatMessage(chatId, text, {
                uid: user.uid,
                name: user.displayName || "Nomadi User",
                avatar: user.photoURL || "",
            });
        } catch (err) {
            console.error("Send failed:", err);
            toast.error("Failed to send message.");
        } finally {
            setSending(false);
        }
    };

    const handleLeave = async () => {
        if (!user || !group) return;
        try {
            const { leaveGroup } = await import("@/lib/firestore");
            await leaveGroup(chatId, user.uid);
            toast.success("You left the group.");
            onBack();
        } catch {
            toast.error("Failed to leave group.");
        }
    };

    return (
        <div className="flex flex-col h-full bg-muted/30">
            {/* Header */}
            <div className="h-16 bg-background border-b border-border/50 flex items-center justify-between px-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                        {group?.image && (
                            <img src={group.image} alt={group.name} className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                        `https://ui-avatars.com/api/?name=${encodeURIComponent(group?.name || "G")}&background=random&size=80`;
                                }}
                            />
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">{group?.name || "Loading..."}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {group?.memberCount || 0} members
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    {isMember && (
                        <Button variant="ghost" size="icon" onClick={handleLeave} title="Leave group">
                            <LogOut className="w-4 h-4 text-muted-foreground" />
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => setShowMembers(!showMembers)}>
                        <MoreVertical className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={scrollRef}>
                {messages.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground py-8">
                        No messages yet — be the first to say hello! 👋
                    </div>
                )}
                {messages.map((msg) => {
                    const isMe = msg.senderUid === user?.uid;
                    return (
                        <div key={msg.id} className={cn("flex gap-2 max-w-[80%]", isMe ? "ml-auto flex-row-reverse" : "")}>
                            {!isMe && (
                                <button
                                    onClick={() => msg.senderUid && router.push(`/profile/view?uid=${msg.senderUid}`)}
                                    className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mt-1 bg-muted hover:opacity-80 transition-opacity"
                                    title={`View ${msg.senderName}'s profile`}
                                >
                                    {msg.senderAvatar ? (
                                        <img src={msg.senderAvatar} alt={msg.senderName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                            {(msg.senderName || "?")[0].toUpperCase()}
                                        </div>
                                    )}
                                </button>
                            )}
                            <div className={cn(
                                "p-3 rounded-2xl text-sm shadow-sm max-w-xs",
                                isMe
                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                    : "bg-card border border-border/50 rounded-tl-none"
                            )}>
                                {!isMe && (
                                    <p className="text-[10px] font-bold text-primary mb-1">{msg.senderName}</p>
                                )}
                                <p className="break-words">{msg.text}</p>
                                <p className={cn(
                                    "text-[10px] mt-1 text-right opacity-70",
                                    isMe ? "text-primary-foreground" : "text-muted-foreground"
                                )}>
                                    {formatMsgTime(msg.createdAt)}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input area */}
            <div className="p-4 bg-background border-t border-border/50 flex-shrink-0">
                {!user ? (
                    <p className="text-center text-sm text-muted-foreground">Sign in to participate</p>
                ) : !user.emailVerified ? (
                    <div className="flex items-center justify-center gap-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3">
                        <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                        <span>Verify your email to send messages</span>
                    </div>
                ) : !isMember ? (
                    <p className="text-center text-sm text-muted-foreground">Join this group to send messages</p>
                ) : (
                    <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-xl border border-border/50 focus-within:ring-1 focus-within:ring-primary transition-all">
                        <Input
                            className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 h-9"
                            placeholder="Type a message..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                        />
                        <Button
                            size="icon"
                            className={cn(
                                "h-8 w-8 transition-all",
                                inputText.trim() ? "bg-primary" : "bg-muted text-muted-foreground"
                            )}
                            onClick={handleSend}
                            disabled={!inputText.trim() || sending}
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
