"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, MapPin, Calendar, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { addGoOutRequest } from "@/lib/firestore";

interface PostNeedModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPosted?: () => void;
}

export function PostNeedModal({ isOpen, onClose, onPosted }: PostNeedModalProps) {
    const [title, setTitle] = useState("");
    const [destination, setDestination] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [activityType, setActivityType] = useState("");
    const [budget, setBudget] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    if (!isOpen) return null;

    const formatDateRange = () => {
        if (!dateFrom) return "";
        const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
        return dateTo ? `${fmt(dateFrom)} – ${fmt(dateTo)}` : fmt(dateFrom);
    };

    const reset = () => {
        setTitle(""); setDestination(""); setDateFrom(""); setDateTo("");
        setActivityType(""); setBudget(""); setDescription("");
    };

    const handleSubmit = async () => {
        if (!title || !destination || !dateFrom || !activityType) {
            alert("Please fill in Trip Title, Destination, Dates, and Activity Type.");
            return;
        }
        if (dateTo && dateTo < dateFrom) {
            alert("End date cannot be before start date.");
            return;
        }
        if (!user) {
            alert("Please sign in to post a travel request.");
            return;
        }

        setLoading(true);
        try {
            await addGoOutRequest({
                authorUid: user.uid,
                user: {
                    name: user.displayName || user.email?.split("@")[0] || "Musafir User",
                    age: 0,
                    image: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "N")}&background=random`,
                },
                trip: {
                    title,
                    destination,
                    date: formatDateRange(),
                    dateFromISO: dateFrom,
                    dateToISO: dateTo || dateFrom,
                    type: activityType,
                    budget: budget || "Flexible",
                },
                description,
            });
            reset();
            onPosted?.();
            onClose();
        } catch (err) {
            console.error("Error posting request:", err);
            alert("Failed to post request. Make sure you are signed in.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="font-bold text-lg">Post Travel Need</h3>
                    <button onClick={onClose} className="p-1 hover:bg-muted rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Trip Title *</label>
                        <Input
                            placeholder="e.g. Weekend Trek to Triund"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Destination + Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Destination *</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className="pl-9"
                                    placeholder="McLeod Ganj"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Start Date *</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={e => setDateFrom(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                        </div>
                    </div>

                    {/* End date */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">End Date <span className="text-muted-foreground font-normal">(optional)</span></label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                            <input
                                type="date"
                                value={dateTo}
                                min={dateFrom}
                                onChange={e => setDateTo(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                        {dateFrom && dateTo && (
                            <p className="text-xs text-muted-foreground">{formatDateRange()}</p>
                        )}
                    </div>

                    {/* Budget */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Budget (optional)</label>
                        <Input
                            placeholder="e.g. ₹5000 per person"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                        />
                    </div>

                    {/* Activity Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Activity Type *</label>
                        <div className="flex flex-wrap gap-2">
                            {["Trekking", "Road Trip", "Backpacking", "Event"].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setActivityType(type)}
                                    className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${activityType === type
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "border-border hover:border-primary hover:bg-primary/5"
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="Looking for 2-3 people to join me..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <Button
                        className="w-full h-11"
                        onClick={handleSubmit}
                        disabled={loading || !user}
                    >
                        {loading ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Posting…</>
                        ) : !user ? (
                            "Sign in to Post"
                        ) : (
                            "Post Request"
                        )}
                    </Button>

                    {!user && (
                        <p className="text-xs text-center text-muted-foreground">
                            <a href="/login" className="underline text-primary">Sign in</a> to post a travel request
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
