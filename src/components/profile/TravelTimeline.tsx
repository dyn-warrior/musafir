import { MapPin, Calendar } from "lucide-react";

const TRIPS = [
    {
        id: 1,
        location: "Spiti Valley, Himachal",
        date: "Oct 2024",
        image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop",
        description: "10 days of pure bliss in the mountains. Visited Key Monastery and Chandratal Lake."
    },
    {
        id: 2,
        location: "Gokarna, Karnataka",
        date: "Dec 2023",
        image: "https://images.unsplash.com/photo-1677054898485-611956695271?q=80&w=2070&auto=format&fit=crop",
        description: "Beach hopping and cafe crawling. The sunset at Om Beach was magical."
    }
];

export function TravelTimeline() {
    return (
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {TRIPS.map((trip) => (
                <div key={trip.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                    {/* Icon */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-primary text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <MapPin className="w-5 h-5" />
                    </div>

                    {/* Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card p-4 rounded-xl border border-border/50 shadow-sm">
                        <div className="aspect-video w-full rounded-lg overflow-hidden mb-3">
                            <img src={trip.image} alt={trip.location} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-lg">{trip.location}</h3>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {trip.date}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{trip.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
