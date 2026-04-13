"use client";

import { useState, useRef } from "react";
import { X, ImagePlus, Video, Upload, Loader2, MapPin } from "lucide-react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage, db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPostCreated?: () => void;
}

export function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
    const { user } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [caption, setCaption] = useState("");
    const [location, setLocation] = useState("");
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
        if (!isVideo && !isImage) {
            toast.error("Please select an image or video file.");
            return;
        }
        if (file.size > 100 * 1024 * 1024) {
            toast.error("File must be under 100MB.");
            return;
        }

        setSelectedFile(file);
        setFileType(isVideo ? "video" : "image");
        setPreview(URL.createObjectURL(file));
    };

    const handlePost = async () => {
        if (!caption.trim() && !selectedFile) {
            toast.error("Please add a caption or media.");
            return;
        }

        setIsUploading(true);
        try {
            let mediaUrl: string | null = null;

            // Upload file to Firebase Storage if one is selected
            if (selectedFile) {
                const ext = selectedFile.name.split(".").pop();
                const fileName = `posts/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
                const storageRef = ref(storage, fileName);
                const uploadTask = uploadBytesResumable(storageRef, selectedFile);

                await new Promise<void>((resolve, reject) => {
                    uploadTask.on(
                        "state_changed",
                        (snap) => {
                            const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                            setUploadProgress(pct);
                        },
                        reject,
                        async () => {
                            mediaUrl = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve();
                        }
                    );
                });
            }

            // Save post to Firestore
            const userName = user?.displayName || "Nomadi User";
            const userAvatar = user?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop";

            await addDoc(collection(db, "posts"), {
                authorUid: user?.uid || null,
                user_name: userName,
                user_avatar: userAvatar,
                user_verified: false,
                caption: caption.trim(),
                location: location.trim() || "Somewhere beautiful",
                image: fileType === "image" ? mediaUrl : null,
                video: fileType === "video" ? mediaUrl : null,
                type: fileType === "video" ? "video" : fileType === "image" ? "photo" : "text",
                likes: 0,
                comments: 0,
                time: "Just now",
                createdAt: serverTimestamp(),
            });

            toast.success("Post shared! 🎉");
            onPostCreated?.();
            handleClose();
        } catch (err) {
            console.error("Post failed:", err);
            toast.error("Failed to post. Please try again.");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleClose = () => {
        setCaption("");
        setLocation("");
        setSelectedFile(null);
        setPreview(null);
        setFileType(null);
        setUploadProgress(0);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl border border-border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
                    <button onClick={handleClose} className="p-2 rounded-full hover:bg-muted transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                    <h2 className="font-heading font-bold text-lg">New Post</h2>
                    <button
                        onClick={handlePost}
                        disabled={isUploading || (!caption.trim() && !selectedFile)}
                        className="px-5 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isUploading ? "Posting..." : "Share"}
                    </button>
                </div>

                <div className="overflow-y-auto flex-1">
                    {/* User row */}
                    <div className="flex items-center gap-3 px-5 pt-4 pb-3">
                        <img
                            src={user?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"}
                            alt="You"
                            className="w-10 h-10 rounded-full object-cover border border-border"
                        />
                        <div>
                            <p className="font-semibold text-sm">{user?.displayName || "Nomadi User"}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-muted-foreground" />
                                <input
                                    className="text-xs text-muted-foreground bg-transparent outline-none placeholder:text-muted-foreground/60 w-40"
                                    placeholder="Add location..."
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Caption */}
                    <textarea
                        className="w-full px-5 pb-4 text-base bg-transparent outline-none resize-none placeholder:text-muted-foreground/60 min-h-[80px]"
                        placeholder="Share your travel story... 🌏"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        maxLength={500}
                        autoFocus
                    />

                    {/* Media preview */}
                    {preview && (
                        <div className="relative mx-5 mb-4 rounded-xl overflow-hidden border border-border bg-muted">
                            {fileType === "video" ? (
                                <video src={preview} controls className="w-full max-h-72 object-cover rounded-xl" />
                            ) : (
                                <img src={preview} alt="Preview" className="w-full max-h-72 object-cover rounded-xl" />
                            )}
                            <button
                                onClick={() => { setPreview(null); setSelectedFile(null); setFileType(null); }}
                                className="absolute top-2 right-2 bg-black/60 rounded-full p-1 hover:bg-black/80 transition-colors"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    )}

                    {/* Upload progress */}
                    {isUploading && uploadProgress > 0 && (
                        <div className="mx-5 mb-4">
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

                {/* Bottom toolbar */}
                <div className="px-5 py-4 border-t border-border flex items-center gap-4 flex-shrink-0">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <button
                        onClick={() => { if (fileInputRef.current) { fileInputRef.current.accept = "image/*"; fileInputRef.current.click(); } }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
                    >
                        <ImagePlus className="w-4 h-4 text-blue-500" />
                        <span className="text-muted-foreground">Photo</span>
                    </button>
                    <button
                        onClick={() => { if (fileInputRef.current) { fileInputRef.current.accept = "video/*"; fileInputRef.current.click(); } }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
                    >
                        <Video className="w-4 h-4 text-red-500" />
                        <span className="text-muted-foreground">Video</span>
                    </button>
                    <span className="ml-auto text-xs text-muted-foreground">{caption.length}/500</span>
                </div>
            </div>
        </div>
    );
}
