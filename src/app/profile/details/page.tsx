"use client";

import ProfileDetail from "@/features/profile/ProfileDetail";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ProfileContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id") || "";
    return <ProfileDetail id={id} />;
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProfileContent />
        </Suspense>
    );
}
