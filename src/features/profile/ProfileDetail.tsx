"use client";

import { Button } from "@/components/ui/button";
import { TravelBadges } from "@/components/profile/TravelBadges";
import { TravelTimeline } from "@/components/profile/TravelTimeline";
import { MapPin, Link as LinkIcon, Settings } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ProfilePage({ id }: { id: string }) {
    // Mock Data (In real app, fetch from API using id)
    const [activeTab, setActiveTab] = useState<"timeline" | "badges" | "wishlist">("timeline");

    return (
        <div className="min-h-screen bg-muted/30 pb-20">
            {/* Cover Photo */}
            <div className="h-60 bg-gradient-to-r from-teal-800 to-emerald-600 relative">
                <div className="absolute inset-0 bg-black/10" />
            </div>

            <div className="container mx-auto px-4 -mt-20 relative z-10">
                <div className="flex flex-col md:flex-row gap-6 items-start">

                    {/* Profile Card */}
                    <div className="w-full md:w-1/3 lg:w-1/4 bg-card rounded-2xl shadow-sm border border-border/50 p-6 flex flex-col items-center text-center">
                        <div className="w-32 h-32 rounded-full border-4 border-card overflow-hidden mb-4 shadow-md">
                            <img
                                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop"
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h1 className="text-2xl font-heading font-bold">Rohan Sharma</h1>
                        <p className="text-muted-foreground text-sm mb-4">@rohan_nomad</p>

                        <p className="text-sm mb-6">
                            Digital nomad exploring the Himalayas. Coffee addict. Storyteller.
                        </p>

                        <div className="flex flex-wrap gap-2 justify-center mb-6">
                            <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">Backpacker</span>
                            <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs rounded-full font-medium">Photographer</span>
                        </div>

                        <div className="grid grid-cols-3 w-full border-t border-b py-4 mb-6">
                            <div>
                                <div className="font-bold text-lg">12</div>
                                <div className="text-xs text-muted-foreground">Countries</div>
                            </div>
                            <div>
                                <div className="font-bold text-lg">1.2k</div>
                                <div className="text-xs text-muted-foreground">Followers</div>
                            </div>
                            <div>
                                <div className="font-bold text-lg">450</div>
                                <div className="text-xs text-muted-foreground">Following</div>
                            </div>
                        </div>

                        <div className="w-full space-y-2">
                            <Button className="w-full">Follow</Button>
                            <Button variant="outline" className="w-full">Message</Button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 w-full">
                        {/* Tabs */}
                        <div className="bg-card rounded-xl border border-border/50 p-1 mb-6 flex gap-1">
                            {["timeline", "badges", "wishlist"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={cn(
                                        "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all capitalize",
                                        activeTab === tab ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground hover:bg-muted/50"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {activeTab === "timeline" && <TravelTimeline />}
                            {activeTab === "badges" && <TravelBadges />}
                            {activeTab === "wishlist" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-card rounded-xl overflow-hidden border border-border/50 group cursor-pointer">
                                        <div className="h-40 overflow-hidden">
                                            <img
                                                src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2070&auto=format&fit=crop"
                                                alt="Camping"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold">Camping in Ladakh</h3>
                                            <p className="text-sm text-muted-foreground">Planned for Aug 2025</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
