"use client";

import { StayCard } from "@/components/stays/StayCard";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Hostel", "Homestay", "Resort", "Under ₹1500", "Work Friendly"];

export default function StaysPage() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [stays, setStays] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        import('@/lib/firestore').then(({ getStays }) =>
            getStays()
                .then((data: any[]) => { setStays(data); setLoading(false); })
                .catch(() => setLoading(false))
        );
    }, []);

    const filteredStays = stays.filter(stay => {
        const matchesSearch = stay.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            stay.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === "All" || stay.type === activeFilter ||
            (activeFilter === "Under ₹1500" && parseInt(stay.price.replace("₹", "")) < 1500) ||
            (activeFilter === "Work Friendly" && stay.tags?.includes("Workation"));
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-muted/30 pb-20 md:pl-64">
            {/* Header */}
            <div className="bg-background border-b border-border/50 p-6 sticky top-0 z-30">
                <div className="max-w-5xl mx-auto space-y-4">
                    <h1 className="text-2xl font-heading font-bold">Find Your Stay</h1>

                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Search destination or property..."
                                className="pl-10 h-11 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="h-11 px-4 gap-2">
                            <SlidersHorizontal className="w-4 h-4" /> Filters
                        </Button>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                        {FILTERS.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border",
                                    activeFilter === filter
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background border-border hover:border-primary/50 text-muted-foreground"
                                )}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <main className="max-w-5xl mx-auto p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStays.map((stay) => (
                        <StayCard key={stay.id} stay={stay} />
                    ))}
                </div>

                {filteredStays.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        <p>No stays found matching your criteria.</p>
                        <Button variant="link" onClick={() => { setActiveFilter("All"); setSearchQuery(""); }}>Clear Filters</Button>
                    </div>
                )}
            </main>

            <BottomNav />
        </div>
    );
}
