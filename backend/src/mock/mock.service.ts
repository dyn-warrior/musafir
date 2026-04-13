import { Injectable } from '@nestjs/common';

@Injectable()
export class MockService {
    private readonly posts = [
        {
            id: 1,
            user: {
                name: "Aarav Sharma",
                handle: "@aarav_travels",
                avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
                verified: true
            },
            location: "Manali, Himachal Pradesh",
            image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop",
            caption: "Woke up to this view! Manali never disappoints. 🏔️✨ #Himalayas #TravelDiaries",
            likes: 1240,
            comments: 45,
            time: "2h ago",
            type: "photo"
        },
        {
            id: 2,
            user: {
                name: "Priya Singh",
                handle: "@priya_explores",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
                verified: false
            },
            location: "Varkala, Kerala",
            image: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?q=80&w=2070&auto=format&fit=crop",
            caption: "Sunset cliffs and good vibes. Varkala is pure magic! 🌅🌊 #Kerala #BeachLife",
            likes: 890,
            comments: 32,
            time: "5h ago",
            type: "photo"
        },
        {
            id: 3,
            user: {
                name: "Rohan Mehta",
                handle: "@rohan_hikes",
                avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop",
                verified: true
            },
            location: "Spiti Valley",
            caption: "Just completed the Spiti circuit! Here's my 7-day itinerary for anyone planning a trip.",
            likes: 2100,
            comments: 150,
            time: "1d ago",
            type: "trip",
            tripData: {
                title: "Spiti Valley Road Trip",
                days: 7,
                budget: "₹15k - ₹20k",
                stops: ["Shimla", "Kalpa", "Kaza", "Chandratal"]
            }
        }
    ];

    private profile = {
        name: "Vatsal Singh",
        handle: "@vatsal_nomad",
        bio: "Digital Nomad | Photographer 📸 | Exploring the Himalayas 🏔️",
        location: "Manali, India",
        image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
        stats: {
            posts: 42,
            followers: "1.2k",
            following: 350
        },
        posts: [
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1886&auto=format&fit=crop"
        ]
    };

    private readonly wikis = [
        { id: "manali", name: "Manali", region: "Himachal Pradesh", views: "12k" },
        { id: "goa", name: "Goa", region: "India", views: "45k" },
        { id: "spiti", name: "Spiti Valley", region: "Himachal Pradesh", views: "8k" },
        { id: "varkala", name: "Varkala", region: "Kerala", views: "15k" },
    ];

