"use client";

import FestivalDetail from "@/features/festivals/FestivalDetail";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function FestivalContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id") || "";
    return <FestivalDetail id={id} />;
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FestivalContent />
        </Suspense>
    );
}
