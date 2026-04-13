import { Sparkles } from "lucide-react";

interface AISummaryProps {
    summary: string;
}

export function AISummary({ summary }: AISummaryProps) {
    return (
        <div className="bg-gradient-to-br from-primary/5 to-teal-500/5 border border-primary/20 rounded-xl p-6 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-24 h-24 text-primary" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3 text-primary font-bold font-heading">
                    <Sparkles className="w-5 h-5" />
                    <h3>AI Quick Summary</h3>
                </div>
                <p className="text-foreground/80 leading-relaxed">
                    {summary}
                </p>
            </div>
        </div>
    );
}
