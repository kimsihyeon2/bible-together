"use client";

import { useState, useEffect } from "react";
import { Paper, Group, Text, Button, CloseButton, Stack } from "@mantine/core";
import { IconDownload, IconDeviceMobile } from "@tabler/icons-react";

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Check if user dismissed the prompt before
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (dismissed) {
            const dismissedTime = parseInt(dismissed);
            // Show again after 7 days
            if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
                return;
            }
        }

        // Listen for install prompt
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if app was installed
        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            setShowPrompt(false);
            setDeferredPrompt(null);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setIsInstalled(true);
        }

        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    };

    if (isInstalled || !showPrompt) return null;

    return (
        <Paper
            shadow="xl"
            p="md"
            radius="lg"
            style={{
                position: 'fixed',
                bottom: 80,
                left: 16,
                right: 16,
                zIndex: 1000,
                background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                color: 'white',
                border: 'none'
            }}
        >
            <Group justify="space-between" align="flex-start">
                <Group gap="md">
                    <IconDeviceMobile size={40} stroke={1.5} />
                    <Stack gap={4}>
                        <Text fw={700} size="md">앱으로 설치하기</Text>
                        <Text size="sm" opacity={0.9}>
                            홈 화면에 추가하여 더 빠르게 접속하세요
                        </Text>
                    </Stack>
                </Group>
                <CloseButton
                    onClick={handleDismiss}
                    variant="transparent"
                    c="white"
                />
            </Group>
            <Button
                onClick={handleInstall}
                fullWidth
                mt="md"
                leftSection={<IconDownload size={18} />}
                variant="white"
                color="dark"
                size="md"
                radius="xl"
            >
                지금 설치
            </Button>
        </Paper>
    );
}
