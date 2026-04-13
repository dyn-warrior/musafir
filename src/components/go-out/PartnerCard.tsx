"use client";

import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { useState } from "react";
import { JoinTripModal } from "@/components/go-out/JoinTripModal";

interface PartnerCardProps {
    request: {
        id: string;
        authorUid?: string;      // UID of the person who posted the trip
        user: {
            name: string;
            image: string;
            age: number;
        };
        trip: {
            title: string;
            destination: string;
            date: string;
            type: string;
            budget: string;
        };
        description: string;
    };
}

export function PartnerCard({ request }: PartnerCardProps) {
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [sent, setSent] = useState(false);

    return (
        <>
            <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden hover:shadow-md transition-all">
                <div className="p-4">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img
                                src={request.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(request.user?.name || "U")}&background=random`}
                                alt={request.user?.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm">{request.user?.name}</h3>
                            <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
                                {request.trip?.type}
                            </span>
                        </div>
                    </div>

                    {/* Trip Info */}
                    <h4 className="font-heading font-bold text-lg mb-2">{request.trip?.title || "Untitled Trip"}</h4>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{request.description}</p>

                    <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" /> {request.trip?.destination}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" /> {request.trip?.date}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="w-4 h-4" /> Budget: {request.trip?.budget}
                        </div>
                    </div>

                    {/* Action */}
                    <Button
                        className={`w-full ${sent ? "bg-muted text-muted-foreground hover:bg-muted" : ""}`}
                        onClick={() => request.trip && setShowJoinModal(true)}
                        disabled={sent || !request.trip || !request.authorUid}
                        title={!request.authorUid ? "Contact info unavailable — poster needs to re-post" : undefined}
                    >
                        {sent ? "Request Sent ✓" : !request.authorUid ? "Contact Unavailable" : "Join Trip"}
                        {!sent && request.authorUid && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                </div>
            </div>

            {request.trip && (
                <JoinTripModal
                    isOpen={showJoinModal}
                    onClose={() => setShowJoinModal(false)}
                    trip={request.trip}
                    posterUid={request.authorUid || ""}
                    posterName={request.user?.name || "Unknown"}
                    posterAvatar={request.user?.image || ""}
                />
            )}
        </>
    );
}
