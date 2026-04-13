"use client";

import { useState, useEffect } from "react";
import { Search, Sparkles, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const CATEGORIES = [
    { id: "eat_sip", icon: "🍵", label: "Eat & Sip", desc: "Local dhabas, cafes, street food" },
    { id: "nature", icon: "🌊", label: "Nature Escapes", desc: "Waterfalls, beaches, quiet lakes" },
    { id: "history", icon: "🏛️", label: "History & Soul", desc: "Forts, temples, heritage" },
    { id: "art", icon: "🎨", label: "Art & Vibe", desc: "Murals, galleries, pop-ups" },
    { id: "views", icon: "🌅", label: "Views & Spots", desc: "Sunsets, rooftops, viewpoints" },
    { id: "local", icon: "🛖", label: "Local Life", desc: "Bazaars, villages, tribes" },
    { id: "quiet", icon: "🧘", label: "Quiet Corners", desc: "Libraries, gardens, solitude" },
    { id: "experiences", icon: "🎉", label: "Experiences", desc: "Festivals, workshops, folk music" },
    { id: "hidden_shops", icon: "🛍️", label: "Hidden Shops", desc: "Antique stores, niche bookshops" },
    { id: "off_trail", icon: "🏕️", label: "Off-Trail Adventures", desc: "Unmarked treks, wild camping" },
];

const SMART_TAGS = [
    { id: "free", icon: "🆓", label: "Free Entry", desc: "No cost to visit" },
    { id: "family", icon: "👨‍👩‍👧", label: "Family Friendly", desc: "Safe for all ages" },
    { id: "night", icon: "🌙", label: "Night Visit", desc: "Great after dark" },
    { id: "road_trip", icon: "🚗", label: "Road Trip Stop", desc: "Easy highway access" },
    { id: "off_grid", icon: "📵", label: "Off-Grid", desc: "No network, full detox" },
    { id: "budget", icon: "💰", label: "Budget", desc: "Under ₹100 experience" },
    { id: "ultra_hidden", icon: "🤫", label: "Ultra Hidden", desc: "Less than 100 people know it" },
];

export default function ExplorePage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [destinations, setDestinations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const { getDestinations } = require('@/lib/firestore');
        getDestinations()
            .then((data: any[]) => {
                setDestinations(data);
                setLoading(false);
            })
            .catch((err: any) => {
                console.error("Failed to fetch destinations from Firestore:", err);
                setLoading(false);
            });
    }, []);

    const toggleTag = (tagId: string) => {
        setSelectedTags(prev =>
            prev.includes(tagId)
                ? prev.filter(t => t !== tagId)
                : [...prev, tagId]
        );
    };

    const filteredDestinations = destinations.filter(dest => {
        const query = searchQuery.toLowerCase();
        const destTags = dest.tags ? dest.tags.toLowerCase() : "";
        const destCategory = dest.category ? dest.category.toLowerCase() : "";
        const destName = dest.name ? dest.name.toLowerCase() : "";
        const destSubcats = dest.subCategories ? dest.subCategories.join(" ").toLowerCase() : "";

        const matchesSearch = destName.includes(query) ||
            destTags.includes(query) ||
            destSubcats.includes(query);

        // Category filter
        const matchesCategory = selectedCategory
            ? (
                destCategory.includes(selectedCategory.toLowerCase()) ||
                destTags.includes(selectedCategory.toLowerCase()) ||
                destName.includes(selectedCategory.toLowerCase()) ||
                // Try matching by the category's human readable label too
                destTags.includes(CATEGORIES.find(c => c.id === selectedCategory)?.label.toLowerCase() || "")
            )
            : true;

        // Tags filter - requires ALL selected tags to be present (AND logic)
        const matchesTags = selectedTags.length > 0
            ? selectedTags.every(tagId => {
                const tagLabel = SMART_TAGS.find(t => t.id === tagId)?.label.toLowerCase() || "";
                return destTags.includes(tagLabel) || destTags.includes(tagId);
            })
            : true;

        return matchesSearch && matchesCategory && matchesTags;
    });

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-foreground font-sans pb-24">
            {/* Status Bar Placeholder */}
            <div className="h-6 w-full" />

            <div className="container max-w-7xl mx-auto px-4 mt-2">

                {/* Mobile Header: Title & Filter Button */}
                <div className="flex items-center justify-between mb-4 md:hidden">
                    <h1 className="text-2xl font-heading font-extrabold tracking-tight">Musafir</h1>
                    <button
                        onClick={() => setIsMobileFiltersOpen(true)}
                        className="p-2 bg-white rounded-full border border-gray-200 shadow-sm flex items-center gap-2 text-sm font-medium"
                    >
                        <SlidersHorizontal className="w-4 h-4" /> Filters
                        {(selectedCategory || selectedTags.length > 0) && (
                            <span className="bg-primary text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                                {(selectedCategory ? 1 : 0) + selectedTags.length}
                            </span>
                        )}
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-8">

                    {/* Left Sidebar (Desktop) */}
                    <aside className="hidden md:block w-72 flex-shrink-0 space-y-8">
                        <div className="sticky top-8">
                            <h1 className="text-4xl font-heading font-black tracking-tight mb-8 text-gray-900">Musafir</h1>

                            {/* Categories */}
                            <div className="mb-8">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Core Categories</h3>
                                <div className="space-y-1.5">
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className={cn(
                                            "w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-3",
                                            selectedCategory === null
                                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                                : "text-gray-600 hover:bg-gray-100/80"
                                        )}
                                    >
                                        <span className="text-lg">🌍</span> All Destinations
                                    </button>

                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={cn(
                                                "w-full text-left px-4 py-2.5 rounded-xl transition-all group",
                                                selectedCategory === cat.id
                                                    ? "bg-primary text-white shadow-md shadow-primary/20"
                                                    : "hover:bg-gray-100/80"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">{cat.icon}</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className={cn(
                                                        "text-sm font-semibold truncate",
                                                        selectedCategory === cat.id ? "text-white" : "text-gray-900"
                                                    )}>
                                                        {cat.label}
                                                    </div>
                                                    <div className={cn(
                                                        "text-xs truncate",
                                                        selectedCategory === cat.id ? "text-white/80" : "text-gray-500"
                                                    )}>
                                                        {cat.desc}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Smart Tags */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-1.5">
                                    Smart Tags <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {SMART_TAGS.map(tag => {
                                        const isSelected = selectedTags.includes(tag.id);
                                        return (
                                            <button
                                                key={tag.id}
                                                onClick={() => toggleTag(tag.id)}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border",
                                                    isSelected
                                                        ? "bg-amber-100 border-amber-300 text-amber-800 shadow-sm"
                                                        : "bg-white border-gray-200 text-gray-600 hover:border-amber-200 hover:bg-amber-50"
                                                )}
                                                title={tag.desc}
                                            >
                                                <span>{tag.icon}</span> {tag.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">
                        {/* Search Section */}
                        <div className="relative mb-6">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                                <Search className="text-gray-400 w-5 h-5" />
                            </span>
                            <input
                                className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl pl-12 pr-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-base"
                                placeholder="Search destinations, activities..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* AI Itinerary Button */}
                        <button
                            onClick={() => setIsAIModalOpen(true)}
                            className="w-full bg-gradient-to-br from-primary via-emerald-600 to-teal-700 text-white rounded-2xl py-4 flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all transform hover:translate-y-[-2px] mb-8"
                        >
                            <Sparkles className="w-6 h-6 animate-pulse" />
                            <span className="font-semibold text-lg tracking-wide">Plan Itinerary with AI</span>
                        </button>

                        {/* Results Section */}
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-gray-900 text-xl font-heading font-bold">
                                {selectedCategory
                                    ? CATEGORIES.find(c => c.id === selectedCategory)?.label
                                    : "Discover Next"}
                            </h2>
                            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {filteredDestinations.length} places
                            </span>
                        </div>

                        {/* Destinations Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                            {loading ? (
                                Array(6).fill(0).map((_, i) => (
                                    <div key={i} className="h-64 bg-gray-200 rounded-3xl animate-pulse"></div>
                                ))
                            ) : filteredDestinations.length > 0 ? (
                                filteredDestinations.map((dest) => (
                                    <article
                                        key={dest.id}
                                        className="relative h-64 rounded-3xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-300"
                                        onClick={() => router.push(`/explore/details?id=${dest.id}`)}
                                    >
                                        <img
                                            alt={dest.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            src={dest.image}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Tags overlay badge if it maps to a smart tag */}
                                        <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap max-w-[80%]">
                                            {SMART_TAGS.filter(tag => dest.tags?.toLowerCase().includes(tag.label.toLowerCase())).slice(0, 2).map(tag => (
                                                <span key={tag.id} className="bg-black/50 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-1">
                                                    {tag.icon} {tag.label}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="absolute bottom-0 left-0 p-5 text-white w-full transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                                            <h3 className="text-2xl font-bold font-heading mb-1 drop-shadow-md">{dest.name}</h3>
                                            <p className="text-sm text-gray-300 line-clamp-2 drop-shadow-sm font-medium">{dest.tags}</p>
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-gray-300">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                        <Search className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">No places found</h3>
                                    <p className="text-gray-500 max-w-sm mb-4">We couldn't find any destinations matching your current filters.</p>
                                    <button
                                        onClick={() => { setSearchQuery(""); setSelectedCategory(null); setSelectedTags([]); }}
                                        className="px-5 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Filters Drawer */}
            {isMobileFiltersOpen && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in duration-200">
                    <div className="w-[85%] max-w-sm bg-white h-full overflow-y-auto animate-in slide-in-from-right duration-300 shadow-2xl flex flex-col">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur z-10">
                            <h2 className="text-lg font-bold font-heading">Filters</h2>
                            <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5 flex-1 space-y-8">
                            {/* Categories */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Core Categories</h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => { setSelectedCategory(null); setIsMobileFiltersOpen(false); }}
                                        className={cn(
                                            "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3",
                                            selectedCategory === null
                                                ? "bg-primary/10 text-primary border border-primary/20"
                                                : "bg-gray-50 text-gray-700 border border-transparent"
                                        )}
                                    >
                                        <span className="text-lg">🌍</span> All Destinations
                                    </button>

                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => { setSelectedCategory(cat.id); setIsMobileFiltersOpen(false); }}
                                            className={cn(
                                                "w-full text-left px-4 py-3 rounded-xl transition-all border",
                                                selectedCategory === cat.id
                                                    ? "bg-primary/10 border-primary/20 text-primary"
                                                    : "bg-white border-gray-100 text-gray-700 hover:border-gray-200"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{cat.icon}</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-semibold truncate">{cat.label}</div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Smart Tags */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                                        Smart Tags <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                    </h3>
                                    {selectedTags.length > 0 && (
                                        <button onClick={() => setSelectedTags([])} className="text-xs text-primary font-medium">Clear</button>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    {SMART_TAGS.map(tag => {
                                        const isSelected = selectedTags.includes(tag.id);
                                        return (
                                            <button
                                                key={tag.id}
                                                onClick={() => toggleTag(tag.id)}
                                                className={cn(
                                                    "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all border",
                                                    isSelected
                                                        ? "bg-amber-50 border-amber-200 text-amber-900"
                                                        : "bg-white border-gray-100 text-gray-600"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg">{tag.icon}</span> {tag.label}
                                                </div>
                                                <div className={cn(
                                                    "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                                    isSelected ? "bg-amber-500 border-amber-500 text-white" : "border-gray-300"
                                                )}>
                                                    {isSelected && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="p-5 border-t border-gray-100 sticky bottom-0 bg-white">
                            <button
                                onClick={() => setIsMobileFiltersOpen(false)}
                                className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold"
                            >
                                Show {filteredDestinations.length} results
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Modal */}
            {isAIModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading">AI Travel Planner</h3>
                        <p className="text-gray-500 mb-6 text-sm">Describe your dream trip and let our AI build an itinerary for you.</p>
                        <textarea
                            className="w-full h-32 bg-gray-50 rounded-xl p-4 text-gray-900 placeholder:text-gray-400 border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary mb-4 resize-none"
                            placeholder="e.g. A 5-day backpacking trip to Spiti Valley in October..."
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsAIModalOpen(false)}
                                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        const textarea = document.querySelector('textarea');
                                        const prompt = textarea ? textarea.value : "";
                                        if (!prompt) return;

                                        const res = await fetch('http://localhost:3001/ai/generate', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': `Bearer ${token}`
                                            },
                                            body: JSON.stringify({ prompt })
                                        });

                                        if (res.ok) {
                                            const data = await res.json();
                                            alert(data.itinerary);
                                            setIsAIModalOpen(false);
                                        }
                                    } catch (err) {
                                        console.error("AI generation failed:", err);
                                        alert("Failed to generate itinerary");
                                    }
                                }}
                                className="flex-1 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
                            >
                                Generate Itinerary
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
