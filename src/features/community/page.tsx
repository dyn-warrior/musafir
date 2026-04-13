"use client";

import { ChatList } from "@/components/community/ChatList";
import { ChatWindow } from "@/components/community/ChatWindow";
import { DMWindow } from "@/components/community/DMWindow";
import { CreateGroupModal } from "@/components/community/CreateGroupModal";
import { BottomNav } from "@/components/layout/BottomNav";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

import { Suspense } from "react";

interface ActiveChat {
    id: string;
    type: "group" | "dm";
    meta?: { name: string; avatar: string; uid?: string };
}

function CommunityContent() {
    const searchParams = useSearchParams();
    const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Auto-open DM from URL params (e.g. after sending a join-trip request)
    useEffect(() => {
        const dm = searchParams.get("dm");
        const uname = searchParams.get("uname") || "User";
        const uavatar = searchParams.get("uavatar") || "";
        if (dm) {
            setActiveChat({ id: dm, type: "dm", meta: { name: uname, avatar: uavatar } });
        }
    }, [searchParams]);

    const handleSelectChat = (id: string, type: "group" | "dm" = "group", meta?: { name: string; avatar: string; uid?: string }) => {
        setActiveChat({ id, type, meta });
    };

    return (
        <div className="h-screen bg-background flex flex-col md:flex-row overflow-hidden pb-16 md:pb-0 md:pl-64">
            {/* Sidebar / List */}
            <div className={cn(
                "w-full md:w-80 lg:w-96 h-full flex-shrink-0 transition-transform duration-300 absolute md:relative z-10 bg-background",
                activeChat ? "-translate-x-full md:translate-x-0" : "translate-x-0"
            )}>
                <ChatList
                    activeChatId={activeChat?.id || ""}
                    onSelectChat={handleSelectChat}
                    onOpenCreateModal={() => setIsCreateModalOpen(true)}
                />
            </div>

            {/* Main Window */}
            <div className={cn(
                "flex-1 h-full w-full absolute md:relative transition-transform duration-300 bg-muted/30",
                activeChat ? "translate-x-0" : "translate-x-full md:translate-x-0"
            )}>
                {activeChat ? (
                    activeChat.type === "dm" ? (
                        <DMWindow
                            dmId={activeChat.id}
                            otherUserName={activeChat.meta?.name || "User"}
                            otherUserAvatar={activeChat.meta?.avatar || ""}
                            otherUserUid={activeChat.meta?.uid || ""}
                            onBack={() => setActiveChat(null)}
                        />
                    ) : (
                        <ChatWindow chatId={activeChat.id} onBack={() => setActiveChat(null)} />
                    )
                ) : (
                    <div className="hidden md:flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
                        <div className="w-64 h-64 bg-muted rounded-full mb-6 flex items-center justify-center opacity-50">
                            <img src="https://illustrations.popsy.co/amber/surr-message-sent.svg" alt="Select Chat" className="w-48 h-48 opacity-50" />
                        </div>
                        <h2 className="text-2xl font-heading font-bold mb-2">Select a chat to start messaging</h2>
                        <p>Join public groups, or search People to send a direct message.</p>
                    </div>
                )}
            </div>

            <CreateGroupModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreated={(groupId) => {
                    setIsCreateModalOpen(false);
                    setActiveChat({ id: groupId, type: "group" });
                }}
            />

            <BottomNav />
        </div>
    );
}

export default function CommunityPage() {
    return (
        <Suspense fallback={<div className="h-screen bg-background flex flex-col md:flex-row overflow-hidden pb-16 md:pb-0 md:pl-64 items-center justify-center">Loading chats...</div>}>
            <CommunityContent />
        </Suspense>
    );
}
