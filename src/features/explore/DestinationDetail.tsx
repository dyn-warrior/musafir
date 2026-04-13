"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft, MapPin, Calendar, Wallet, Star, Share2, Heart,
    Phone, Mail, MessageCircle, BedDouble, Wifi, User, ExternalLink, Loader2
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getDestinationById, getStaysByDestination, submitDestinationRating, type Stay } from "@/lib/firestore";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function DestinationDetail({ id }: { id: string }) {
    const [data, setData] = useState<any>(null);
    const [stays, setStays] = useState<Stay[]>([]);
    const [loading, setLoading] = useState(true);
    const [submittingRating, setSubmittingRating] = useState(false);
    const { user } = useAuth();

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const [dest, stayList] = await Promise.all([
                getDestinationById(id),
                getStaysByDestination(id),
            ]);
            setData(dest);
            setStays(stayList);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [id]);

    const handleRate = async (score: number) => {
        if (!user) {
            toast.error("Please login to submit a rating");
            return;
        }
        setSubmittingRating(true);
        try {
            await submitDestinationRating(id, user.uid, score);
            toast.success("Thank you for your rating!");
            // Refresh data to show new rating
            const updated = await getDestinationById(id);
            setData(updated);
        } catch (error: any) {
            toast.error(error.message || "Failed to submit rating");
        } finally {
            setSubmittingRating(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!data) return (
        <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
            Destination not found
        </div>
    );

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Hero Image */}
            <div className="relative h-[40vh] md:h-[50vh]">
                <img src={data.image} alt={data.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute top-4 left-4 z-10">
                    <Button variant="secondary" size="icon" className="rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white" asChild>
                        <Link href="/explore">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </Button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="container mx-auto">
                        <div className="flex items-end justify-between">
                            <div>
                                <h1 className="text-4xl md:text-6xl font-heading font-bold mb-2">{data.name}</h1>
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-lg opacity-90">
                                    <span className="flex items-center gap-2">
                                        <MapPin className="w-5 h-5" /> {data.region}
                                    </span>
                                    {data.rating > 0 && (
                                        <span className="flex items-center gap-1.5 font-medium bg-black/30 px-3 py-1 rounded-full backdrop-blur-md">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            {data.rating.toFixed(1)}
                                            <span className="text-sm opacity-80 font-normal">({data.reviewCount} reviews)</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {data.mapUrl && (
                                    <Button variant="secondary" className="rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border-0" asChild>
                                        <a href={data.mapUrl} target="_blank" rel="noreferrer">
                                            <MapPin className="w-4 h-4 mr-2" /> View Map
                                        </a>
                                    </Button>
                                )}
                                <Button size="icon" variant="ghost" className="rounded-full bg-white/10 hover:bg-white/20 text-white">
                                    <Share2 className="w-5 h-5" />
                                </Button>
                                <Button size="icon" variant="ghost" className="rounded-full bg-white/10 hover:bg-white/20 text-white">
                                    <Heart className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Main Info */}
                    <div className="md:col-span-2 space-y-10">
                        <section>
                            <h2 className="text-2xl font-heading font-bold mb-4">Overview</h2>
                            <p className="text-muted-foreground leading-relaxed text-lg">{data.description}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-heading font-bold mb-4">Highlights</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {data.highlights?.map((item: string) => (
                                    <div key={item} className="p-4 rounded-xl bg-muted/50 border border-border/50 flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                                        <span className="font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Photos Gallery */}
                        {data.photos && data.photos.length > 1 && (
                            <section>
                                <h2 className="text-2xl font-heading font-bold mb-4">Gallery</h2>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                    {data.photos.slice(1).map((photo: string, idx: number) => (
                                        <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-muted group cursor-pointer hover:shadow-md transition-shadow">
                                            <img src={photo} alt={`${data.name} ${idx + 2}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ─── Places to Stay ─── */}
                        <section>
                            <h2 className="text-2xl font-heading font-bold mb-6">
                                Places to Stay
                                {stays.length > 0 && (
                                    <span className="ml-2 text-base font-normal text-muted-foreground">({stays.length})</span>
                                )}
                            </h2>

                            {stays.length === 0 ? (
                                <div className="p-8 rounded-2xl border border-dashed border-border text-center text-muted-foreground">
                                    No stays listed yet for {data.name}. Check back soon!
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {stays.map(stay => (
                                        <StayCard key={stay.id} stay={stay} />
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-6 sticky top-24">
                            <h3 className="font-bold text-lg border-b pb-2">Trip Essentials</h3>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">Best Time</div>
                                    <div className="font-semibold">{data.stats?.bestTime}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                    <Wallet className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">Avg Budget</div>
                                    <div className="font-semibold">{data.stats?.budget}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                                    <Star className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">Vibe Score</div>
                                    <div className="font-semibold">{data.vibeScore} / 10</div>
                                </div>
                            </div>

                            <Button className="w-full h-12 text-lg">Plan a Trip Here</Button>

                            <hr className="border-border" />

                            <div>
                                <h4 className="font-semibold mb-3">Rate this Destination</h4>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map(score => {
                                        const currentScore = user ? (data.ratings?.[user.uid] || 0) : 0;
                                        return (
                                            <button
                                                key={score}
                                                onClick={() => handleRate(score)}
                                                disabled={submittingRating}
                                                className="p-1 hover:scale-110 transition-transform disabled:opacity-50"
                                            >
                                                <Star
                                                    className={cn(
                                                        "w-6 h-6",
                                                        score <= currentScore ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground hover:text-yellow-400"
                                                    )}
                                                />
                                            </button>
                                        )
                                    })}
                                    {submittingRating && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    {user ? (data.ratings?.[user.uid] ? "You've rated this destination." : "Click a star to rate.") : "Login to rate."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Stay Card Component ─── */
function StayCard({ stay }: { stay: Stay }) {
    const [imgIdx, setImgIdx] = useState(0);
    const photos = stay.photos || [];

    return (
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Photo gallery */}
            {photos.length > 0 && (
                <div className="relative h-52 md:h-64 bg-muted overflow-hidden">
                    <img
                        src={photos[imgIdx]}
                        alt={stay.name}
                        className="w-full h-full object-cover transition-opacity duration-300"
                    />
                    {photos.length > 1 && (
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                            {photos.map((_, i) => (
                                <button key={i} onClick={() => setImgIdx(i)}
                                    className={cn(
                                        "w-2 h-2 rounded-full transition-all",
                                        i === imgIdx ? "bg-white scale-125" : "bg-white/50"
                                    )}
                                />
                            ))}
                        </div>
                    )}
                    <div className="absolute top-3 left-3">
                        <Badge className="bg-black/60 text-white border-0 backdrop-blur-sm">{stay.type}</Badge>
                    </div>
                    {stay.price > 0 && (
                        <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded-full">
                            ₹{stay.price}/night
                        </div>
                    )}
                </div>
            )}

            <div className="p-5 space-y-4">
                {/* Name + rating */}
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-xl font-bold font-heading">{stay.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5" /> {stay.location}
                        </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-shrink-0 ml-4">
                        {stay.beds > 0 && (
                            <span className="flex items-center gap-1">
                                <BedDouble className="w-4 h-4" /> {stay.beds} beds
                            </span>
                        )}
                    </div>
                </div>

                {/* Description */}
                {stay.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">{stay.description}</p>
                )}

                {/* Amenities */}
                {stay.amenities?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {stay.amenities.map(a => (
                            <Badge key={a} variant="secondary" className="text-xs">{a}</Badge>
                        ))}
                    </div>
                )}

                <hr className="border-border/50" />

                {/* Host */}
                <div className="flex items-center gap-3">
                    {stay.hostAvatar ? (
                        <img src={stay.hostAvatar} alt={stay.hostName} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                    )}
                    <div>
                        <div className="font-medium text-sm">Hosted by {stay.hostName}</div>
                        {stay.hostBio && <div className="text-xs text-muted-foreground line-clamp-1">{stay.hostBio}</div>}
                    </div>
                </div>

                {/* Contact buttons */}
                {(stay.phone || stay.whatsapp || stay.email) && (
                    <div className="flex flex-wrap gap-2 pt-1">
                        {stay.phone && (
                            <a href={`tel:${stay.phone}`}>
                                <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                                    <Phone className="w-3.5 h-3.5" /> Call
                                </Button>
                            </a>
                        )}
                        {stay.whatsapp && (
                            <a href={`https://wa.me/${stay.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                                <Button size="sm" variant="outline" className="gap-1.5 text-xs text-green-600 border-green-200 hover:bg-green-50">
                                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                                </Button>
                            </a>
                        )}
                        {stay.email && (
                            <a href={`mailto:${stay.email}`}>
                                <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                                    <Mail className="w-3.5 h-3.5" /> Email
                                </Button>
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
