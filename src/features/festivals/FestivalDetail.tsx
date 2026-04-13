"use client";

import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Ticket, Share2, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock Data
const FESTIVAL_DATA: any = {
    "1": {
        name: "Ziro Festival of Music",
        location: "Ziro Valley, Arunachal Pradesh",
        dates: "Sep 28 - Oct 1, 2025",
        image: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=2070&auto=format&fit=crop",
        description: "India's greatest outdoor music festival held in the stunning Ziro Valley. It features independent artists from across the world and showcases the rich culture of the Apatani tribe.",
        price: "₹4,000 onwards",
        attendees: [
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop"
        ],
        sections: {
            vibe: "Eco-friendly, Chill, Indie Music, Rice Beer, Camping under stars.",
            tips: "Book homestays months in advance. Carry gumboots for the muddy terrain. Try the local pork dishes."
        }
    }
};

export default function FestivalDetail({ id }: { id: string }) {
    const data = FESTIVAL_DATA[id] || FESTIVAL_DATA["1"]; // Fallback for prototype
    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero */}
            <div className="relative h-[50vh]">
                <img src={data.image} alt={data.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-transparent" />

                <div className="absolute top-4 left-4">
                    <Button variant="secondary" size="icon" className="rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white" asChild>
                        <Link href="/festivals">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-10">
                <div className="bg-card rounded-2xl border border-border shadow-xl p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">{data.name}</h1>
                            <div className="flex flex-col gap-2 text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> {data.location}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> {data.dates}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button size="icon" variant="outline" className="rounded-full">
                                <Share2 className="w-4 h-4" />
                            </Button>
                            <Button className="rounded-full px-6">
                                I'm Interested
                            </Button>
                        </div>
                    </div>

                    <hr className="border-border/50 my-6" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">
                            <section>
                                <h2 className="text-xl font-bold font-heading mb-3">About the Event</h2>
                                <p className="text-muted-foreground leading-relaxed">{data.description}</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold font-heading mb-3">The Vibe</h2>
                                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 text-primary-foreground/80">
                                    {data.sections.vibe}
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold font-heading mb-3">Pro Tips</h2>
                                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                    {data.sections.tips.split('. ').map((tip: string, i: number) => (
                                        <li key={i}>{tip.replace('.', '')}</li>
                                    ))}
                                </ul>
                            </section>
                        </div>

                        <div className="space-y-6">
                            <div className="p-5 bg-muted/50 rounded-xl border border-border/50 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">Entry Fee</span>
                                    <span className="font-bold text-lg">{data.price}</span>
                                </div>
                                <Button className="w-full gap-2" disabled>
                                    <Ticket className="w-4 h-4" /> Book Tickets
                                </Button>
                                <p className="text-xs text-center text-muted-foreground">Booking opens soon</p>
                            </div>

                            <div>
                                <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                                    <Users className="w-4 h-4" /> Who's Going
                                </h3>
                                <div className="flex items-center -space-x-3">
                                    {data.attendees.map((img: string, i: number) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-background overflow-hidden">
                                            <img src={img} alt="User" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                                        +124
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
