"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);

    const navItems = [
        { href: '/feed', label: 'Home' },
        { href: '/explore', label: 'Destinations' },
        { href: '/community', label: 'Community' },
        { href: '/go-out', label: 'Trips' },
        { href: '/wiki', label: 'Stories' },
    ];

    const handleSignOut = async () => {
        await signOut(auth);
        toast.success("Signed out successfully.");
        router.push("/login");
        setShowDropdown(false);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container flex h-20 max-w-7xl items-center justify-between px-8 mx-auto">
                <div className="flex items-center">
                    <Link className="flex items-center" href="/feed">
                        <span className="font-serif text-2xl font-bold text-gray-900 tracking-tight">
                            Musafir
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-4 md:gap-8">
                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "text-sm font-medium transition-colors",
                                        isActive ? "text-green-800" : "text-gray-500 hover:text-gray-800"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Profile / Auth */}
                    {loading ? (
                        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                    ) : user ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
                            >
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt={user.displayName || "Profile"}
                                        className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white text-xs font-bold">
                                        {(user.displayName || user.email || "U")[0].toUpperCase()}
                                    </div>
                                )}
                                <span className="max-w-[100px] truncate hidden md:block">{user.displayName?.split(" ")[0] || "Profile"}</span>
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                    <Link
                                        href="/profile/me"
                                        onClick={() => setShowDropdown(false)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <User className="w-4 h-4" />
                                        View Profile
                                    </Link>
                                    <button
                                        onClick={handleSignOut}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="px-4 py-1.5 md:py-2 md:px-4 bg-green-700 text-white text-xs md:text-sm font-semibold rounded-full hover:bg-green-800 transition-colors"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
