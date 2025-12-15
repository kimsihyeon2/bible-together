"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            // Register service worker
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('[App] Service Worker registered:', registration.scope);

                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        if (newWorker) {
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    // New content available
                                    console.log('[App] New content available; please refresh.');
                                }
                            });
                        }
                    });
                })
                .catch((error) => {
                    console.error('[App] Service Worker registration failed:', error);
                });

            // Request notification permission
            if ('Notification' in window) {
                Notification.requestPermission().then((permission) => {
                    console.log('[App] Notification permission:', permission);
                });
            }
        }
    }, []);

    return null;
}
