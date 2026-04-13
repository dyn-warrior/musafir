"use client";

import { Calendar, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

interface FestivalCardProps {
    festival: {
        id: string;
        name: string;
        location: string;
        dates: string;
        image: string;
        tags: string[];
        month: string;
        day: string;
    };
}

export function FestivalCard({ festival }: FestivalCardProps) {
    return (
        <Link
            href={`/festivals/details?id=${festival.id}`}
            className="group flex flex-col md:flex-row bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-lg transition-all"
        >
            {/* Date Badge (Mobile: Top, Desktop: Left) */}
            <div className="bg-primary/10 text-primary p-4 flex flex-row md:flex-col items-center justify-center gap-1 md:w-24 flex-shrink-0">
                <span className="text-sm font-bold uppercase tracking-wider">{festival.month}</span>
                <span className="text-2xl md:text-3xl font-heading font-bold">{festival.day}</span>
            </div>

            {/* Image */}
            <div className="h-48 md:h-auto md:w-64 relative overflow-hidden">
                <img
                    src={festival.image}
                    alt={festival.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-center">
                <div className="flex flex-wrap gap-2 mb-3">
                    {festival.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-medium px-2 py-1 bg-muted rounded-full text-muted-foreground uppercase tracking-wide">
                            {tag}
                        </span>
                    ))}
                </div>

                <h3 className="font-heading font-bold text-xl mb-2 group-hover:text-primary transition-colors">{festival.name}</h3>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-auto">
                    <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {festival.location}
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> {festival.dates}
                    </div>
                </div>
            </div>

            {/* Action */}
            <div className="p-4 flex items-center justify-center md:border-l border-border/50">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <ArrowRight className="w-5 h-5" />
                </div>
            </div>
        </Link>
    );
}
