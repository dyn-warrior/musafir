"use client";

import { cn } from "@/lib/utils";
import { MapPin, Bus, Utensils, Bed, ShieldAlert, Camera } from "lucide-react";

interface WikiSidebarProps {
    activeSection: string;
    onSelectSection: (section: string) => void;
}

const SECTIONS = [
    { id: "overview", label: "Overview", icon: MapPin },
    { id: "transport", label: "Transport", icon: Bus },
    { id: "stays", label: "Where to Stay", icon: Bed },
    { id: "food", label: "Food Guide", icon: Utensils },
    { id: "safety", label: "Safety Tips", icon: ShieldAlert },
    { id: "spots", label: "Photo Spots", icon: Camera },
];

export function WikiSidebar({ activeSection, onSelectSection }: WikiSidebarProps) {
    return (
        <div className="w-full md:w-64 bg-card border-r border-border/50 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto hidden md:block">
            <div className="p-4">
                <h3 className="font-heading font-bold text-lg mb-4">Table of Contents</h3>
                <nav className="space-y-1">
                    {SECTIONS.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => onSelectSection(section.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                activeSection === section.id
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <section.icon className="w-4 h-4" />
                            {section.label}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
}
