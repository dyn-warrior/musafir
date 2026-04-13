"use client";

import { Button } from "@/components/ui/button";
import { Plus, Camera } from "lucide-react";
import { useCamera } from "@/hooks/useCamera";

export function CreatePostButton() {
    const { takePhoto, photo } = useCamera();

    const handleClick = async () => {
        await takePhoto();
        if (photo) {
            // In a real app, this would open a modal with the photo
            console.log("Photo taken:", photo);
            alert("Photo captured! (Check console for data URL)");
        }
    };

    return (
        <Button
            className="fixed bottom-20 right-4 md:bottom-8 md:right-8 rounded-full w-14 h-14 shadow-lg z-50 bg-secondary hover:bg-secondary/90"
            size="icon"
            onClick={handleClick}
        >
            <Plus className="w-8 h-8 text-white" />
        </Button>
    );
}
