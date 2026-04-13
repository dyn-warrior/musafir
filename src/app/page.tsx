"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Splash() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Add a small delay for the splash aesthetic to show before routing
      const timer = setTimeout(() => {
        if (user) {
          router.push("/feed");
        } else {
          router.push("/login");
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-brand-dark-1 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary to-teal-900">
      {/* Splash graphics */}
      <div className="animate-pulse">
        <img src="/icon.png" alt="Musafir Logo" className="w-32 h-32 mb-6 shadow-2xl rounded-full border-4 border-white/20" />
      </div>
      <h1 className="text-4xl font-serif font-bold text-white tracking-tight animate-bounce">
        Musafir
      </h1>
      <p className="text-teal-100 mt-2 text-sm font-medium tracking-wide">
        Discover the unseen
      </p>
      <div className="absolute bottom-12 left-0 right-0 flex justify-center">
        <div className="w-8 h-8 border-4 border-t-white border-white/20 rounded-full animate-spin" />
      </div>
    </div>
  );
}
