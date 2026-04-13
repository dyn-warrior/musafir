"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Loader2, MapPin, Calendar, Tag, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { subscribeToDMMessages, sendDM, type DMMessage } from "@/lib/firestore";
import { useRouter } from "next/navigation";

interface DMWindowProps {
    dmId: string;
    otherUserName: string;
    otherUserAvatar: string;
    otherUserUid: string;
    onBack: () => void;
}

function formatTime(ts: any): string {
    if (!ts) return "sending…";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function JoinTripBubble({ meta }: { meta: NonNullable<DMMessage["joinTripRequest"]> }) {
    const router = useRouter();
    return (
        <button
            onClick={() => router.push("/go-out")}
            className="w-full mt-2 rounded-xl border border-amber-400/40 bg-amber-50/10 px-3 py-2.5 text-xs space-y-1.5 text-left hover:bg-amber-50/20 transition-colors cursor-pointer"
        >
            <div className="flex items-center justify-between text-amber-400 font-semibold">
                <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" />Join Trip Request</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
            </div>
            <div className="text-muted-foreground font-medium">{meta.tripTitle}</div>
            <div className="flex flex-wrap gap-3 text-muted-foreground/80">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{meta.destination}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{meta.date}</span>
                <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded-full capitalize">{meta.type}</span>
            </div>
        </button>
    );
}

export function DMWindow({ dmId, otherUserName, otherUserAvatar, otherUserUid, onBack }: DMWindowProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState<DMMessage[]>([]);
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const unsub = subscribeToDMMessages(dmId, (msgs) => {
            setMessages(msgs);
            setTimeout(() => {
                if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }, 50);
        });
        return unsub;
    }, [dmId]);

    const handleSend = async () => {
        if (!text.trim() || !user || sending) return;
        setSending(true);
        const msg = text.trim();
        setText("");
        try {
            await sendDM(dmId, msg, {
                uid: user.uid,
                name: user.displayName || user.email?.split("@")[0] || "Me",
                avatar: user.photoURL || "",
            });
        } catch (e) {
            console.error("DM send failed:", e);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
                <button onClick={onBack} className="p-1.5 hover:bg-muted rounded-full md:hidden">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <button onClick={() => router.push(`/profile/view?uid=${otherUserUid}`)} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <img
                        src={otherUserAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUserName)}&background=random`}
                        className="w-9 h-9 rounded-full object-cover"
                        alt={otherUserName}
                    />
                    <div className="text-left">
                        <p className="font-semibold text-sm">{otherUserName}</p>
                        <p className="text-[10px] text-muted-foreground">Direct Message · tap to view profile</p>
                    </div>
                </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.length === 0 && (
                    <p className="text-center text-xs text-muted-foreground pt-8">
                        Start the conversation with {otherUserName}!
                    </p>
                )}
                {messages.map((msg) => {
                    const isMe = msg.senderUid === user?.uid;
                    return (
                        <div key={msg.id} className={`flex gap-2.5 ${isMe ? "flex-row-reverse" : ""}`}>
                            {!isMe && (
                                <button
                                    onClick={() => router.push(`/profile/view?uid=${msg.senderUid}`)}
                                    className="flex-shrink-0 mt-1 hover:opacity-80 transition-opacity"
                                    title={`View ${msg.senderName}'s profile`}
                                >
                                    <img
                                        src={msg.senderAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.senderName)}&background=random`}
                                        className="w-7 h-7 rounded-full object-cover"
                                        alt={msg.senderName}
                                    />
                                </button>
                            )}
                            <div className={`max-w-[75%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                                <div className={`px-3.5 py-2.5 rounded-2xl text-sm ${isMe ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted rounded-tl-sm"}`}>
                                    {msg.text}
                                    {msg.joinTripRequest && <JoinTripBubble meta={msg.joinTripRequest} />}
                                </div>
                                <span className="text-[10px] text-muted-foreground mt-0.5 px-1">
                                    {formatTime(msg.createdAt)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input */}
            <div className="px-4 pb-4 pt-2 border-t border-border/30 flex gap-2 items-center">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                    placeholder="Type a message…"
                    className="flex-1 bg-muted/50 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                    onClick={handleSend}
                    disabled={!text.trim() || sending}
                    className="w-9 h-9 bg-primary text-primary-foreground rounded-full flex items-center justify-center disabled:opacity-40 transition-opacity"
                >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
}
