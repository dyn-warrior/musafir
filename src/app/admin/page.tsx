"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    addStay, deleteStay, getStays, getDestinations, addDestination, deleteDestination,
    addTripPackage, deleteTripPackage, getTripPackages,
    type Stay, type Destination, type TripPackage, type ItineraryDay,
} from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { StayPhotoUploader } from "@/components/admin/StayPhotoUploader";
import { TripPhotoUploader } from "@/components/admin/TripPhotoUploader";
import {
    Plus, Trash2, LogOut, Loader2, Home, BedDouble,
    ChevronDown, ChevronUp, MapPin, Package, Bed,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const ADMIN_EMAIL = "ratsthh1997@gmail.com";
const STAY_TYPES = ["Hostel", "Homestay", "Guesthouse", "Resort", "Campsite", "Other"];
const AMENITY_OPTIONS = [
    "WiFi", "Hot Water", "Mountain View", "AC", "Heater", "Parking",
    "Kitchen", "Locker", "Laundry", "Bonfire", "Balcony", "Breakfast Included",
    "Coffee/Tea", "Common Room", "24hr Reception"
];
const TRIP_STATUS = ["upcoming", "full", "completed"] as const;

export const CATEGORIES = [
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

export const SMART_TAGS = [
    { id: "free", icon: "🆓", label: "Free Entry", desc: "No cost to visit" },
    { id: "family", icon: "👨‍👩‍👧", label: "Family Friendly", desc: "Safe for all ages" },
    { id: "night", icon: "🌙", label: "Night Visit", desc: "Great after dark" },
    { id: "road_trip", icon: "🚗", label: "Road Trip Stop", desc: "Easy highway access" },
    { id: "off_grid", icon: "📵", label: "Off-Grid", desc: "No network, full detox" },
    { id: "budget", icon: "💰", label: "Budget", desc: "Under ₹100 experience" },
    { id: "ultra_hidden", icon: "🤫", label: "Ultra Hidden", desc: "Less than 100 people know it" },
];

export const SUBCATEGORIES_MAP: Record<string, string[]> = {
    "eat_sip": ["Local dhabas", "Hole-in-the-wall cafés", "Chai tapris", "Street food stalls", "Bakeries", "Juice corners"],
    "nature": ["Hidden waterfalls", "Secret beaches", "Quiet lakes", "Meadows", "Caves", "Scenic valleys"],
    "history": ["Forgotten forts", "Old temples/mosques/churches", "Ancient stepwells", "Heritage havelis", "Colonial-era buildings"],
    "art": ["Street murals", "Indie galleries", "Pottery villages", "Quirky installations", "Craft markets"],
    "views": ["Sunrise/sunset points", "Rooftop spots", "Hidden viewpoints", "Photography corners"],
    "local": ["Weekly bazaars", "Fishing villages", "Farming communities", "Tribe markets"],
    "quiet": ["Libraries", "Serene gardens", "Meditation spots", "Quiet parks"],
    "experiences": ["Local festivals", "Workshops", "Night markets", "Live folk music"],
    "hidden_shops": ["Antique stores", "Niche bookshops", "Local artisan shops", "Spice markets"],
    "off_trail": ["Unmarked treks", "Wild camping spots", "Secret drives", "Abandoned places"],
};

type UploadedPhoto = { url: string; storagePath: string; name: string };

/* ─────────────── STAY FORM ─────────────── */
type StayForm = {
    name: string; type: string; destinationId: string; location: string;
    description: string; price: string; beds: string;
    hostName: string; hostBio: string; hostAvatar: string;
    phone: string; whatsapp: string; email: string;
    photos: UploadedPhoto[]; amenities: string[]; houseRules: string; tags: string;
};
const EMPTY_STAY: StayForm = {
    name: "", type: "Hostel", destinationId: "", location: "", description: "",
    price: "", beds: "", hostName: "", hostBio: "", hostAvatar: "",
    phone: "", whatsapp: "", email: "", photos: [], amenities: [], houseRules: "", tags: "",
};

/* ─────────────── TRIP FORM ─────────────── */
type TripForm = {
    title: string; destination: string; description: string;
    duration: string; price: string; cancellationPolicy: string;
    departureDate: string; maxGroupSize: string;
    highlights: string; included: string; excluded: string;
    itinerary: { title: string; description: string }[];
    photos: UploadedPhoto[]; tags: string;
    status: "upcoming" | "full" | "completed";
};
const EMPTY_TRIP: TripForm = {
    title: "", destination: "", description: "", duration: "", price: "",
    cancellationPolicy: "", departureDate: "", maxGroupSize: "",
    highlights: "", included: "", excluded: "",
    itinerary: [{ title: "", description: "" }],
    photos: [], tags: "", status: "upcoming",
};

/* ─────────────── TOURIST DESTINATION FORM ─────────────── */
type TouristDestinationForm = {
    name: string; region: string; photos: UploadedPhoto[]; mapUrl: string;
    weather: string; vibeScore: string; cost: string; description: string;
    bestTime: string; budget: string; highlights: string;
};
const EMPTY_TOURIST: TouristDestinationForm = {
    name: "", region: "", photos: [], mapUrl: "",
    weather: "", vibeScore: "5", cost: "", description: "",
    bestTime: "", budget: "", highlights: "",
};

/* ─────────────── OFFBEAT DESTINATION FORM ─────────────── */
type OffbeatDestinationForm = {
    name: string; region: string; photos: UploadedPhoto[]; tags: string[]; category: string; subCategories: string[]; mapUrl: string;
    weather: string; vibeScore: string; cost: string; description: string;
    bestTime: string; budget: string; highlights: string;
};
const EMPTY_OFFBEAT: OffbeatDestinationForm = {
    name: "", region: "", photos: [], tags: [], category: "eat_sip", subCategories: [], mapUrl: "",
    weather: "", vibeScore: "5", cost: "", description: "",
    bestTime: "", budget: "", highlights: "",
};

/* ═══════════════ ADMIN PAGE ═══════════════ */
export default function AdminPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<"stays" | "trips" | "destinations">("stays");
    const [stays, setStays] = useState<Stay[]>([]);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [trips, setTrips] = useState<TripPackage[]>([]);

    const [stayForm, setStayForm] = useState<StayForm>(EMPTY_STAY);
    const [tripForm, setTripForm] = useState<TripForm>(EMPTY_TRIP);
    const [touristForm, setTouristForm] = useState<TouristDestinationForm>(EMPTY_TOURIST);
    const [offbeatForm, setOffbeatForm] = useState<OffbeatDestinationForm>(EMPTY_OFFBEAT);

    const [showStayForm, setShowStayForm] = useState(false);
    const [showTripForm, setShowTripForm] = useState(false);
    const [showTouristForm, setShowTouristForm] = useState(false);
    const [showOffbeatForm, setShowOffbeatForm] = useState(false);

    const [savingStay, setSavingStay] = useState(false);
    const [savingTrip, setSavingTrip] = useState(false);
    const [savingTourist, setSavingTourist] = useState(false);
    const [savingOffbeat, setSavingOffbeat] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    // Auth guard
    useEffect(() => {
        if (authLoading) return;
        if (!user) { router.push("/login"); return; }
        if (user.email !== ADMIN_EMAIL) { router.push("/"); return; }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (authLoading || user?.email !== ADMIN_EMAIL) return;
        Promise.all([getStays(), getDestinations(), getTripPackages()])
            .then(([s, d, t]) => { setStays(s); setDestinations(d); setTrips(t); setLoadingData(false); });
    }, [user, authLoading]);

    const stayToggle = (f: keyof StayForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setStayForm(p => ({ ...p, [f]: e.target.value }));
    const tripToggle = (f: keyof TripForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setTripForm(p => ({ ...p, [f]: e.target.value }));
    const touristToggle = (f: keyof TouristDestinationForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setTouristForm(p => ({ ...p, [f]: e.target.value }));
    const offbeatToggle = (f: keyof OffbeatDestinationForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setOffbeatForm(p => ({ ...p, [f]: e.target.value }));

    const toggleAmenity = (a: string) =>
        setStayForm(f => ({ ...f, amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a] }));
    const toggleDestTag = (a: string) =>
        setOffbeatForm(f => ({ ...f, tags: f.tags.includes(a) ? f.tags.filter(x => x !== a) : [...f.tags, a] }));
    const toggleSubCategory = (a: string) =>
        setOffbeatForm(f => ({ ...f, subCategories: f.subCategories.includes(a) ? f.subCategories.filter(x => x !== a) : [...f.subCategories, a] }));

    /* --- itinerary helpers --- */
    const addDay = () => setTripForm(f => ({ ...f, itinerary: [...f.itinerary, { title: "", description: "" }] }));
    const removeDay = (i: number) => setTripForm(f => ({ ...f, itinerary: f.itinerary.filter((_, idx) => idx !== i) }));
    const updateDay = (i: number, field: "title" | "description", val: string) =>
        setTripForm(f => ({ ...f, itinerary: f.itinerary.map((d, idx) => idx === i ? { ...d, [field]: val } : d) }));

    /* ─── Submit stay ─── */
    const handleStaySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stayForm.name || !stayForm.destinationId || !stayForm.hostName) { toast.error("Name, destination and host required."); return; }
        setSavingStay(true);
        try {
            await addStay({
                name: stayForm.name, type: stayForm.type, destinationId: stayForm.destinationId,
                location: stayForm.location, description: stayForm.description,
                price: Number(stayForm.price) || 0, beds: Number(stayForm.beds) || 0, rating: 0,
                hostName: stayForm.hostName, hostBio: stayForm.hostBio, hostAvatar: stayForm.hostAvatar,
                phone: stayForm.phone, whatsapp: stayForm.whatsapp, email: stayForm.email,
                photos: stayForm.photos.map(p => p.url),
                amenities: stayForm.amenities,
                houseRules: stayForm.houseRules.split("\n").map(s => s.trim()).filter(Boolean),
                tags: stayForm.tags.split(",").map(s => s.trim()).filter(Boolean),
            });
            toast.success(`"${stayForm.name}" added!`);
            setStayForm(EMPTY_STAY); setShowStayForm(false);
            setStays(await getStays());
        } catch (err: any) { toast.error(err.message); } finally { setSavingStay(false); }
    };

    /* ─── Submit trip ─── */
    const handleTripSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tripForm.title || !tripForm.destination) { toast.error("Title and destination are required."); return; }
        setSavingTrip(true);
        try {
            await addTripPackage({
                title: tripForm.title, destination: tripForm.destination,
                description: tripForm.description, duration: tripForm.duration,
                price: Number(tripForm.price) || 0,
                cancellationPolicy: tripForm.cancellationPolicy,
                departureDate: tripForm.departureDate,
                maxGroupSize: Number(tripForm.maxGroupSize) || 0,
                highlights: tripForm.highlights.split("\n").map(s => s.trim()).filter(Boolean),
                included: tripForm.included.split("\n").map(s => s.trim()).filter(Boolean),
                excluded: tripForm.excluded.split("\n").map(s => s.trim()).filter(Boolean),
                itinerary: tripForm.itinerary
                    .filter(d => d.title)
                    .map((d, i) => ({ day: i + 1, title: d.title, description: d.description })),
                photos: tripForm.photos.map(p => p.url),
                tags: tripForm.tags.split(",").map(s => s.trim()).filter(Boolean),
                status: tripForm.status,
            });
            toast.success(`"${tripForm.title}" added!`);
            setTripForm(EMPTY_TRIP); setShowTripForm(false);
            setTrips(await getTripPackages());
        } catch (err: any) { toast.error(err.message); } finally { setSavingTrip(false); }
    };

    /* ─── Submit tourist destination ─── */
    const handleTouristSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!touristForm.name || !touristForm.region) { toast.error("Name and region are required."); return; }
        setSavingTourist(true);
        try {
            await addDestination({
                type: "tourist",
                name: touristForm.name,
                region: touristForm.region,
                image: touristForm.photos[0]?.url || "",
                photos: touristForm.photos.map(p => p.url),
                mapUrl: touristForm.mapUrl,
                tags: "",
                category: "",
                weather: touristForm.weather,
                vibeScore: Number(touristForm.vibeScore) || 5,
                cost: touristForm.cost,
                description: touristForm.description,
                stats: { weather: touristForm.weather, bestTime: touristForm.bestTime, budget: touristForm.budget },
                highlights: touristForm.highlights.split("\n").map(s => s.trim()).filter(Boolean),
                rating: 0,
                reviewCount: 0,
            });
            toast.success(`"${touristForm.name}" added!`);
            setTouristForm(EMPTY_TOURIST); setShowTouristForm(false);
            setDestinations(await getDestinations());
        } catch (err: any) { toast.error(err.message); } finally { setSavingTourist(false); }
    };

    /* ─── Submit offbeat destination ─── */
    const handleOffbeatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!offbeatForm.name || !offbeatForm.region) { toast.error("Name and region are required."); return; }
        setSavingOffbeat(true);
        try {
            await addDestination({
                type: "offbeat",
                name: offbeatForm.name,
                region: offbeatForm.region,
                image: offbeatForm.photos[0]?.url || "",
                photos: offbeatForm.photos.map(p => p.url),
                mapUrl: offbeatForm.mapUrl,
                category: offbeatForm.category,
                subCategories: offbeatForm.subCategories,
                tags: offbeatForm.tags.join(", "),
                weather: offbeatForm.weather,
                vibeScore: Number(offbeatForm.vibeScore) || 5,
                cost: offbeatForm.cost,
                description: offbeatForm.description,
                stats: { weather: offbeatForm.weather, bestTime: offbeatForm.bestTime, budget: offbeatForm.budget },
                highlights: offbeatForm.highlights.split("\n").map(s => s.trim()).filter(Boolean),
                rating: 0,
                reviewCount: 0,
            });
            toast.success(`"${offbeatForm.name}" added!`);
            setOffbeatForm(EMPTY_OFFBEAT); setShowOffbeatForm(false);
            setDestinations(await getDestinations());
        } catch (err: any) { toast.error(err.message); } finally { setSavingOffbeat(false); }
    };

    const deleteTrip = async (id: string, title: string) => {
        if (!confirm(`Delete "${title}"?`)) return;
        await deleteTripPackage(id);
        setTrips(t => t.filter(x => x.id !== id));
        toast.success("Trip deleted.");
    };
    const deleteStayItem = async (id: string, name: string) => {
        if (!confirm(`Delete "${name}"?`)) return;
        await deleteStay(id);
        setStays(s => s.filter(x => x.id !== id));
        toast.success("Stay deleted.");
    };
    const deleteDestinationItem = async (id: string, name: string) => {
        if (!confirm(`Delete "${name}"?`)) return;
        await deleteDestination(id);
        setDestinations(d => d.filter(x => x.id !== id));
        toast.success("Destination deleted.");
    };

    if (authLoading || !user || user.email !== ADMIN_EMAIL) return (
        <div suppressHydrationWarning className="min-h-screen flex items-center justify-center bg-background">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );
    if (loadingData) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    const destName = (id: string) => destinations.find(d => d.id === id)?.name ?? id;

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <div className="border-b border-border/60 bg-card sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold font-heading text-lg">
                        <Home className="w-5 h-5 text-primary" /> Nomadi Admin
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => signOut(auth).then(() => router.push("/"))}>
                        <LogOut className="w-4 h-4 mr-1" /> Sign out
                    </Button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Stays", value: stays.length, color: "text-blue-600" },
                        { label: "Trips", value: trips.length, color: "text-orange-500" },
                        { label: "Destinations", value: destinations.length, color: "text-green-600" },
                        { label: "Admin", value: "You ✓", color: "text-primary" },
                    ].map(s => (
                        <div key={s.label} className="rounded-2xl p-5 border border-border/50 bg-card">
                            <div className={cn("text-3xl font-bold", s.color)}>{s.value}</div>
                            <div className="text-sm mt-1 text-muted-foreground">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit">
                    {(["stays", "trips", "destinations"] as const).map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize",
                                activeTab === tab ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}>
                            {tab === "stays" ? <><Bed className="w-4 h-4 inline mr-1" />Stays</> : tab === "trips" ? <><Package className="w-4 h-4 inline mr-1" />Trip Packages</> : <><MapPin className="w-4 h-4 inline mr-1" />Destinations</>}
                        </button>
                    ))}
                </div>

                {/* ═══════ STAYS TAB ═══════ */}
                {activeTab === "stays" && (
                    <div className="space-y-6">
                        {/* Add stay collapsible */}
                        <div className="bg-card border border-border rounded-2xl overflow-hidden">
                            <button onClick={() => setShowStayForm(v => !v)}
                                className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors">
                                <span className="font-bold text-lg flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-primary" /> Add New Stay
                                </span>
                                {showStayForm ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                            {showStayForm && (
                                <form onSubmit={handleStaySubmit} className="px-6 pb-8 pt-2 space-y-6 border-t border-border/50">
                                    <Section title="Basic Info">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Field label="Stay Name *"><Input placeholder="e.g. Zostel Manali" value={stayForm.name} onChange={stayToggle("name")} required /></Field>
                                            <Field label="Type">
                                                <select value={stayForm.type} onChange={stayToggle("type")} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                                                    {STAY_TYPES.map(t => <option key={t}>{t}</option>)}
                                                </select>
                                            </Field>
                                            <Field label="Destination *">
                                                <select value={stayForm.destinationId} onChange={stayToggle("destinationId")} required className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                                                    <option value="">Select destination…</option>
                                                    {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                                </select>
                                            </Field>
                                            <Field label="Location"><Input placeholder="e.g. Old Manali, HP" value={stayForm.location} onChange={stayToggle("location")} /></Field>
                                            <Field label="Price/Night (₹)"><Input type="number" placeholder="899" value={stayForm.price} onChange={stayToggle("price")} /></Field>
                                            <Field label="Number of Beds"><Input type="number" placeholder="10" value={stayForm.beds} onChange={stayToggle("beds")} /></Field>
                                        </div>
                                        <Field label="Description"><Textarea rows={3} placeholder="Describe the stay…" value={stayForm.description} onChange={stayToggle("description")} /></Field>
                                    </Section>
                                    <Section title="Host Info">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Field label="Host Name *"><Input placeholder="Rajesh Kumar" value={stayForm.hostName} onChange={stayToggle("hostName")} required /></Field>
                                            <Field label="Host Avatar URL"><Input placeholder="https://…" value={stayForm.hostAvatar} onChange={stayToggle("hostAvatar")} /></Field>
                                        </div>
                                        <Field label="Host Bio"><Textarea rows={2} placeholder="Brief intro…" value={stayForm.hostBio} onChange={stayToggle("hostBio")} /></Field>
                                    </Section>
                                    <Section title="Contact Info">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <Field label="Phone"><Input placeholder="+91 98765 43210" value={stayForm.phone} onChange={stayToggle("phone")} /></Field>
                                            <Field label="WhatsApp"><Input placeholder="+91 98765 43210" value={stayForm.whatsapp} onChange={stayToggle("whatsapp")} /></Field>
                                            <Field label="Email"><Input type="email" placeholder="host@mail.com" value={stayForm.email} onChange={stayToggle("email")} /></Field>
                                        </div>
                                    </Section>
                                    <Section title="Photos (Firebase Storage)">
                                        <StayPhotoUploader photos={stayForm.photos} onChange={photos => setStayForm(f => ({ ...f, photos }))} />
                                    </Section>
                                    <Section title="Amenities">
                                        <div className="flex flex-wrap gap-2">
                                            {AMENITY_OPTIONS.map(a => (
                                                <button type="button" key={a} onClick={() => toggleAmenity(a)}
                                                    className={cn("px-3 py-1.5 rounded-full text-sm border transition-colors",
                                                        stayForm.amenities.includes(a) ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-border hover:border-primary/50")}>
                                                    {a}
                                                </button>
                                            ))}
                                        </div>
                                    </Section>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Section title="House Rules"><Field label="One per line"><Textarea rows={4} placeholder={"Check-in: 12 PM\nNo smoking"} value={stayForm.houseRules} onChange={stayToggle("houseRules")} /></Field></Section>
                                        <Section title="Tags"><Field label="Comma-separated"><Textarea rows={4} placeholder="backpacker, budget, mountain" value={stayForm.tags} onChange={stayToggle("tags")} /></Field></Section>
                                    </div>
                                    <Button type="submit" disabled={savingStay} className="w-full h-12 text-base">
                                        {savingStay ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</> : <><Plus className="w-4 h-4 mr-2" />Add Stay</>}
                                    </Button>
                                </form>
                            )}
                        </div>

                        {/* Stays list */}
                        <h2 className="text-xl font-bold font-heading">All Stays ({stays.length})</h2>
                        {stays.length === 0 ? (
                            <div className="text-center py-16 text-muted-foreground bg-card border border-border rounded-2xl">No stays yet.</div>
                        ) : (
                            <div className="space-y-3">
                                {stays.map(s => (
                                    <div key={s.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                                        {s.photos?.[0] && <img src={s.photos[0]} alt={s.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold truncate">{s.name}</div>
                                            <div className="text-sm text-muted-foreground">{destName(s.destinationId)} · {s.type} · {s.beds} beds · ₹{s.price}/night</div>
                                            <div className="text-xs text-muted-foreground mt-0.5">{s.hostName}</div>
                                        </div>
                                        <div className="flex gap-2 items-center flex-shrink-0">
                                            <Badge variant="secondary" className="text-xs">{s.type}</Badge>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deleteStayItem(s.id, s.name)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ═══════ TRIPS TAB ═══════ */}
                {activeTab === "trips" && (
                    <div className="space-y-6">
                        {/* Add trip collapsible */}
                        <div className="bg-card border border-border rounded-2xl overflow-hidden">
                            <button onClick={() => setShowTripForm(v => !v)}
                                className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors">
                                <span className="font-bold text-lg flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-primary" /> Add Upcoming Trip Package
                                </span>
                                {showTripForm ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                            {showTripForm && (
                                <form onSubmit={handleTripSubmit} className="px-6 pb-8 pt-2 space-y-6 border-t border-border/50">
                                    <Section title="Basic Info">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Field label="Trip Title *"><Input placeholder="e.g. Spiti Valley Explorer" value={tripForm.title} onChange={tripToggle("title")} required /></Field>
                                            <Field label="Destination *"><Input placeholder="e.g. Spiti Valley, HP" value={tripForm.destination} onChange={tripToggle("destination")} required /></Field>
                                            <Field label="Duration"><Input placeholder="e.g. 6 Days / 5 Nights" value={tripForm.duration} onChange={tripToggle("duration")} /></Field>
                                            <Field label="Price per Person (₹)"><Input type="number" placeholder="12999" value={tripForm.price} onChange={tripToggle("price")} /></Field>
                                            <Field label="Departure Date"><Input placeholder="e.g. April 15, 2025" value={tripForm.departureDate} onChange={tripToggle("departureDate")} /></Field>
                                            <Field label="Max Group Size"><Input type="number" placeholder="15" value={tripForm.maxGroupSize} onChange={tripToggle("maxGroupSize")} /></Field>
                                            <Field label="Cancellation Policy"><Input placeholder="e.g. Free cancellation up to 7 days" value={tripForm.cancellationPolicy} onChange={tripToggle("cancellationPolicy")} /></Field>
                                            <Field label="Status">
                                                <select value={tripForm.status} onChange={tripToggle("status")} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm capitalize">
                                                    {TRIP_STATUS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                                                </select>
                                            </Field>
                                        </div>
                                        <Field label="About this Trip"><Textarea rows={4} placeholder="Describe the experience…" value={tripForm.description} onChange={tripToggle("description")} /></Field>
                                    </Section>

                                    <Section title="Photos (Firebase Storage)">
                                        <TripPhotoUploader photos={tripForm.photos} onChange={photos => setTripForm(f => ({ ...f, photos }))} folder="trips" />
                                    </Section>

                                    <Section title="Highlights">
                                        <Field label="One highlight per line">
                                            <Textarea rows={4} placeholder={"Visit Chandratal Lake\nSpend night at 4200m\nKaza local market"} value={tripForm.highlights} onChange={tripToggle("highlights")} />
                                        </Field>
                                    </Section>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Section title="Included">
                                            <Field label="One item per line">
                                                <Textarea rows={5} placeholder={"Accommodation\nAll meals\nTransport\nTrekking guide"} value={tripForm.included} onChange={tripToggle("included")} />
                                            </Field>
                                        </Section>
                                        <Section title="Excluded">
                                            <Field label="One item per line">
                                                <Textarea rows={5} placeholder={"Flights\nPersonal expenses\nTravel insurance"} value={tripForm.excluded} onChange={tripToggle("excluded")} />
                                            </Field>
                                        </Section>
                                    </div>

                                    <Section title="Itinerary">
                                        <div className="space-y-4">
                                            {tripForm.itinerary.map((day, i) => (
                                                <div key={i} className="border border-border rounded-xl p-4 space-y-3 relative">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm font-semibold text-muted-foreground">Day {i + 1}</span>
                                                        {tripForm.itinerary.length > 1 && (
                                                            <button type="button" onClick={() => removeDay(i)} className="text-xs text-destructive hover:underline">Remove</button>
                                                        )}
                                                    </div>
                                                    <Input placeholder={`Day ${i + 1} title…`} value={day.title} onChange={e => updateDay(i, "title", e.target.value)} />
                                                    <Textarea rows={2} placeholder="What happens this day…" value={day.description} onChange={e => updateDay(i, "description", e.target.value)} />
                                                </div>
                                            ))}
                                            <Button type="button" variant="outline" size="sm" onClick={addDay}>
                                                <Plus className="w-3.5 h-3.5 mr-1" /> Add Day
                                            </Button>
                                        </div>
                                    </Section>

                                    <Section title="Tags">
                                        <Field label="Comma-separated"><Input placeholder="trekking, camping, high altitude" value={tripForm.tags} onChange={tripToggle("tags")} /></Field>
                                    </Section>

                                    <Button type="submit" disabled={savingTrip} className="w-full h-12 text-base">
                                        {savingTrip ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</> : <><Plus className="w-4 h-4 mr-2" />Add Trip Package</>}
                                    </Button>
                                </form>
                            )}
                        </div>

                        {/* Trips list */}
                        <h2 className="text-xl font-bold font-heading">All Trip Packages ({trips.length})</h2>
                        {trips.length === 0 ? (
                            <div className="text-center py-16 text-muted-foreground bg-card border border-border rounded-2xl">No trip packages yet.</div>
                        ) : (
                            <div className="space-y-3">
                                {trips.map(t => (
                                    <div key={t.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                                        {t.photos?.[0] && <img src={t.photos[0]} alt={t.title} className="w-20 h-14 rounded-lg object-cover flex-shrink-0" />}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold truncate">{t.title}</div>
                                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5" /> {t.destination} · {t.duration} · ₹{t.price?.toLocaleString()}/person
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-0.5">{t.departureDate}</div>
                                        </div>
                                        <div className="flex gap-2 items-center flex-shrink-0">
                                            <Badge variant={t.status === "upcoming" ? "default" : t.status === "full" ? "destructive" : "secondary"} className="text-xs capitalize">{t.status}</Badge>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deleteTrip(t.id, t.title)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ═══════ DESTINATIONS TAB ═══════ */}
                {activeTab === "destinations" && (
                    <div className="space-y-6">
                        {/* Add Tourist Destination */}
                        <div className="bg-card border border-border rounded-2xl overflow-hidden">
                            <button onClick={() => setShowTouristForm(v => !v)}
                                className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors">
                                <span className="font-bold text-lg flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-primary" /> Add Tourist Destination
                                </span>
                                {showTouristForm ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                            {showTouristForm && (
                                <form onSubmit={handleTouristSubmit} className="px-6 pb-8 pt-2 space-y-6 border-t border-border/50">
                                    <Section title="Basic Info">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Field label="Name *"><Input placeholder="e.g. Manali" value={touristForm.name} onChange={touristToggle("name")} required /></Field>
                                            <Field label="Region *"><Input placeholder="e.g. Himachal Pradesh" value={touristForm.region} onChange={touristToggle("region")} required /></Field>
                                            <Field label="Google Maps URL"><Input placeholder="https://maps.app.goo.gl/..." value={touristForm.mapUrl} onChange={touristToggle("mapUrl")} /></Field>
                                            <Field label="Weather"><Input placeholder="e.g. 15°C - 25°C" value={touristForm.weather} onChange={touristToggle("weather")} /></Field>
                                            <Field label="Vibe Score (1-10)"><Input type="number" min="1" max="10" placeholder="8.5" value={touristForm.vibeScore} onChange={touristToggle("vibeScore")} /></Field>
                                            <Field label="Approx Cost"><Input placeholder="e.g. ₹5,000/day" value={touristForm.cost} onChange={touristToggle("cost")} /></Field>
                                        </div>
                                    </Section>

                                    <Section title="Photos (Firebase Storage)">
                                        <TripPhotoUploader photos={touristForm.photos} onChange={photos => setTouristForm(f => ({ ...f, photos }))} folder="destinations" />
                                    </Section>

                                    <Section title="Details & Stats">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Field label="Best Time to Visit"><Input placeholder="e.g. March to June" value={touristForm.bestTime} onChange={touristToggle("bestTime")} /></Field>
                                            <Field label="Budget Rating"><Input placeholder="e.g. Moderate" value={touristForm.budget} onChange={touristToggle("budget")} /></Field>
                                        </div>
                                        <Field label="Description"><Textarea rows={4} placeholder="Describe the destination…" value={touristForm.description} onChange={touristToggle("description")} /></Field>
                                        <Field label="Highlights (One per line)"><Textarea rows={4} placeholder={"Snow points\nCafes\nTemples"} value={touristForm.highlights} onChange={touristToggle("highlights")} /></Field>
                                    </Section>

                                    <Button type="submit" disabled={savingTourist} className="w-full h-12 text-base">
                                        {savingTourist ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</> : <><Plus className="w-4 h-4 mr-2" />Add Tourist Destination</>}
                                    </Button>
                                </form>
                            )}
                        </div>

                        {/* Add Offbeat Destination */}
                        <div className="bg-card border border-border rounded-2xl overflow-hidden mt-4">
                            <button onClick={() => setShowOffbeatForm(v => !v)}
                                className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors">
                                <span className="font-bold text-lg flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-primary" /> Add Offbeat / Musafir Destination
                                </span>
                                {showOffbeatForm ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                            {showOffbeatForm && (
                                <form onSubmit={handleOffbeatSubmit} className="px-6 pb-8 pt-2 space-y-6 border-t border-border/50">
                                    <Section title="Basic Info">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Field label="Name *"><Input placeholder="e.g. Secret Waterfall" value={offbeatForm.name} onChange={offbeatToggle("name")} required /></Field>
                                            <Field label="Region *"><Input placeholder="e.g. Goa" value={offbeatForm.region} onChange={offbeatToggle("region")} required /></Field>
                                            <Field label="Google Maps URL"><Input placeholder="https://maps.app.goo.gl/..." value={offbeatForm.mapUrl} onChange={offbeatToggle("mapUrl")} /></Field>
                                            <Field label="Weather"><Input placeholder="e.g. 25°C - 30°C" value={offbeatForm.weather} onChange={offbeatToggle("weather")} /></Field>
                                            <Field label="Vibe Score (1-10)"><Input type="number" min="1" max="10" placeholder="9.5" value={offbeatForm.vibeScore} onChange={offbeatToggle("vibeScore")} /></Field>
                                            <Field label="Approx Cost"><Input placeholder="e.g. Free" value={offbeatForm.cost} onChange={offbeatToggle("cost")} /></Field>
                                        </div>
                                    </Section>

                                    <Section title="Photos (Firebase Storage)">
                                        <TripPhotoUploader photos={offbeatForm.photos} onChange={photos => setOffbeatForm(f => ({ ...f, photos }))} folder="destinations" />
                                    </Section>

                                    <Section title="Musafir Categorization">
                                        <div className="grid grid-cols-1 gap-6">
                                            <Field label="Core Category *">
                                                <select value={offbeatForm.category} onChange={e => setOffbeatForm(f => ({ ...f, category: e.target.value, subCategories: [] }))} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                                                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
                                                </select>
                                            </Field>

                                            {offbeatForm.category && SUBCATEGORIES_MAP[offbeatForm.category] && (
                                                <Field label={`Specific Sub-categories for ${CATEGORIES.find(c => c.id === offbeatForm.category)?.label}`}>
                                                    <div className="flex flex-wrap gap-2">
                                                        {SUBCATEGORIES_MAP[offbeatForm.category].map(subcat => (
                                                            <button
                                                                type="button"
                                                                key={subcat}
                                                                onClick={() => toggleSubCategory(subcat)}
                                                                className={cn(
                                                                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                                                                    offbeatForm.subCategories.includes(subcat)
                                                                        ? "bg-primary text-primary-foreground border-primary"
                                                                        : "bg-muted border-border hover:border-primary/50"
                                                                )}>
                                                                {subcat}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </Field>
                                            )}

                                            <Field label="Smart Tags">
                                                <div className="flex flex-wrap gap-2">
                                                    {SMART_TAGS.map(tag => (
                                                        <label key={tag.id} className={cn(
                                                            "cursor-pointer border rounded-full px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5",
                                                            offbeatForm.tags.includes(tag.id) ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted text-muted-foreground border-border"
                                                        )}>
                                                            <input type="checkbox" className="hidden" checked={offbeatForm.tags.includes(tag.id)} onChange={() => toggleDestTag(tag.id)} />
                                                            <span>{tag.icon}</span> <span>{tag.label}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </Field>
                                        </div>
                                    </Section>

                                    <Section title="Details & Stats">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Field label="Best Time to Visit"><Input placeholder="e.g. October to February" value={offbeatForm.bestTime} onChange={offbeatToggle("bestTime")} /></Field>
                                            <Field label="Budget Rating"><Input placeholder="e.g. Cheap" value={offbeatForm.budget} onChange={offbeatToggle("budget")} /></Field>
                                        </div>
                                        <Field label="Description"><Textarea rows={4} placeholder="Describe the destination…" value={offbeatForm.description} onChange={offbeatToggle("description")} /></Field>
                                        <Field label="Highlights (One per line)"><Textarea rows={4} placeholder="Less crowded\nScenic drive" value={offbeatForm.highlights} onChange={offbeatToggle("highlights")} /></Field>
                                    </Section>

                                    <Button type="submit" disabled={savingOffbeat} className="w-full h-12 text-base">
                                        {savingOffbeat ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</> : <><Plus className="w-4 h-4 mr-2" />Add Offbeat Destination</>}
                                    </Button>
                                </form>
                            )}
                        </div>

                        {/* Destinations List */}
                        <h2 className="text-xl font-bold font-heading">All Destinations ({destinations.length})</h2>
                        {destinations.length === 0 ? (
                            <div className="text-center py-16 text-muted-foreground bg-card border border-border rounded-2xl">No destinations yet.</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {destinations.map(d => (
                                    <div key={d.id} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
                                        <div className="flex gap-3">
                                            {d.image && <img src={d.image} alt={d.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />}
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold truncate">{d.name}</div>
                                                <div className="text-sm text-muted-foreground truncate">{d.region}</div>
                                                {d.category && (
                                                    <div className="text-xs font-medium text-primary mt-1 flex items-center gap-1">
                                                        {CATEGORIES.find(c => c.id === d.category)?.icon} {CATEGORIES.find(c => c.id === d.category)?.label || d.category}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {typeof d.tags === 'string' && d.tags && (
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {d.tags.split(',').map(t => t.trim()).filter(Boolean).map(t => {
                                                    const tagData = SMART_TAGS.find(st => st.id === t);
                                                    return tagData ? (
                                                        <span key={t} className="px-1.5 py-0.5 border border-border/50 rounded text-[10px] font-medium text-muted-foreground flex items-center gap-1">{tagData.icon} {tagData.label}</span>
                                                    ) : (
                                                        <span key={t} className="px-1.5 py-0.5 border border-border/50 rounded text-[10px] font-medium text-muted-foreground">{t}</span>
                                                    );
                                                })}
                                            </div>
                                        )}
                                        <div className="mt-auto pt-3 border-t border-border/50 flex justify-end">
                                            <Button variant="ghost" size="sm" className="text-destructive h-8 px-2 hover:bg-destructive/10" onClick={() => deleteDestinationItem(d.id, d.name)}>
                                                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">{title}</h3>
            {children}
        </div>
    );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium">{label}</label>
            {children}
        </div>
    );
}
