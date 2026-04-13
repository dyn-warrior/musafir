/**
 * Seed script — populates the Firestore emulator with mock data.
 * Run once after starting the emulator:
 *   npx ts-node --project tsconfig.json -e "require('./src/lib/seed.ts')"
 * Or via the npm script: npm run seed
 */

// Use the REST API approach for seeding in the emulator
const EMULATOR_HOST = "localhost";
const EMULATOR_PORT = 8080;
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "nomadicircle-8f98a";
const BASE_URL = `http://${EMULATOR_HOST}:${EMULATOR_PORT}/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

async function clearCollection(collectionName: string) {
    try {
        const res = await fetch(`${BASE_URL}/${collectionName}`);
        const json = await res.json();
        if (json.documents) {
            for (const doc of json.documents) {
                await fetch(`http://${EMULATOR_HOST}:${EMULATOR_PORT}/v1/${doc.name}`, { method: "DELETE" });
            }
        }
    } catch {
        // collection may not exist yet
    }
}

async function addDoc(collectionName: string, id: string, data: Record<string, unknown>) {
    const fields: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
        if (typeof value === "string") fields[key] = { stringValue: value };
        else if (typeof value === "number") fields[key] = { doubleValue: value };
        else if (typeof value === "boolean") fields[key] = { booleanValue: value };
        else if (Array.isArray(value)) {
            fields[key] = {
                arrayValue: {
                    values: value.map((v: unknown) =>
                        typeof v === "string"
                            ? { stringValue: v }
                            : typeof v === "number"
                                ? { doubleValue: v }
                                : { stringValue: JSON.stringify(v) }
                    ),
                },
            };
        } else if (value !== null && typeof value === "object") {
            const nestedFields: Record<string, unknown> = {};
            for (const [nk, nv] of Object.entries(value as Record<string, unknown>)) {
                if (typeof nv === "string") nestedFields[nk] = { stringValue: nv };
                else if (typeof nv === "number") nestedFields[nk] = { doubleValue: nv };
                else if (typeof nv === "boolean") nestedFields[nk] = { booleanValue: nv };
                else if (Array.isArray(nv)) {
                    nestedFields[nk] = {
                        arrayValue: { values: nv.map((v: unknown) => ({ stringValue: String(v) })) },
                    };
                }
            }
            fields[key] = { mapValue: { fields: nestedFields } };
        }
    }

    const url = `${BASE_URL}/${collectionName}?documentId=${id}`;
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields }),
    });
    if (!res.ok) {
        console.error(`Failed to seed ${collectionName}/${id}:`, await res.text());
    }
}

const posts = [
    {
        id: "post1",
        user_name: "Aarav Sharma", user_handle: "@aarav_travels",
        user_avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
        user_verified: true,
        location: "Manali, Himachal Pradesh",
        image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop",
        caption: "Woke up to this view! Manali never disappoints. 🏔️✨ #Himalayas #TravelDiaries",
        likes: 1240, comments: 45, time: "2h ago", type: "photo",
    },
    {
        id: "post2",
        user_name: "Priya Singh", user_handle: "@priya_explores",
        user_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
        user_verified: false,
        location: "Varkala, Kerala",
        image: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?q=80&w=2070&auto=format&fit=crop",
        caption: "Sunset cliffs and good vibes. Varkala is pure magic! 🌅🌊 #Kerala #BeachLife",
        likes: 890, comments: 32, time: "5h ago", type: "photo",
    },
    {
        id: "post3",
        user_name: "Rohan Mehta", user_handle: "@rohan_hikes",
        user_avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop",
        user_verified: true,
        location: "Spiti Valley",
        image: "https://images.unsplash.com/photo-1589802829985-817e51171b92?q=80&w=2070&auto=format&fit=crop",
        caption: "Just completed the Spiti circuit! Here's my 7-day itinerary for anyone planning a trip.",
        likes: 2100, comments: 150, time: "1d ago", type: "trip",
    },
];

