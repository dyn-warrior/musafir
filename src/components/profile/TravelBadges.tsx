import { Trophy, Mountain, Tent, Camera } from "lucide-react";

const BADGES = [
    { id: 1, name: "Himalayan Explorer", icon: Mountain, color: "text-blue-500 bg-blue-100" },
    { id: 2, name: "Camping Pro", icon: Tent, color: "text-green-500 bg-green-100" },
    { id: 3, name: "Storyteller", icon: Camera, color: "text-purple-500 bg-purple-100" },
    { id: 4, name: "Early Adopter", icon: Trophy, color: "text-yellow-500 bg-yellow-100" },
];

export function TravelBadges() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BADGES.map((badge) => (
                <div key={badge.id} className="flex flex-col items-center p-4 bg-card rounded-xl border border-border/50 hover:shadow-sm transition-shadow">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${badge.color}`}>
                        <badge.icon className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-center">{badge.name}</span>
                </div>
            ))}
        </div>
    );
}
