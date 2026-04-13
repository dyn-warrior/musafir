"use client";

import { Home, Compass, MessageCircle, Calendar, BookOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { label: "Home", icon: Home, href: "/feed" },
    { label: "Explore", icon: Compass, href: "/explore" },
    { label: "Group Chat", icon: MessageCircle, href: "/community" },
    { label: "Go Out", icon: Calendar, href: "/go-out" },
    { label: "Place Wiki", icon: BookOpen, href: "/wiki" },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <footer className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            {/* Blurred background effect */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-brand-dark-2/80 backdrop-blur-lg border-t border-white/5" />

            <nav className="relative z-10 flex justify-around items-start pt-4 pb-6 text-gray-400">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center w-1/5 text-center text-xs transition-colors duration-300",
                                isActive ? "text-brand-teal" : "text-gray-400 hover:text-gray-200"
                            )}
                        >
                            <div className="relative mb-1">
                                <item.icon className={cn("w-6 h-6", isActive && "fill-current/20")} />
                                {isActive && (
                                    <div className="absolute -inset-2.5 bg-brand-teal/30 blur-lg rounded-full" />
                                )}
                            </div>
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Home indicator bar for iOS */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-gray-600/50 rounded-full" />
        </footer>
    );
}
