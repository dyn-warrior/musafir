"use client";

import ClientProfile from "./ProfileClient";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ProfileContent() {
    const searchParams = useSearchParams();
    const uid = searchParams.get("uid") || "";
    return <ClientProfile uid={uid} />;
}

export default function Page() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <ProfileContent />
        </Suspense>
    );
}
