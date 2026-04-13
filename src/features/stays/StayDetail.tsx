"use client";

import { BookingModal } from "@/components/stays/BookingModal";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Star, Wifi, Coffee, Wind, Share2, Heart } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

// Mock Data
const STAY_DATA: any = {
    "1": {
        name: "Zostel Manali",
        location: "Old Manali, Himachal Pradesh",
        price: 899,
        rating: 4.8,
        reviews: 342,
        description: "Located in the heart of Old Manali, Zostel Manali offers stunning views of the Himalayas. It's the perfect place to meet fellow travelers, work remotely, or just chill by the cafe.",
        images: [
            "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop"
        ],
        amenities: [
            { icon: Wifi, label: "Fast WiFi" },
            { icon: Coffee, label: "In-house Cafe" },
            { icon: Wind, label: "Mountain View" }
        ],
        houseRules: ["Check-in: 12 PM", "Check-out: 10 AM", "No loud music after 10 PM"]
    }
};

export default function StayDetail({ id }: { id: string }) {
    const data = STAY_DATA[id] || STAY_DATA["1"]; // Fallback for prototype
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Gallery */}
            <div className="relative h-[40vh] md:h-[50vh] grid grid-cols-1 md:grid-cols-2 gap-1">
                <div className="relative h-full">
                    <img src={data.images[0]} alt="Main" className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4">
                        <Button variant="secondary" size="icon" className="rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white" asChild>
                            <Link href="/stays">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="hidden md:grid grid-rows-2 gap-1 h-full">
                    <img src={data.images[1]} alt="Side 1" className="w-full h-full object-cover" />
                    <img src={data.images[2]} alt="Side 2" className="w-full h-full object-cover" />
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <h1 className="text-3xl font-heading font-bold">{data.name}</h1>
                            <div className="flex gap-2">
                                <Button size="icon" variant="ghost" className="rounded-full">
                                    <Share2 className="w-5 h-5" />
                                </Button>
                                <Button size="icon" variant="ghost" className="rounded-full">
                                    <Heart className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-4">
                            <MapPin className="w-4 h-4" /> {data.location}
                        </div>
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold">{data.rating}</span>
                            <span className="text-muted-foreground">({data.reviews} reviews)</span>
                        </div>
                    </div>

                    <hr className="border-border/50" />

                    <section>
                        <h2 className="text-xl font-bold font-heading mb-4">About this place</h2>
                        <p className="text-muted-foreground leading-relaxed">{data.description}</p>
                    </section>

                    <hr className="border-border/50" />

                    <section>
                        <h2 className="text-xl font-bold font-heading mb-4">What this place offers</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {data.amenities.map((item: any, i: number) => (
                                <div key={i} className="flex items-center gap-3">
                                    <item.icon className="w-5 h-5 text-muted-foreground" />
                                    <span>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <hr className="border-border/50" />

                    <section>
                        <h2 className="text-xl font-bold font-heading mb-4">House Rules</h2>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            {data.houseRules.map((rule: string, i: number) => (
                                <li key={i}>{rule}</li>
                            ))}
                        </ul>
                    </section>
                </div>

                {/* Booking Widget */}
                <div className="relative">
                    <div className="sticky top-24 bg-card border border-border rounded-2xl p-6 shadow-lg space-y-6">
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-2xl font-bold">₹{data.price}</span>
                                <span className="text-muted-foreground"> / night</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                                <Star className="w-4 h-4 fill-primary text-primary" /> {data.rating}
                            </div>
                        </div>

                        <div className="border border-border rounded-xl overflow-hidden">
                            <div className="grid grid-cols-2 border-b border-border">
                                <div className="p-3 border-r border-border">
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground">Check-in</div>
                                    <div className="text-sm">Oct 15</div>
                                </div>
                                <div className="p-3">
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground">Check-out</div>
                                    <div className="text-sm">Oct 18</div>
                                </div>
                            </div>
                            <div className="p-3">
                                <div className="text-[10px] uppercase font-bold text-muted-foreground">Guests</div>
                                <div className="text-sm">1 guest</div>
                            </div>
                        </div>

                        <Button className="w-full h-12 text-lg" onClick={() => setIsBookingOpen(true)}>
                            Reserve
                        </Button>

                        <div className="text-center text-xs text-muted-foreground">
                            You won't be charged yet
                        </div>

                        <div className="space-y-3 pt-4 border-t border-border/50">
                            <div className="flex justify-between text-sm">
                                <span className="underline">₹{data.price} x 3 nights</span>
                                <span>₹{data.price * 3}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="underline">Service fee</span>
                                <span>₹500</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t border-border/50">
                                <span>Total</span>
                                <span>₹{data.price * 3 + 500}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                stayName={data.name}
                pricePerNight={data.price}
            />
            <BottomNav />
        </div>
    );
}