    private readonly goOutRequests = [
        {
            id: "1",
            user: { name: "Ankit Verma", age: 26, image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop" },
            trip: { title: "Hampta Pass Trek", destination: "Manali", date: "Oct 15 - 20", type: "Trekking", budget: "₹8000" },
            description: "Planning to do the Hampta Pass trek with a guide. Looking for 2 more people to share the cost. Beginner friendly!"
        },
        {
            id: "2",
            user: { name: "Priya Singh", age: 24, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop" },
            trip: { title: "Workation in Goa", destination: "North Goa", date: "Nov 1 - 15", type: "Backpacking", budget: "₹20000" },
            description: "Heading to Goa for a 2-week workation. Booked a villa with good WiFi. Need a female roommate to split the cost."
        },
        {
            id: "3",
            user: { name: "Rahul & Team", age: 28, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop" },
            trip: { title: "Spiti Road Trip", destination: "Spiti Valley", date: "Sep 25 - Oct 2", type: "Road Trip", budget: "₹15000" },
            description: "Driving from Delhi to Spiti. We have 1 seat empty in our SUV. Join us for the ultimate road trip!"
        },
        {
            id: "4",
            user: { name: "Sneha", age: 25, image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop" },
            trip: { title: "Pushkar Camel Fair", destination: "Pushkar", date: "Nov 20 - 22", type: "Event", budget: "₹5000" },
            description: "Going for the photography contest. Looking for fellow photographers to explore the fair with."
        }
    ];

    private readonly stories = [
        { id: 1, name: "Your Story", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop", isUser: true },
        { id: 2, name: "Sarah", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop" },
        { id: 3, name: "Mike", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop" },
        { id: 4, name: "Jessica", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop" },
        { id: 5, name: "Alex", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop" },
        { id: 6, name: "Emily", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop" },
    ];

    // Expanded Destinations with Details
    private readonly destinations = [
        {
            id: "1",
            name: "Manali",
            region: "Himachal Pradesh",
            image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop",
            tags: "Mountains, Snow, Adventure",
            weather: "5°C",
            vibeScore: 9.2,
            cost: "₹₹",
            description: "A hidden gem in the Tirthan Valley, Jibhi is known for its dense pine forests, freshwater lakes, and pristine waterfalls. Perfect for slow travelers and digital nomads.",
            stats: { weather: "12°C", bestTime: "Mar - Jun", budget: "₹1500/day" },
            highlights: ["Jibhi Waterfall", "Serolsar Lake", "Chehni Kothi", "Jalori Pass"]
        },
        {
            id: "2",
            name: "Goa",
            region: "India",
            image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1974&auto=format&fit=crop",
            tags: "Beaches, Party, Relax",
            weather: "28°C",
            vibeScore: 9.5,
            cost: "₹₹₹",
            description: "India's party capital, famous for its golden beaches, Portuguese heritage, and vibrant nightlife. A perfect blend of relaxation and excitement.",
            stats: { weather: "28°C", bestTime: "Nov - Feb", budget: "₹3000/day" },
            highlights: ["Baga Beach", "Fort Aguada", "Dudhsagar Falls", "Old Goa Churches"]
        },
        {
            id: "3",
            name: "Spiti Valley",
            region: "Himachal Pradesh",
            image: "https://images.unsplash.com/photo-1589802829985-817e51171b92?q=80&w=2070&auto=format&fit=crop",
            tags: "Road Trip, Monasteries, Offbeat",
            weather: "-2°C",
            vibeScore: 9.8,
            cost: "₹₹",
            description: "A cold desert mountain valley located high in the Himalayas. Known for its rugged landscapes, ancient monasteries, and challenging roads.",
            stats: { weather: "-5°C", bestTime: "Jun - Sep", budget: "₹2000/day" },
            highlights: ["Key Monastery", "Chandratal Lake", "Pin Valley", "Kibber Village"]
        }
    ];

    private readonly stays = [
        {
            id: "1",
            name: "Zostel Manali",
            location: "Old Manali, Himachal",
            price: "₹899",
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop",
            type: "Hostel",
            amenities: ["WiFi", "Cafe"],
            tags: ["Social", "Mountain View"]
        },
        {
            id: "2",
            name: "The Mudhouse Hostel",
            location: "Jibhi, Himachal",
            price: "₹1200",
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=2070&auto=format&fit=crop",
            type: "Hostel",
            amenities: ["WiFi", "Cafe"],
            tags: ["River Side", "Workation"]
        },
        {
            id: "3",
            name: "Goa Villagio",
            location: "Betalbatim, Goa",
            price: "₹3500",
            rating: 4.5,
            image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop",
            type: "Resort",
            amenities: ["WiFi", "Pool"],
            tags: ["Luxury", "Beach"]
        },
        {
            id: "4",
            name: "Spiti Homestay",
            location: "Kaza, Spiti",
            price: "₹1500",
            rating: 4.7,
            image: "https://images.unsplash.com/photo-1518733057094-95b53143d2a7?q=80&w=1865&auto=format&fit=crop",
            type: "Homestay",
            amenities: ["Food"],
            tags: ["Authentic", "Culture"]
        }
    ];

    private readonly festivals = [
        {
            id: "1",
            name: "Ziro Festival of Music",
            location: "Ziro Valley, Arunachal",
            dates: "Sep 28 - Oct 1",
            month: "Sep",
            day: "28",
            image: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=2070&auto=format&fit=crop",
            tags: ["Music", "Culture", "Camping"]
        },
        {
            id: "2",
            name: "Hornbill Festival",
            location: "Kisama, Nagaland",
            dates: "Dec 1 - 10",
            month: "Dec",
            day: "01",
            image: "https://images.unsplash.com/photo-1563493206-8d6268912389?q=80&w=2070&auto=format&fit=crop",
            tags: ["Tribal", "Dance", "Food"]
        },
        {
            id: "3",
            name: "Pushkar Camel Fair",
            location: "Pushkar, Rajasthan",
            dates: "Nov 20 - 28",
            month: "Nov",
            day: "20",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
            tags: ["Photography", "Culture", "Fair"]
        },
        {
            id: "4",
            name: "Hemis Festival",
            location: "Ladakh",
            dates: "Jun 28 - 29",
            month: "Jun",
            day: "28",
            image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2070&auto=format&fit=crop",
            tags: ["Spiritual", "Mask Dance", "Himalayas"]
        }
    ];

    getPosts() { return this.posts; }
    getDestinations() { return this.destinations; }
    getDestinationById(id: string) { return this.destinations.find(d => d.id === id); }
    getStays() { return this.stays; }
    getFestivals() { return this.festivals; }
    getProfile() { return this.profile; }
    getWikis() { return this.wikis; }
    getGoOutRequests() { return this.goOutRequests; }
    getStories() { return this.stories; }

    // Write Operations
    addGoOutRequest(request: any) {
        const newRequest = { id: Date.now().toString(), ...request };
        this.goOutRequests.unshift(newRequest);
        return newRequest;
    }

    addGroup(group: any) {
        // Mock implementation since we don't have a groups array exposed yet
        console.log("Adding group:", group);
        return { id: Date.now().toString(), ...group };
    }

    toggleLike(postId: number) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            // Simple toggle simulation (in real app, would track user likes)
            post.likes += 1;
            return { likes: post.likes, liked: true };
        }
        return null;
    }

    updateProfile(updatedProfile: any) {
        this.profile = { ...this.profile, ...updatedProfile };
        return this.profile;
    }

    addComment(postId: number, comment: string) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.comments += 1;
            return { success: true, comments: post.comments };
        }
        return { success: false };
    }

    generateItinerary(prompt: string) {
        return {
            success: true,
            itinerary: `Here is a 5-day itinerary for ${prompt}: Day 1: Arrival and local sightseeing. Day 2: Adventure activities. Day 3: Cultural tour. Day 4: Relaxation. Day 5: Departure.`
        };
    }

    savePost(postId: number) {
        // Mock save functionality
        return { success: true, saved: true };
    }

    // Chat Operations
    private chats = [
        { id: '1', name: "Manali Backpackers", lastMessage: "Anyone up for a trek tomorrow?", time: "10:30 AM", unread: 2, image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=60" },
        { id: '2', name: "Goa Beach Party", lastMessage: "See you at Anjuna!", time: "Yesterday", unread: 0, image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=60" }
    ];

    private messages: Record<string, any[]> = {
        '1': [
            { id: 'm1', text: "Hey guys, when are we leaving?", sender: "Alex", time: "10:00 AM", isMe: false },
            { id: 'm2', text: "Planning for 6 AM start.", sender: "Sarah", time: "10:15 AM", isMe: false },
            { id: 'm3', text: "Anyone up for a trek tomorrow?", sender: "Mike", time: "10:30 AM", isMe: false }
        ],
        '2': [
            { id: 'm1', text: "Tickets booked!", sender: "John", time: "Yesterday", isMe: false },
            { id: 'm2', text: "See you at Anjuna!", sender: "Me", time: "Yesterday", isMe: true }
        ]
    };

    getChats() { return this.chats; }

    getMessages(chatId: string) { return this.messages[chatId] || []; }

    sendMessage(chatId: string, text: string) {
        if (!this.messages[chatId]) this.messages[chatId] = [];
        const newMessage = {
            id: Date.now().toString(),
            text,
            sender: "Me",
            time: "Just now",
            isMe: true
        };
        this.messages[chatId].push(newMessage);

        // Update last message in chat list
        const chat = this.chats.find(c => c.id === chatId);
        if (chat) {
            chat.lastMessage = text;
            chat.time = "Just now";
        }

        return newMessage;
    }

    getWikiPage(id: string) {
        // Mock data for Chefchaouen (id: 'chefchaouen' or default)
        return {
            id: id,
            title: 'Chefchaouen, Morocco',
            subtitle: 'The Blue Pearl of the Rif Mountains.',
            image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2070&auto=format&fit=crop',
            sections: {
                overview: 'Nestled in the dramatic Rif Mountains, Chefchaouen is a city of striking beauty, celebrated for its blue-rinsed buildings that cascade down the hillside. Beyond its aesthetics, it offers a relaxed pace, rich history, and unique cultural experiences.',
                howToReach: 'The closest major airports are Tangier Ibn Battuta (TNG) and Fes Sais (FEZ). From Tangier, it\'s a 2-3 hour bus or taxi ride.',
                budget: [
                    { item: 'Accommodation (Mid-range Riad)', cost: '400 - 800 MAD' },
                    { item: 'Food (Local Restaurants)', cost: '150 - 300 MAD' },
                    { item: 'Transport (Local Taxis)', cost: '20 - 50 MAD' },
                    { item: 'Activities & Entry Fees', cost: '50 - 150 MAD' }
                ],
                stays: [
                    { name: 'Dar Echchaouen', price: 'from $95/night', rating: '4.8', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=300&h=200&auto=format&fit=crop' },
                    { name: 'Lina Riad & Spa', price: 'from $120/night', rating: '4.6', img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=300&h=200&auto=format&fit=crop' },
                    { name: 'Casa Perla', price: 'from $50/night', rating: '4.5', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=300&h=200&auto=format&fit=crop' }
                ]
            }
        };
    }

    getTrips() {
        return [
            { id: 1, host: 'Rupalee', hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop', title: 'Join Rupalee on a trek to Chandratal Lake', desc: 'Looking for 2-3 companions for a moderate trek. Focus on photography and local culture.', date: 'Oct 12-18', loc: 'Spiti Valley, India', type: 'trek' },
            { id: 2, host: 'Kenji', hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop', title: 'Documentary Photography in Kyoto', desc: 'A small group trip focusing on capturing the autumn colors and traditional artisans.', date: 'Nov 20-27', loc: 'Kyoto, Japan', type: 'photo' },
            { id: 3, host: 'Sarah', hostAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop', title: 'Cycling the Silk Road - Segment 1', desc: 'An epic journey. Seeking experienced cyclists for the first leg from Xi\'an to Lanzhou.', date: 'Sep 15 - Oct 5', loc: 'China', type: 'cycling' },
            { id: 4, host: 'Mateo', hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop', title: 'Seeking Crew for Coastal Cleanup & Surf', desc: 'Environmentally conscious trip. Help clean a remote beach, then enjoy surfing.', date: 'Nov 5 - 10', loc: 'Algarve, Portugal', type: 'surf' },
        ];
    }
}