const destinations = [
    { id: "1", name: "Manali", region: "Himachal Pradesh", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop", tags: "Mountains, Snow, Adventure", weather: "5°C", vibeScore: 9.2, cost: "₹₹", description: "A hidden gem in the Tirthan Valley, known for dense pine forests, freshwater lakes, and pristine waterfalls.", stats_weather: "12°C", stats_bestTime: "Mar - Jun", stats_budget: "₹1500/day", highlights: ["Jibhi Waterfall", "Serolsar Lake", "Chehni Kothi", "Jalori Pass"] },
    { id: "2", name: "Goa", region: "India", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1974&auto=format&fit=crop", tags: "Beaches, Party, Relax", weather: "28°C", vibeScore: 9.5, cost: "₹₹₹", description: "India's party capital, famous for golden beaches, Portuguese heritage, and vibrant nightlife.", stats_weather: "28°C", stats_bestTime: "Nov - Feb", stats_budget: "₹3000/day", highlights: ["Baga Beach", "Fort Aguada", "Dudhsagar Falls", "Old Goa Churches"] },
    { id: "3", name: "Spiti Valley", region: "Himachal Pradesh", image: "https://images.unsplash.com/photo-1589802829985-817e51171b92?q=80&w=2070&auto=format&fit=crop", tags: "Road Trip, Monasteries, Offbeat", weather: "-2°C", vibeScore: 9.8, cost: "₹₹", description: "A cold desert mountain valley high in the Himalayas. Known for rugged landscapes and ancient monasteries.", stats_weather: "-5°C", stats_bestTime: "Jun - Sep", stats_budget: "₹2000/day", highlights: ["Key Monastery", "Chandratal Lake", "Pin Valley", "Kibber Village"] },
];

const stays = [
    { id: "1", name: "Zostel Manali", location: "Old Manali, Himachal", price: "₹899", rating: 4.8, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop", type: "Hostel", amenities: ["WiFi", "Cafe"], tags: ["Social", "Mountain View"] },
    { id: "2", name: "The Mudhouse Hostel", location: "Jibhi, Himachal", price: "₹1200", rating: 4.9, image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=2070&auto=format&fit=crop", type: "Hostel", amenities: ["WiFi", "Cafe"], tags: ["River Side", "Workation"] },
    { id: "3", name: "Goa Villagio", location: "Betalbatim, Goa", price: "₹3500", rating: 4.5, image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop", type: "Resort", amenities: ["WiFi", "Pool"], tags: ["Luxury", "Beach"] },
    { id: "4", name: "Spiti Homestay", location: "Kaza, Spiti", price: "₹1500", rating: 4.7, image: "https://images.unsplash.com/photo-1518733057094-95b53143d2a7?q=80&w=1865&auto=format&fit=crop", type: "Homestay", amenities: ["Food"], tags: ["Authentic", "Culture"] },
];

const festivals = [
    { id: "1", name: "Ziro Festival of Music", location: "Ziro Valley, Arunachal", dates: "Sep 28 - Oct 1", month: "Sep", day: "28", image: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=2070&auto=format&fit=crop", tags: ["Music", "Culture", "Camping"] },
    { id: "2", name: "Hornbill Festival", location: "Kisama, Nagaland", dates: "Dec 1 - 10", month: "Dec", day: "01", image: "https://images.unsplash.com/photo-1563493206-8d6268912389?q=80&w=2070&auto=format&fit=crop", tags: ["Tribal", "Dance", "Food"] },
    { id: "3", name: "Pushkar Camel Fair", location: "Pushkar, Rajasthan", dates: "Nov 20 - 28", month: "Nov", day: "20", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop", tags: ["Photography", "Culture", "Fair"] },
    { id: "4", name: "Hemis Festival", location: "Ladakh", dates: "Jun 28 - 29", month: "Jun", day: "28", image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2070&auto=format&fit=crop", tags: ["Spiritual", "Mask Dance", "Himalayas"] },
];

const goOutRequests = [
    { id: "1", user_name: "Ankit Verma", user_age: 26, user_image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop", trip_title: "Hampta Pass Trek", trip_destination: "Manali", trip_date: "Oct 15 - 20", trip_type: "Trekking", trip_budget: "₹8000", description: "Planning the Hampta Pass trek with a guide. Looking for 2 more people to share cost. Beginner friendly!" },
    { id: "2", user_name: "Priya Singh", user_age: 24, user_image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop", trip_title: "Workation in Goa", trip_destination: "North Goa", trip_date: "Nov 1 - 15", trip_type: "Backpacking", trip_budget: "₹20000", description: "Heading to Goa for a 2-week workation. Booked a villa with good WiFi. Need a female roommate." },
    { id: "3", user_name: "Rahul & Team", user_age: 28, user_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop", trip_title: "Spiti Road Trip", trip_destination: "Spiti Valley", trip_date: "Sep 25 - Oct 2", trip_type: "Road Trip", trip_budget: "₹15000", description: "Driving from Delhi to Spiti. 1 seat empty in our SUV. Join us for the ultimate road trip!" },
    { id: "4", user_name: "Sneha", user_age: 25, user_image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop", trip_title: "Pushkar Camel Fair", trip_destination: "Pushkar", trip_date: "Nov 20 - 22", trip_type: "Event", trip_budget: "₹5000", description: "Going for the photography contest. Looking for fellow photographers to explore the fair with." },
];

const communityChats = [
    { id: "1", name: "Manali Backpackers", lastMessage: "Anyone up for a trek tomorrow?", time: "10:30 AM", unread: 2, image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=60" },
    { id: "2", name: "Goa Beach Party", lastMessage: "See you at Anjuna!", time: "Yesterday", unread: 0, image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=60" },
];

async function seed() {
    console.log(`🌱 Seeding Firestore emulator at http://${EMULATOR_HOST}:${EMULATOR_PORT}`);
    console.log(`   Project: ${PROJECT_ID}\n`);

    // Posts
    console.log("📝 Seeding posts...");
    await clearCollection("posts");
    for (const p of posts) {
        const { id, ...data } = p;
        await addDoc("posts", id, { ...data, createdAt: new Date().toISOString() });
    }

    // Destinations
    console.log("📍 Seeding destinations...");
    await clearCollection("destinations");
    for (const d of destinations) {
        const { id, ...data } = d;
        await addDoc("destinations", id, data);
    }

    // Stays
    console.log("🏠 Seeding stays...");
    await clearCollection("stays");
    for (const s of stays) {
        const { id, ...data } = s;
        await addDoc("stays", id, data);
    }

    // Festivals
    console.log("🎪 Seeding festivals...");
    await clearCollection("festivals");
    for (const f of festivals) {
        const { id, ...data } = f;
        await addDoc("festivals", id, data);
    }

    // Go-Out Requests
    console.log("🧭 Seeding go-out requests...");
    await clearCollection("goOutRequests");
    for (const r of goOutRequests) {
        const { id, ...data } = r;
        await addDoc("goOutRequests", id, { ...data, createdAt: new Date().toISOString() });
    }

    // Community Chats
    console.log("💬 Seeding community chats...");
    await clearCollection("communityChats");
    for (const c of communityChats) {
        const { id, ...data } = c;
        await addDoc("communityChats", id, data);
    }

    console.log("\n✅ Seeding complete! View data at http://localhost:4000/firestore");
}

seed().catch(console.error);
