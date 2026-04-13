"use client";

import { MapPin, CloudSun, Star } from "lucide-react";
import Link from "next/link";

interface DestinationProps {
    destination: {
        id: string;
        name: string;
        image: string;
        region: string;
        tags: string[];
        weather: string;
        vibeScore: number;
        cost: string;
    };
}

export function DestinationCard({ destination }: DestinationProps) {
    return (
        <Link href={`/explore/details?id=${destination.id}`} className="group block relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all">
            {/* Image */}
            <div className="aspect-[4/3] overflow-hidden relative">
                <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <CloudSun className="w-3 h-3" /> {destination.weather}
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                    <h3 className="text-white font-heading font-bold text-xl">{destination.name}</h3>
                    <p className="text-gray-200 text-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {destination.region}
                    </p>
                </div>
            </div>

            {/* Details */}
            <div className="p-4">
                <div className="flex flex-wrap gap-2 mb-3">
                    {destination.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-medium px-2 py-1 bg-muted rounded-full text-muted-foreground">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex items-center justify-between border-t border-border/50 pt-3">
                    <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-bold text-foreground">{destination.vibeScore}</span>
                        <span className="text-xs text-muted-foreground">/ 10 Vibe</span>
                    </div>
                    <div className="text-sm font-semibold text-primary">
                        {destination.cost} <span className="text-xs font-normal text-muted-foreground">/ day</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
