"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { AIChatWindow } from "./AIChatWindow";
import { cn } from "@/lib/utils";

export function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end gap-4">
                {isOpen && <AIChatWindow onClose={() => setIsOpen(false)} />}

                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "rounded-full w-14 h-14 shadow-xl transition-all duration-300 hover:scale-110",
                        isOpen ? "bg-red-500 hover:bg-red-600 rotate-45" : "bg-gradient-to-r from-primary to-teal-500 hover:from-primary/90 hover:to-teal-600"
                    )}
                    size="icon"
                >
                    {isOpen ? (
                        <span className="text-2xl font-bold text-white">+</span>
                    ) : (
                        <Sparkles className="w-7 h-7 text-white animate-pulse" />
                    )}
                </Button>
            </div>
        </>
    );
}
