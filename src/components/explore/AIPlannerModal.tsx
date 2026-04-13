"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Sparkles, Calendar, Wallet, Map } from "lucide-react";
import { useState } from "react";

interface AIPlannerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AIPlannerModal({ isOpen, onClose }: AIPlannerModalProps) {
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<any>(null);

    if (!isOpen) return null;

    const handleGenerate = () => {
        setIsGenerating(true);
        // Mock AI delay
        setTimeout(() => {
            setIsGenerating(false);
            setResult({
                title: "7 Days in Spiti Valley",
                summary: "A perfect mix of adventure and culture. You'll visit ancient monasteries, high-altitude lakes, and remote villages.",
                itinerary: [
                    { day: 1, title: "Arrival in Manali", activity: "Acclimatize and explore Old Manali cafes." },
                    { day: 2, title: "Manali to Kaza", activity: "Drive through Atal Tunnel and Kunzum Pass." },
                    { day: 3, title: "Kaza Local Sightseeing", activity: "Key Monastery and Kibber Village." },
                ]
            });
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                    <div className="flex items-center gap-2 text-primary font-bold font-heading text-lg">
                        <Sparkles className="w-5 h-5" /> AI Trip Planner
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-muted rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    {!result ? (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Map className="w-4 h-4" /> Where do you want to start?
                                    </label>
                                    <Input placeholder="e.g. Delhi, Mumbai" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <Calendar className="w-4 h-4" /> Duration (Days)
                                        </label>
                                        <Input type="number" placeholder="7" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <Wallet className="w-4 h-4" /> Budget (₹)
                                        </label>
                                        <Input type="number" placeholder="15000" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Travel Vibe</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {["Relaxed", "Balanced", "Packed"].map((vibe) => (
                                            <button key={vibe} className="px-3 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 text-sm transition-all focus:ring-2 ring-primary">
                                                {vibe}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Button
                                className="w-full h-12 text-lg bg-gradient-to-r from-primary to-teal-600 hover:from-primary/90 hover:to-teal-700"
                                onClick={handleGenerate}
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <span className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 animate-spin" /> Planning your trip...
                                    </span>
                                ) : (
                                    "Generate Itinerary"
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4">
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800">
                                <h3 className="font-bold text-lg text-green-800 dark:text-green-300 mb-1">{result.title}</h3>
                                <p className="text-sm text-green-700 dark:text-green-400">{result.summary}</p>
                            </div>

                            <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-3.5 before:w-0.5 before:bg-border">
                                {result.itinerary.map((item: any, i: number) => (
                                    <div key={i} className="relative pl-10">
                                        <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold z-10">
                                            {item.day}
                                        </div>
                                        <div className="bg-muted/50 p-3 rounded-lg border border-border/50">
                                            <h4 className="font-bold text-sm">{item.title}</h4>
                                            <p className="text-xs text-muted-foreground">{item.activity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1" onClick={() => setResult(null)}>Edit</Button>
                                <Button className="flex-1">Save Itinerary</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
