"use client";

import { useEffect, useState } from "react";
import { Button, Dialog, Text, Group } from "@mantine/core";
import { useBibleStore } from "@/store/use-bible-store";

function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function NotificationManager() {
    const { me } = useBibleStore();
    const [showPrompt, setShowPrompt] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        // Check if SW is supported and Push is supported
        if ("serviceWorker" in navigator && "PushManager" in window) {
            navigator.serviceWorker.ready.then((registration) => {
                registration.pushManager.getSubscription().then((subscription) => {
                    if (subscription) {
                        setIsSubscribed(true);
                    } else {
                        // Ask for permission if not denied
                        if (Notification.permission === "default") {
                            // Wait a bit before showing prompt so it's not annoying on load
                            setTimeout(() => setShowPrompt(true), 3000);
                        }
                    }
                });
            });
        }
    }, []);

    const subscribeUser = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

            if (!vapidKey) {
                console.warn("VAPID key not found");
                return;
            }

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidKey),
            });

            // Send subscription to backend
            await fetch("/api/push/subscribe", {
                method: "POST",
                body: JSON.stringify({
                    subscription,
                    userId: me?.id, // Linked to current user
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            setIsSubscribed(true);
            setShowPrompt(false);
            console.log("Subscribed to push notifications!");
        } catch (err) {
            console.error("Failed to subscribe", err);
        }
    };

    return (
        <Dialog
            opened={showPrompt}
            withCloseButton
            onClose={() => setShowPrompt(false)}
            size="lg"
            radius="md"
            shadow="xl"
            position={{ bottom: 80, right: 20 }}
        >
            <Text size="sm" mb="xs" fw={500}>
                긴급 기도와 공지사항 알림을 받으시겠습니까?
            </Text>
            <Group align="flex-end">
                <Button onClick={subscribeUser} size="xs" color="blue">
                    알림 받기
                </Button>
            </Group>
        </Dialog>
    );
}
