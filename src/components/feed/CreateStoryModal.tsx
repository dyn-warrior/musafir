"use client";

import { useState, useRef } from "react";
import { X, ImagePlus, Video, Loader2, Type } from "lucide-react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface CreateStoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStoryCreated?: () => void;
}

export function CreateStoryModal({ isOpen, onClose, onStoryCreated }: CreateStoryModalProps) {
    const { user } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [caption, setCaption] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [fileType, setFileType] = useState<"image" | "video" | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const isVideo = file.type.startsWith("video/");
        const isImage = file.type.startsWith("image/");
        if (!isVideo && !isImage) return toast.error("Please select an image or video.");
        if (file.size > 100 * 1024 * 1024) return toast.error("File must be under 100MB.");
        setSelectedFile(file);
        setFileType(isVideo ? "video" : "image");
        setPreview(URL.createObjectURL(file));
    };

    const handlePost = async () => {
        if (!selectedFile) return toast.error("Please select an image or video for your story.");
        if (!user) return toast.error("You must be logged in to post a story.");

        setIsUploading(true);
        try {
            // Upload to Firebase Storage
            const ext = selectedFile.name.split(".").pop();
            const fileName = `stories/${Date.now()}_${user.uid}.${ext}`;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, selectedFile);

            let mediaUrl = "";
            await new Promise<void>((resolve, reject) => {
                uploadTask.on(
                    "state_changed",
                    (snap) => setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
                    reject,
                    async () => {
                        mediaUrl = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve();
                    }
                );
            });

            // Save to Firestore with 24h expiry
            const { addStory } = await import("@/lib/firestore");
            await addStory({
                name: user.displayName || "Nomadi User",
                image: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "U")}&background=14532d&color=fff`,
                mediaUrl,
                mediaType: fileType!,
                caption: caption.trim(),
                authorUid: user.uid,
            });

            toast.success("Story posted! It'll be live for 24 hours. 🌟");
            onStoryCreated?.();
            handleClose();
        } catch (err) {
            console.error("Story upload failed:", err);
            toast.error("Failed to post story. Please try again.");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleClose = () => {
        setCaption("");
        setSelectedFile(null);
        setPreview(null);
        setFileType(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl border border-border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <button onClick={handleClose} className="p-2 rounded-full hover:bg-muted transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="text-center">
                        <h2 className="font-heading font-bold text-base">New Story</h2>
                        <p className="text-xs text-muted-foreground">Visible for 24 hours</p>
                    </div>
                    <button
                        onClick={handlePost}
                        disabled={isUploading || !selectedFile}
                        className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isUploading ? "Posting..." : "Share"}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {/* Preview */}
                    {preview ? (
                        <div className="relative rounded-2xl overflow-hidden bg-muted aspect-[9/16] max-h-72 w-full">
                            {fileType === "video" ? (
                                <video src={preview} controls className="w-full h-full object-cover" />
                            ) : (
                                <img src={preview} alt="Story preview" className="w-full h-full object-cover" />
                            )}
                            {/* Caption overlay */}
                            {caption && (
                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                                    <p className="text-white text-sm text-center font-medium">{caption}</p>
                                </div>
                            )}
                            <button
                                onClick={() => { setPreview(null); setSelectedFile(null); setFileType(null); }}
                                className="absolute top-2 right-2 bg-black/60 rounded-full p-1"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full aspect-[9/16] max-h-72 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-colors"
                        >
                            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                                <ImagePlus className="w-7 h-7 text-muted-foreground" />
                            </div>
                            <div className="text-center">
                                <p className="font-medium text-sm">Tap to add photo or video</p>
                                <p className="text-xs text-muted-foreground mt-1">Max 100MB · Disappears in 24h</p>
                            </div>
                        </button>
                    )}

                    {/* Caption input */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                        <Type className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <input
                            className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground/60"
                            placeholder="Add a caption..."
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            maxLength={150}
                        />
                        <span className="text-xs text-muted-foreground">{caption.length}/150</span>
                    </div>

                    {/* Upload progress */}
                    {isUploading && (
                        <div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-300 rounded-full"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 text-center">{uploadProgress}% uploaded</p>
                        </div>
                    )}
                </div>

                {/* Bottom media buttons */}
                <div className="px-5 py-4 border-t border-border flex gap-3">
                    <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
                    <button
                        onClick={() => { if (fileInputRef.current) { fileInputRef.current.accept = "image/*"; fileInputRef.current.click(); } }}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
                    >
                        <ImagePlus className="w-4 h-4 text-blue-500" /> Photo
                    </button>
                    <button
                        onClick={() => { if (fileInputRef.current) { fileInputRef.current.accept = "video/*"; fileInputRef.current.click(); } }}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
                    >
                        <Video className="w-4 h-4 text-red-500" /> Video
                    </button>
                </div>
            </div>
        </div>
    );
}
