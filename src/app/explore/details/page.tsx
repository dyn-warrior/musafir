"use client";

import DestinationDetail from "@/features/explore/DestinationDetail";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function DestinationContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id") || "";
    return <DestinationDetail id={id} />;
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DestinationContent />
        </Suspense>
    );
}
