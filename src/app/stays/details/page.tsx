"use client";

import StayDetail from "@/features/stays/StayDetail";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function StayContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id") || "";
    return <StayDetail id={id} />;
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <StayContent />
        </Suspense>
    );
}
