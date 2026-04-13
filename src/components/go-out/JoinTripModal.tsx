"use client";

import { useState } from "react";
import { X, Send, Loader2, MapPin, Calendar, Tag, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getOrCreateDM, sendDM } from "@/lib/firestore";
import { useRouter } from "next/navigation";

interface JoinTripModalProps {
    isOpen: boolean;
    onClose: () => void;
    trip: {
        title: string;
        destination: string;
        date: string;
        type: string;
    };
    /** UID of the person who posted the trip */
    posterUid: string;
    posterName: string;
    posterAvatar: string;
}

export function JoinTripModal({ isOpen, onClose, trip, posterUid, posterName, posterAvatar }: JoinTripModalProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [dmId, setDmId] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSend = async () => {
        if (!user) { router.push("/login"); return; }
        if (!posterUid) {
            alert("This trip request doesn't have contact info — the poster may need to re-post the trip.");
            return;
        }
        setSending(true);
        try {
            const myAvatar = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "U")}&background=random`;
            const dmId = await getOrCreateDM(
                user.uid,
                { name: user.displayName || user.email?.split("@")[0] || "Musafir User", avatar: myAvatar },
                posterUid,
                { name: posterName, avatar: posterAvatar }
            );
            const text = message.trim() || `Hi! I'd like to join your trip to ${trip?.destination ?? "your destination"}.`;
            await sendDM(dmId, text, { uid: user.uid, name: user.displayName || "Me", avatar: myAvatar }, {
                tripTitle: trip?.title ?? "",
                destination: trip?.destination ?? "",
                date: trip?.date ?? "",
                type: trip?.type ?? "",
            });
            setSent(true);
            setDmId(dmId);
        } catch (err: any) {
            console.error("Join trip DM failed:", err?.code, err?.message, err);
            alert(`Failed to send request: ${err?.message || "Please try again."}`);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="font-bold text-base flex items-center gap-2">
                        <Tag className="w-4 h-4 text-amber-400" />
                        {sent ? "Request Sent!" : "Join This Trip"}
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-muted rounded-full"><X className="w-4 h-4" /></button>
                </div>

                {sent ? (
                    /* Success state */
                    <div className="p-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                            <Send className="w-7 h-7 text-green-500" />
                        </div>
                        <p className="font-semibold text-sm">Your join request was sent to <span className="text-primary">{posterName}</span>!</p>
                        <p className="text-xs text-muted-foreground">Check your messages to continue the conversation.</p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={onClose} className="px-4 py-2 text-sm border border-border rounded-xl hover:bg-muted transition-colors">Close</button>
                            <button
                                onClick={() => {
                                    onClose();
                                    const params = new URLSearchParams({
                                        dm: dmId || "",
                                        uname: posterName,
                                        uavatar: posterAvatar,
                                    });
                                    router.push(`/community?${params.toString()}`);
                                }}
                                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-1.5"
                            >
                                Open DM <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-5 space-y-4">
                        {/* Trip preview card */}
                        <div className="rounded-xl border border-amber-400/30 bg-amber-50/5 p-3.5 space-y-2">
                            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                                <Tag className="w-3.5 h-3.5" /> Join Trip Request
                            </div>
                            <p className="font-semibold text-sm">{trip?.title}</p>
                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{trip?.destination}</span>
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{trip?.date}</span>
                                <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded-full">{trip?.type}</span>
                            </div>
                        </div>

                        {/* Recipient */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <img src={posterAvatar} className="w-6 h-6 rounded-full object-cover" alt={posterName} />
                            Sending to <span className="text-foreground font-medium">{posterName}</span>
                        </div>

                        {/* Optional message */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Message <span className="text-muted-foreground font-normal">(optional)</span></label>
                            <textarea
                                rows={3}
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder={`Hi! I'd like to join your trip to ${trip?.destination ?? "your destination"}.`}
                                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button onClick={onClose} className="flex-1 py-2.5 text-sm border border-border rounded-xl hover:bg-muted transition-colors">Cancel</button>
                            <button
                                onClick={handleSend}
                                disabled={sending || !user}
                                className="flex-1 py-2.5 text-sm bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                            >
                                {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : <><Send className="w-4 h-4" /> Send Request</>}
                            </button>
                        </div>

                        {!user && <p className="text-xs text-center text-muted-foreground"><a href="/login" className="underline text-primary">Sign in</a> to send a join request</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
