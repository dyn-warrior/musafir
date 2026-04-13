// Firebase Messaging Service Worker
// This file MUST be at /public/firebase-messaging-sw.js

importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

// Firebase config — must match your .env.local values
firebase.initializeApp({
    apiKey: "AIzaSyBKq7OtG8x7acK1bj_0ElTPgzAUw3qHl5E",
    authDomain: "nomadicircle-8024a.firebaseapp.com",
    projectId: "nomadicircle-8024a",
    storageBucket: "nomadicircle-8024a.firebasestorage.app",
    messagingSenderId: "744171099630",
    appId: "1:744171099630:web:addec4d5b4b150612f2aff",
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log("[SW] Background message received:", payload);

    const title = payload.notification?.title || "New message in Nomadi Circle";
    const body = payload.notification?.body || "You have a new message";
    const icon = payload.notification?.icon || "/icon-192.png";

    self.registration.showNotification(title, {
        body,
        icon,
        badge: "/icon-192.png",
        data: payload.data,
        tag: "nomadi-message",
    });
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data?.url || "/community")
    );
});
