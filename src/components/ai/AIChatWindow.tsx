"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Sparkles, Map, Calendar, Home, Compass } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface AIChatWindowProps {
    onClose: () => void;
}

interface Message {
    id: number;
    text: string;
    sender: "ai" | "user";
    streaming?: boolean;
}

type GeminiPart = { text: string };
type GeminiHistory = { role: "user" | "model"; parts: GeminiPart[] }[];

const QUICK_ACTIONS = [
    { label: "Plan a Trip", icon: Map, prompt: "Help me plan a 5-day trip itinerary to a popular Indian destination." },
    { label: "Find Stays", icon: Home, prompt: "What are the best budget hostels and homestays for backpackers in India?" },
    { label: "Festivals", icon: Calendar, prompt: "What are some must-attend travel and cultural festivals in India?" },
    { label: "Hidden Gems", icon: Compass, prompt: "Tell me about some offbeat hidden gem destinations in India most tourists miss." },
];

/** Minimal markdown → plain text renderer for the chat bubbles */
function renderMarkdown(text: string): string {
    return text
        .replace(/\*\*(.+?)\*\*/g, "$1")   // bold → plain
        .replace(/\*(.+?)\*/g, "$1")         // italic → plain
        .replace(/#{1,3} (.+)/g, "$1")       // headings → plain
        .replace(/`(.+?)`/g, "$1")           // inline code → plain
        .trim();
}

export function AIChatWindow({ onClose }: AIChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hi! I'm Nomadi AI 🌍 — your travel companion. Ask me anything about trips, treks, stays, or hidden gems!", sender: "ai" }
    ]);
    const [inputText, setInputText] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Keep Gemini chat history in sync
    const geminiHistory = useRef<GeminiHistory>([]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isStreaming]);

    const handleSend = useCallback(async (text?: string) => {
        const userText = (text || inputText).trim();
        if (!userText || isStreaming) return;

        const userMsg: Message = { id: Date.now(), text: userText, sender: "user" };
        setMessages(prev => [...prev, userMsg]);
        setInputText("");
        setIsStreaming(true);

        // Add a streaming placeholder
        const aiMsgId = Date.now() + 1;
        setMessages(prev => [...prev, { id: aiMsgId, text: "", sender: "ai", streaming: true }]);

        try {
            const { streamNomAdi } = await import("@/lib/gemini");
            let fullText = "";

            for await (const chunk of streamNomAdi(userText, geminiHistory.current)) {
                fullText += chunk;
                const rendered = renderMarkdown(fullText);
                setMessages(prev =>
                    prev.map(m => m.id === aiMsgId ? { ...m, text: rendered } : m)
                );
            }

            // Finalise: remove 'streaming' flag and update history
            setMessages(prev =>
                prev.map(m => m.id === aiMsgId ? { ...m, streaming: false } : m)
            );
            geminiHistory.current = [
                ...geminiHistory.current,
                { role: "user", parts: [{ text: userText }] },
                { role: "model", parts: [{ text: fullText }] },
            ];
        } catch (err: any) {
            console.error("[NomAdi AI] Error:", err);
            const msg = err?.message || String(err);
            const errText = msg.includes("API key")
                ? "⚠️ API key not configured."
                : msg.includes("403") || msg.includes("PERMISSION_DENIED")
                    ? `⚠️ Access denied (403). Check AI Studio key permissions.`
                    : msg.includes("404") || msg.includes("not found")
                        ? "⚠️ Model not available for this key. Try another region at aistudio.google.com."
                        : "⚠️ Couldn't reach Nomadi AI. Check your connection and try again.";

            setMessages(prev =>
                prev.map(m => m.id === aiMsgId ? { ...m, text: errText, streaming: false } : m)
            );
        } finally {
            setIsStreaming(false);
        }
    }, [inputText, isStreaming]);

    return (
        <div className="fixed bottom-24 right-4 md:right-8 w-[90vw] md:w-96 h-[520px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-primary to-teal-500 text-white flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2 font-bold">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-sm font-bold leading-tight">Nomadi AI</p>
                        <p className="text-[10px] opacity-75">Powered by Gemini</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-muted/20" ref={scrollRef}>
                {messages.map((msg) => (
                    <div key={msg.id} className={cn("flex gap-2 max-w-[88%]", msg.sender === "user" ? "ml-auto flex-row-reverse" : "")}>
                        {msg.sender === "ai" && (
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                                <Sparkles className="w-3.5 h-3.5 text-white" />
                            </div>
                        )}
                        <div className={cn(
                            "p-3 rounded-2xl text-sm shadow-sm leading-relaxed",
                            msg.sender === "user"
                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                : "bg-background border border-border/50 rounded-tl-none"
                        )}>
                            {msg.text || (msg.streaming && (
                                <span className="flex gap-1 items-center h-4">
                                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                </span>
                            ))}
                            {msg.streaming && msg.text && <span className="inline-block w-0.5 h-4 bg-primary/60 animate-pulse ml-0.5 align-middle" />}
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="px-3 py-2 bg-background border-t border-border/50 flex gap-1.5 overflow-x-auto scrollbar-hide flex-shrink-0">
                {QUICK_ACTIONS.map((action) => (
                    <button
                        key={action.label}
                        onClick={() => handleSend(action.prompt)}
                        disabled={isStreaming}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-muted hover:bg-primary/10 hover:text-primary rounded-full text-[11px] font-medium whitespace-nowrap transition-colors disabled:opacity-50"
                    >
                        <action.icon className="w-3 h-3 flex-shrink-0" /> {action.label}
                    </button>
                ))}
            </div>

            {/* Input */}
            <div className="p-3 bg-background border-t border-border/50 flex gap-2 flex-shrink-0">
                <Input
                    placeholder="Ask anything about travel..."
                    className="flex-1 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary text-sm"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                    disabled={isStreaming}
                />
                <Button
                    size="icon"
                    onClick={() => handleSend()}
                    disabled={!inputText.trim() || isStreaming}
                    className="bg-gradient-to-r from-primary to-teal-500 hover:opacity-90 transition-opacity"
                >
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
