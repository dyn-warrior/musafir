"use client";

import { useRef, useState, useCallback } from "react";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { X, ImagePlus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedPhoto {
    url: string;
    storagePath: string;
    name: string;
}

interface TripPhotoUploaderProps {
    photos: UploadedPhoto[];
    onChange: (photos: UploadedPhoto[]) => void;
    folder?: string;
    maxPhotos?: number;
}

export function TripPhotoUploader({
    photos,
    onChange,
    folder = "trips",
    maxPhotos = 6,
}: TripPhotoUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState<{ name: string; progress: number }[]>([]);
    const [dragOver, setDragOver] = useState(false);

    const uploadFiles = useCallback(async (files: FileList | File[]) => {
        const fileArr = Array.from(files).filter(f => f.type.startsWith("image/"));
        const remaining = maxPhotos - photos.length;
        const toUpload = fileArr.slice(0, remaining);
        if (toUpload.length === 0) return;

        setUploading(toUpload.map(f => ({ name: f.name, progress: 0 })));
        const results: UploadedPhoto[] = [];

        await Promise.all(toUpload.map((file, i) =>
            new Promise<void>((resolve) => {
                const storagePath = `${folder}/${Date.now()}_${i}_${file.name.replace(/\s+/g, "_")}`;
                const storageRef = ref(storage, storagePath);
                const task = uploadBytesResumable(storageRef, file);
                task.on("state_changed",
                    (snap) => {
                        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                        setUploading(prev => prev.map((u, idx) => idx === i ? { ...u, progress: pct } : u));
                    },
                    (err) => { console.error("Upload error:", err); resolve(); },
                    async () => {
                        const url = await getDownloadURL(task.snapshot.ref);
                        results.push({ url, storagePath, name: file.name });
                        resolve();
                    }
                );
            })
        ));

        setUploading([]);
        onChange([...photos, ...results]);
    }, [photos, onChange, maxPhotos, folder]);

    const removePhoto = async (photo: UploadedPhoto) => {
        try { await deleteObject(ref(storage, photo.storagePath)); } catch { }
        onChange(photos.filter(p => p.storagePath !== photo.storagePath));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        uploadFiles(e.dataTransfer.files);
    };

    return (
        <div className="space-y-3">
            {photos.length < maxPhotos && (
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={cn(
                        "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors",
                        dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
                    )}
                >
                    <ImagePlus className="w-7 h-7 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Click to upload or drag & drop</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Images up to 20MB · {maxPhotos - photos.length} remaining
                    </p>
                    <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
                        onChange={(e) => e.target.files && uploadFiles(e.target.files)} />
                </div>
            )}

            {uploading.length > 0 && (
                <div className="space-y-2">
                    {uploading.map((u, i) => (
                        <div key={i} className="bg-muted rounded-lg p-3 space-y-1.5">
                            <div className="flex justify-between text-xs">
                                <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> {u.name}</span>
                                <span className="text-muted-foreground">{u.progress}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-border overflow-hidden">
                                <div className="h-full bg-primary transition-all rounded-full" style={{ width: `${u.progress}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                    {photos.map((photo, i) => (
                        <div key={photo.storagePath} className="relative group aspect-video rounded-lg overflow-hidden border border-border">
                            <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                            {i === 0 && (
                                <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">
                                    Cover
                                </div>
                            )}
                            <button type="button" onClick={() => removePhoto(photo)}
                                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
