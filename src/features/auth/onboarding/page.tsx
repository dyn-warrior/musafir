"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, MapPin, Mountain, Tent, Plane, Coffee, Camera } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const INTERESTS = [
    { id: "trekking", label: "Trekking", icon: Mountain },
    { id: "camping", label: "Camping", icon: Tent },
    { id: "culture", label: "Culture", icon: MapPin },
    { id: "food", label: "Food", icon: Coffee },
    { id: "photography", label: "Photography", icon: Camera },
    { id: "backpacking", label: "Backpacking", icon: Plane },
];

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const toggleInterest = (id: string) => {
        setSelectedInterests((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    return (
        <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-card rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row min-h-[500px]">

                {/* Sidebar / Progress */}
                <div className="w-full md:w-1/3 bg-primary p-8 text-primary-foreground flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-heading font-bold mb-2">Setup Profile</h2>
                        <p className="text-primary-foreground/80 text-sm">Let's personalize your experience.</p>
                    </div>

                    <div className="space-y-4 mt-8 md:mt-0">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center gap-3">
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors",
                                    step >= s ? "bg-white text-primary border-white" : "border-white/40 text-white/40"
                                )}>
                                    {step > s ? <Check className="w-4 h-4" /> : s}
                                </div>
                                <span className={cn(
                                    "text-sm font-medium",
                                    step >= s ? "text-white" : "text-white/40"
                                )}>
                                    {s === 1 ? "Basic Info" : s === 2 ? "Interests" : "Budget"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Area */}
                <div className="w-full md:w-2/3 p-8 flex flex-col">
                    <div className="flex-1">
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                <h3 className="text-2xl font-heading font-bold">Tell us about yourself</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Bio</label>
                                        <textarea
                                            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            placeholder="I'm a digital nomad who loves..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Age</label>
                                            <Input type="number" placeholder="25" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Gender</label>
                                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                                <option>Select</option>
                                                <option>Male</option>
                                                <option>Female</option>
                                                <option>Non-binary</option>
                                                <option>Prefer not to say</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                <h3 className="text-2xl font-heading font-bold">What do you love?</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {INTERESTS.map((interest) => (
                                        <button
                                            key={interest.id}
                                            onClick={() => toggleInterest(interest.id)}
                                            className={cn(
                                                "flex items-center gap-2 p-3 rounded-xl border transition-all text-left",
                                                selectedInterests.includes(interest.id)
                                                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                                                    : "border-border hover:border-primary/50"
                                            )}
                                        >
                                            <interest.icon className={cn(
                                                "w-5 h-5",
                                                selectedInterests.includes(interest.id) ? "text-primary" : "text-muted-foreground"
                                            )} />
                                            <span className="font-medium text-sm">{interest.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                <h3 className="text-2xl font-heading font-bold">Travel Style</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Typical Budget (per day)</label>
                                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                            <option>₹0 - ₹2000 (Backpacker)</option>
                                            <option>₹2000 - ₹5000 (Mid-range)</option>
                                            <option>₹5000+ (Luxury)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Dream Destination</label>
                                        <Input placeholder="e.g. Spiti Valley" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between mt-8 pt-4 border-t">
                        {step > 1 ? (
                            <Button variant="ghost" onClick={() => setStep(s => s - 1)}>Back</Button>
                        ) : (
                            <div />
                        )}

                        {step < 3 ? (
                            <Button onClick={() => setStep(s => s + 1)}>
                                Next <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button className="bg-green-600 hover:bg-green-700" asChild>
                                <Link href="/profile/me">Complete Setup</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
