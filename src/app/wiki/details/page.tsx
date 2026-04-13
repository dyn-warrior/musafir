"use client";

import WikiDetail from "@/features/wiki/WikiDetail";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function WikiContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id") || "";
    return <WikiDetail id={id} />;
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <WikiContent />
        </Suspense>
    );
}
