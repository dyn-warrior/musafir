"use client";

import { BottomNav } from "@/components/layout/BottomNav";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function WikiPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [wikis, setWikis] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3001/wikis')
            .then(res => res.json())
            .then(data => {
                setWikis(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch wikis:", err);
                setLoading(false);
            });
    }, []);

    const filteredWikis = wikis.filter(place =>
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.region.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-muted/30 pb-20 md:pl-64">
            {/* Hero Search */}
            <div className="bg-background border-b border-border/50 py-12 px-6">
                <div className="max-w-3xl mx-auto text-center space-y-6">
                    <h1 className="text-3xl md:text-4xl font-heading font-bold">Nomadi Wiki</h1>
                    <p className="text-muted-foreground text-lg">The community-driven knowledge base for travelers.</p>

                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Search for a place (e.g. Kasol, Gokarna)..."
                            className="pl-12 h-12 text-lg bg-muted/50 border-none shadow-sm focus-visible:ring-1 focus-visible:ring-primary"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Trending */}
            <main className="max-w-5xl mx-auto p-6">
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-bold font-heading">
                        {searchQuery ? "Search Results" : "Trending Places"}
                    </h2>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-muted-foreground">Loading wikis...</div>
                ) : filteredWikis.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredWikis.map((place) => (
                            <Link
                                key={place.id}
                                href={`/wiki/details?id=${place.id}`}
                                className="group bg-card p-4 rounded-xl border border-border/50 hover:border-primary/50 hover:shadow-md transition-all"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{place.name}</h3>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">{place.region}</p>
                                <div className="text-xs text-muted-foreground bg-muted inline-block px-2 py-1 rounded-full">
                                    {place.views} readers
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No places found matching "{searchQuery}".</p>
                    </div>
                )}
            </main>

            <BottomNav />
        </div>
    );
}
