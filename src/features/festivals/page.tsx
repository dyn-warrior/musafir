"use client";

import { FestivalCard } from "@/components/festivals/FestivalCard";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function FestivalPage() {
    const [activeMonth, setActiveMonth] = useState("All");
    const [festivals, setFestivals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        import('@/lib/firestore').then(({ getFestivals }) =>
            getFestivals()
                .then((data: any[]) => { setFestivals(data); setLoading(false); })
                .catch(() => setLoading(false))
        );
    }, []);

    const filteredFestivals = activeMonth === "All"
        ? festivals
        : festivals.filter(f => f.month === activeMonth);

    return (
        <div className="min-h-screen bg-muted/30 pb-20 md:pl-64">
            {/* Hero */}
            <div className="bg-background border-b border-border/50 pb-8">
                <div className="relative h-64 md:h-80 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=2070&auto=format&fit=crop"
                        alt="Festivals"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-center p-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">Cultural Calendar</h1>
                            <p className="text-lg text-gray-200">Discover India's most vibrant celebrations</p>
                        </div>
                    </div>
                </div>

                {/* Month Picker */}
                <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">
                    <div className="bg-card rounded-xl border border-border shadow-lg p-2 flex items-center gap-2 overflow-x-auto scrollbar-hide">
                        <button
                            onClick={() => setActiveMonth("All")}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all",
                                activeMonth === "All" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                            )}
                        >
                            All
                        </button>
                        <div className="w-px h-6 bg-border mx-1" />
                        {MONTHS.map((month) => (
                            <button
                                key={month}
                                onClick={() => setActiveMonth(month)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all min-w-[60px]",
                                    activeMonth === month ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                {month}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* List */}
            <main className="max-w-5xl mx-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold font-heading flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-primary" /> Upcoming Events
                    </h2>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="w-4 h-4" /> Filter
                    </Button>
                </div>

                <div className="space-y-4">
                    {filteredFestivals.map((festival) => (
                        <FestivalCard key={festival.id} festival={festival} />
                    ))}

                    {filteredFestivals.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground">
                            <p>No festivals found for {activeMonth}.</p>
                            <Button variant="link" onClick={() => setActiveMonth("All")}>View All</Button>
                        </div>
                    )}
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
