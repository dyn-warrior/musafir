"use client";

import { MapPin, Star, Wifi, Coffee } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge"; // Assuming we might want a badge component, or just use div

interface StayCardProps {
    stay: {
        id: string;
        name: string;
        location: string;
        price: string;
        rating: number;
        image: string;
        type: string;
        amenities: string[];
        tags: string[];
    };
}

export function StayCard({ stay }: StayCardProps) {
    return (
        <Link
            href={`/stays/details?id=${stay.id}`}
            className="group block bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-lg transition-all"
        >
            {/* Image */}
            <div className="aspect-[4/3] relative overflow-hidden">
                <img
                    src={stay.image}
                    alt={stay.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                    <span className="bg-background/80 backdrop-blur-md text-foreground text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                        {stay.type}
                    </span>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {stay.rating}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-heading font-bold text-lg leading-tight group-hover:text-primary transition-colors">{stay.name}</h3>
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-3 h-3" /> {stay.location}
                </div>

                <div className="flex gap-2 mb-4">
                    {stay.tags.map(tag => (
                        <span key={tag} className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex gap-2 text-muted-foreground">
                        {stay.amenities.includes("WiFi") && <Wifi className="w-4 h-4" />}
                        {stay.amenities.includes("Cafe") && <Coffee className="w-4 h-4" />}
                    </div>
                    <div className="text-right">
                        <span className="font-bold text-lg text-primary">{stay.price}</span>
                        <span className="text-xs text-muted-foreground"> / night</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
