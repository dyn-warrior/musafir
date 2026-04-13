"use client";

import { PartnerCard } from "@/components/go-out/PartnerCard";
import { PostNeedModal } from "@/components/go-out/PostNeedModal";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Package, MapPin, Clock, Check, X, ChevronDown, ChevronUp, Calendar, Users2, Search } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { getTripPackages, type TripPackage, type ItineraryDay } from "@/lib/firestore";

const ACTIVITY_TYPES = ["Trekking", "Road Trip", "Backpacking", "Event"];

export default function GoOutPage() {
    const [keyword, setKeyword] = useState("");
    const [activityFilter, setActivityFilter] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [packages, setPackages] = useState<TripPackage[]>([]);
    const [packagesLoading, setPackagesLoading] = useState(true);
    const [expandedPackage, setExpandedPackage] = useState<string | null>(null);

    useEffect(() => {
        import('@/lib/firestore').then(({ getGoOutRequests }) =>
            getGoOutRequests()
                .then((data: any[]) => { setRequests(data); setLoading(false); })
                .catch(() => setLoading(false))
        );
    }, []);

    useEffect(() => {
        getTripPackages()
            .then(pkgs => { setPackages(pkgs); setPackagesLoading(false); })
            .catch(() => setPackagesLoading(false));
    }, []);

    const filteredRequests = useMemo(() => {
        return requests.filter(req => {
            const kw = keyword.toLowerCase();
            const matchesKeyword = !kw ||
                req.trip?.destination?.toLowerCase().includes(kw) ||
                req.trip?.title?.toLowerCase().includes(kw) ||
                req.description?.toLowerCase().includes(kw);
            const matchesActivity = !activityFilter || req.trip?.type === activityFilter;
            // Exact start-date match using the ISO value stored when the request was posted
            const matchesDate = !dateFrom ||
                (req.trip?.dateFromISO === dateFrom);
            return matchesKeyword && matchesActivity && matchesDate;
        });
    }, [requests, keyword, activityFilter, dateFrom, dateTo]);

    return (
        <div className="min-h-screen bg-muted/30 pb-20 md:pl-64">
            {/* Header */}
            <div className="bg-background border-b border-border/50 p-6 sticky top-0 z-30">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
                            <Users className="w-6 h-6 text-primary" /> Find Travel Partners
                        </h1>
                        <p className="text-muted-foreground text-sm">Connect with travelers heading your way.</p>
                    </div>
                    <Button onClick={() => setIsPostModalOpen(true)} className="bg-secondary hover:bg-secondary/90">
                        <Plus className="w-4 h-4 mr-2" /> Post Your Need
                    </Button>
                </div>

                {/* Search + Filters row */}
                <div className="max-w-6xl mx-auto mt-5 flex flex-col sm:flex-row gap-3">

                    {/* Keyword search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search destination or activity…"
                            value={keyword}
                            onChange={e => setKeyword(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>

                    {/* Activity type */}
                    <select
                        value={activityFilter}
                        onChange={e => setActivityFilter(e.target.value)}
                        className="px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-w-[150px]"
                    >
                        <option value="">All Activities</option>
                        {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>

                    {/* Date range */}
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={e => setDateFrom(e.target.value)}
                                className="pl-8 pr-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                title="From date"
                            />
                        </div>
                        <span className="text-muted-foreground text-sm">—</span>
                        <input
                            type="date"
                            value={dateTo}
                            min={dateFrom}
                            onChange={e => setDateTo(e.target.value)}
                            className="px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            title="To date"
                        />
                    </div>

                    {/* Clear filters */}
                    {(keyword || activityFilter || dateFrom || dateTo) && (
                        <button
                            onClick={() => { setKeyword(""); setActivityFilter(""); setDateFrom(""); setDateTo(""); }}
                            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors whitespace-nowrap"
                        >
                            <X className="w-3.5 h-3.5" /> Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Two-column layout */}
            <main className="max-w-6xl mx-auto p-6 flex flex-col lg:flex-row gap-8">

                {/* LEFT: Travel Partner Requests */}
                <div className="flex-1 min-w-0">
                    {loading ? (
                        <div className="text-center py-12 text-muted-foreground">Loading requests...</div>
                    ) : filteredRequests.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground bg-card border border-border rounded-2xl">
                            No requests for this filter yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredRequests.map((req) => (
                                <PartnerCard key={req.id} request={req} />
                            ))}
                        </div>
                    )}
                </div>

                {/* RIGHT: Upcoming Trip Packages */}
                <div className="w-full lg:w-[360px] flex-shrink-0 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Package className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-heading font-bold">Upcoming Packages</h2>
                        {packages.length > 0 && (
                            <Badge variant="secondary" className="text-xs">{packages.length}</Badge>
                        )}
                    </div>

                    {packagesLoading ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">Loading packages…</div>
                    ) : packages.length === 0 ? (
                        <div className="p-6 rounded-2xl border border-dashed border-border text-center text-sm text-muted-foreground">
                            No packages yet. Check back soon!
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {packages.map(pkg => (
                                <TripPackageCard
                                    key={pkg.id}
                                    pkg={pkg}
                                    expanded={expandedPackage === pkg.id}
                                    onToggle={() => setExpandedPackage(expandedPackage === pkg.id ? null : pkg.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <PostNeedModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} />
            <BottomNav />
        </div>
    );
}

/* ─── Trip Package Card ─── */
function TripPackageCard({ pkg, expanded, onToggle }: { pkg: TripPackage; expanded: boolean; onToggle: () => void }) {
    const [imgIdx, setImgIdx] = useState(0);
    const photos = pkg.photos || [];

    const statusColors: Record<string, string> = {
        upcoming: "bg-green-100 text-green-700 border-green-200",
        full: "bg-red-100 text-red-700 border-red-200",
        completed: "bg-gray-100 text-gray-600 border-gray-200",
    };

    return (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            {/* Photo */}
            {photos.length > 0 && (
                <div className="relative h-44 overflow-hidden">
                    <img src={photos[imgIdx]} alt={pkg.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {photos.length > 1 && (
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                            {photos.map((_, i) => (
                                <button key={i} onClick={() => setImgIdx(i)}
                                    className={cn("w-1.5 h-1.5 rounded-full transition-all", i === imgIdx ? "bg-white scale-125" : "bg-white/50")} />
                            ))}
                        </div>
                    )}
                    <div className="absolute top-2 right-2">
                        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border capitalize", statusColors[pkg.status] || statusColors.upcoming)}>
                            {pkg.status}
                        </span>
                    </div>
                </div>
            )}

            <div className="p-4 space-y-3">
                {/* Title + price */}
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <h3 className="font-bold font-heading text-base leading-tight">{pkg.title}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" /> {pkg.destination}
                        </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold text-primary">₹{pkg.price?.toLocaleString()}</div>
                        <div className="text-[10px] text-muted-foreground">per person</div>
                    </div>
                </div>

                {/* Quick stats */}
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {pkg.duration && (
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {pkg.duration}</span>
                    )}
                    {pkg.departureDate && (
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {pkg.departureDate}</span>
                    )}
                    {pkg.maxGroupSize > 0 && (
                        <span className="flex items-center gap-1"><Users2 className="w-3.5 h-3.5" /> Max {pkg.maxGroupSize}</span>
                    )}
                </div>

                {/* Highlights preview */}
                {pkg.highlights?.length > 0 && (
                    <ul className="space-y-1">
                        {pkg.highlights.slice(0, 3).map((h, i) => (
                            <li key={i} className="text-xs flex items-start gap-1.5">
                                <Check className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" /> {h}
                            </li>
                        ))}
                        {pkg.highlights.length > 3 && !expanded && (
                            <li className="text-xs text-muted-foreground">+{pkg.highlights.length - 3} more…</li>
                        )}
                    </ul>
                )}

                {/* Expanded details */}
                {expanded && (
                    <div className="space-y-4 pt-2 border-t border-border/50">
                        {/* About */}
                        {pkg.description && (
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">About</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">{pkg.description}</p>
                            </div>
                        )}

                        {/* Included / Excluded */}
                        {(pkg.included?.length > 0 || pkg.excluded?.length > 0) && (
                            <div className="grid grid-cols-2 gap-3">
                                {pkg.included?.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wide text-green-600 mb-1.5">Included</h4>
                                        <ul className="space-y-1">
                                            {pkg.included.map((item, i) => (
                                                <li key={i} className="text-xs flex items-start gap-1">
                                                    <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" /> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {pkg.excluded?.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wide text-red-500 mb-1.5">Excluded</h4>
                                        <ul className="space-y-1">
                                            {pkg.excluded.map((item, i) => (
                                                <li key={i} className="text-xs flex items-start gap-1 text-muted-foreground">
                                                    <X className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" /> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Itinerary */}
                        {pkg.itinerary?.length > 0 && (
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">Itinerary</h4>
                                <div className="space-y-2">
                                    {pkg.itinerary.map((day) => (
                                        <div key={day.day} className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                                                D{day.day}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold leading-tight">{day.title}</div>
                                                {day.description && <div className="text-xs text-muted-foreground mt-0.5">{day.description}</div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Cancellation */}
                        {pkg.cancellationPolicy && (
                            <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                                <span className="font-semibold text-foreground">Cancellation: </span>{pkg.cancellationPolicy}
                            </div>
                        )}
                    </div>
                )}

                {/* Expand toggle */}
                <button onClick={onToggle} className="w-full flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors pt-1">
                    {expanded ? <><ChevronUp className="w-4 h-4" /> Show less</> : <><ChevronDown className="w-4 h-4" /> View details</>}
                </button>
            </div>
        </div>
    );
}
