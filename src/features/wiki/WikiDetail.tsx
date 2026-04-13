"use client";

import { WikiSidebar } from "@/components/wiki/WikiSidebar";
import { AISummary } from "@/components/wiki/AISummary";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit2, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock Data
const WIKI_DATA_COLLECTION: any = {
    "manali": {
        name: "Manali",
        region: "Himachal Pradesh",
        image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop",
        aiSummary: "Manali is a high-altitude Himalayan resort town in India's northern Himachal Pradesh state. It has a reputation as a backpacking center and honeymoon destination. Set on the Beas River, it's a gateway for skiing in the Solang Valley and trekking in Parvati Valley.",
        sections: {
            overview: "Manali is a resort town nestled in the mountains of the Indian state of Himachal Pradesh near the northern end of the Kullu Valley in the Beas River Valley. It is located in the Kullu district, about 270 km (168 mi) north of the state capital, Shimla.",
            transport: "The nearest airport is Bhuntar (Kullu), 50km away. Volvo buses from Delhi are the most popular way to reach, taking about 12-14 hours. Taxis and self-drive rentals are available for local commute.",
            stays: "Old Manali is the hub for backpackers with numerous hostels (Zostel, Alt Life) and homestays. New Manali offers luxury hotels and family resorts. Vashisht is known for its hot springs and quieter vibe.",
            food: "Don't miss the trout fish, a local specialty. Old Manali cafes offer great Israeli, Italian, and Continental food. Try Dylan's Toasted and Roasted for cookies and coffee.",
            safety: "Manali is generally very safe for travelers. However, be cautious of slippery roads during monsoons and winters. Altitude sickness can be an issue if heading to Rohtang Pass.",
            spots: "Hadimba Temple, Solang Valley, Jogini Waterfalls, Vashisht Temple, and Mall Road are must-visit spots."
        }
    }
};

export default function WikiDetail({ id }: { id: string }) {
    const data = WIKI_DATA_COLLECTION[id] || WIKI_DATA_COLLECTION["manali"]; // Fallback for prototype
    const [activeSection, setActiveSection] = useState("overview");

    const scrollToSection = (sectionId: string) => {
        setActiveSection(sectionId);
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header Image */}
            <div className="relative h-64 md:h-80 w-full">
                <img src={data.image} alt={data.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute top-4 left-4">
                    <Button variant="secondary" size="icon" className="rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white" asChild>
                        <Link href="/wiki">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:pl-64 text-white bg-gradient-to-t from-background to-transparent">
                    <div className="max-w-4xl mx-auto flex justify-between items-end">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2">{data.name}</h1>
                            <p className="text-lg opacity-90">{data.region}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="secondary" className="gap-2">
                                <Edit2 className="w-4 h-4" /> Edit
                            </Button>
                            <Button size="icon" variant="ghost" className="rounded-full bg-white/10 hover:bg-white/20 text-white">
                                <Share2 className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex md:pl-64">
                {/* Sidebar */}
                <div className="hidden md:block sticky top-0 h-screen">
                    <WikiSidebar activeSection={activeSection} onSelectSection={scrollToSection} />
                </div>

                {/* Content */}
                <main className="flex-1 p-6 max-w-4xl mx-auto pb-24">
                    <AISummary summary={data.aiSummary} />

                    <div className="space-y-12">
                        <section id="overview" className="scroll-mt-24">
                            <h2 className="text-2xl font-heading font-bold mb-4 text-primary">Overview</h2>
                            <p className="text-lg leading-relaxed text-muted-foreground">{data.sections.overview}</p>
                        </section>

                        <section id="transport" className="scroll-mt-24">
                            <h2 className="text-2xl font-heading font-bold mb-4 text-primary">Transport</h2>
                            <p className="text-lg leading-relaxed text-muted-foreground">{data.sections.transport}</p>
                        </section>

                        <section id="stays" className="scroll-mt-24">
                            <h2 className="text-2xl font-heading font-bold mb-4 text-primary">Where to Stay</h2>
                            <p className="text-lg leading-relaxed text-muted-foreground">{data.sections.stays}</p>
                        </section>

                        <section id="food" className="scroll-mt-24">
                            <h2 className="text-2xl font-heading font-bold mb-4 text-primary">Food Guide</h2>
                            <p className="text-lg leading-relaxed text-muted-foreground">{data.sections.food}</p>
                        </section>

                        <section id="safety" className="scroll-mt-24">
                            <h2 className="text-2xl font-heading font-bold mb-4 text-primary">Safety Tips</h2>
                            <p className="text-lg leading-relaxed text-muted-foreground">{data.sections.safety}</p>
                        </section>

                        <section id="spots" className="scroll-mt-24">
                            <h2 className="text-2xl font-heading font-bold mb-4 text-primary">Photo Spots</h2>
                            <p className="text-lg leading-relaxed text-muted-foreground">{data.sections.spots}</p>
                        </section>
                    </div>
                </main>
            </div>

            <BottomNav />
        </div>
    );
}
