"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, CheckCircle, Calendar, Users, CreditCard } from "lucide-react";
import { useState } from "react";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    stayName: string;
    pricePerNight: number;
}

export function BookingModal({ isOpen, onClose, stayName, pricePerNight }: BookingModalProps) {
    const [step, setStep] = useState<"details" | "payment" | "success">("details");
    const [guests, setGuests] = useState(1);
    const [nights, setNights] = useState(3);

    if (!isOpen) return null;

    const totalCost = pricePerNight * nights * guests;

    const handlePayment = () => {
        // Mock payment processing
        setTimeout(() => {
            setStep("success");
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                    <h3 className="font-bold text-lg">
                        {step === "success" ? "Booking Confirmed" : "Complete Booking"}
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-muted rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    {step === "details" && (
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-heading font-bold text-xl text-primary">{stayName}</h4>
                                <p className="text-sm text-muted-foreground">Entire property • {nights} nights</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Calendar className="w-4 h-4" /> Nights
                                    </label>
                                    <Input type="number" min={1} value={nights} onChange={(e) => setNights(Number(e.target.value))} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Users className="w-4 h-4" /> Guests
                                    </label>
                                    <Input type="number" min={1} value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
                                </div>
                            </div>

                            <div className="bg-muted/50 p-4 rounded-xl space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>₹{pricePerNight} x {nights} nights</span>
                                    <span>₹{pricePerNight * nights}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Service Fee</span>
                                    <span>₹500</span>
                                </div>
                                <div className="border-t border-border/50 pt-2 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>₹{totalCost + 500}</span>
                                </div>
                            </div>

                            <Button className="w-full h-12 text-lg" onClick={() => setStep("payment")}>
                                Proceed to Pay
                            </Button>
                        </div>
                    )}

                    {step === "payment" && (
                        <div className="space-y-6">
                            <div className="p-4 border border-primary/20 bg-primary/5 rounded-xl text-center">
                                <p className="text-sm text-muted-foreground">Amount to Pay</p>
                                <p className="text-3xl font-bold text-primary">₹{totalCost + 500}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Card Number</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input className="pl-9" placeholder="0000 0000 0000 0000" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Expiry</label>
                                        <Input placeholder="MM/YY" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">CVC</label>
                                        <Input placeholder="123" />
                                    </div>
                                </div>
                            </div>

                            <Button className="w-full h-12 text-lg" onClick={handlePayment}>
                                Pay Now
                            </Button>
                            <Button variant="ghost" className="w-full" onClick={() => setStep("details")}>
                                Back
                            </Button>
                        </div>
                    )}

                    {step === "success" && (
                        <div className="text-center space-y-6 py-8 animate-in zoom-in-95 duration-300">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-green-700">Booking Confirmed!</h3>
                                <p className="text-muted-foreground mt-2">You're all set for your trip to {stayName}.</p>
                            </div>
                            <Button className="w-full" onClick={onClose}>Done</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
