import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "./firebase";

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "";

let messaging: ReturnType<typeof getMessaging> | null = null;

function getMessagingInstance() {
    if (typeof window === "undefined") return null;
    if (!messaging) {
        try {
            messaging = getMessaging(app);
        } catch (err) {
            console.warn("FCM not available:", err);
            return null;
        }
    }
    return messaging;
}

/**
 * Request notification permission and return the FCM token.
 * Returns null if permission denied or not supported.
 */
export async function requestNotificationPermission(): Promise<string | null> {
    if (typeof window === "undefined" || !("Notification" in window)) return null;

    try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return null;

        const msg = getMessagingInstance();
        if (!msg) return null;

        const token = await getToken(msg, {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: await navigator.serviceWorker.register("/firebase-messaging-sw.js"),
        });
        return token || null;
    } catch (err) {
        console.warn("FCM token error:", err);
        return null;
    }
}

/**
 * Listen for foreground FCM messages.
 * Returns an unsubscribe function.
 */
export function onForegroundMessage(
    callback: (payload: { notification?: { title?: string; body?: string }; data?: any }) => void
): () => void {
    const msg = getMessagingInstance();
    if (!msg) return () => { };
    return onMessage(msg, callback);
}
