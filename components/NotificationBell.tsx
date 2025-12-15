"use client";

import { useState, useEffect } from "react";
import { ActionIcon, Indicator, Popover, Stack, Text, Paper, Badge, Group, ScrollArea, Button } from "@mantine/core";
import { IconBell, IconBellRinging } from "@tabler/icons-react";
import { useBibleStore } from "@/store/use-bible-store";
import { Notification } from "@/types";

export function NotificationBell() {
    const { me } = useBibleStore();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [opened, setOpened] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Fetch notifications
    const fetchNotifications = async () => {
        if (!me) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/notifications?userId=${me.id}&role=${me.role}`);
            const data = await res.json();
            setNotifications(data.notifications || []);
        } catch (e) {
            console.error("Failed to fetch notifications", e);
        } finally {
            setLoading(false);
        }
    };

    // Fetch on mount and when opened
    useEffect(() => {
        if (me) {
            fetchNotifications();
            // Poll every 30 seconds for new notifications
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [me]);

    useEffect(() => {
        if (opened && me) {
            fetchNotifications();
        }
    }, [opened]);

    // Mark notification as read
    const markAsRead = async (notificationId: string) => {
        if (!me) return;
        try {
            await fetch("/api/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notificationId, userId: me.id })
            });
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
            );
        } catch (e) {
            console.error("Failed to mark as read", e);
        }
    };

    if (!me) return null;

    return (
        <Popover
            opened={opened}
            onChange={setOpened}
            width={320}
            position="bottom-end"
            shadow="lg"
        >
            <Popover.Target>
                <div onClick={() => setOpened(o => !o)} style={{ cursor: 'pointer' }}>
                    <Indicator
                        disabled={unreadCount === 0}
                        label={unreadCount > 9 ? "9+" : unreadCount}
                        size={18}
                        color="red"
                        processing={unreadCount > 0}
                    >
                        <ActionIcon
                            variant="light"
                            size="lg"
                            radius="xl"
                            color={unreadCount > 0 ? "orange" : "gray"}
                        >
                            {unreadCount > 0 ? <IconBellRinging size={20} /> : <IconBell size={20} />}
                        </ActionIcon>
                    </Indicator>
                </div>
            </Popover.Target>

            <Popover.Dropdown p={0}>
                <Paper p="sm" bg="var(--mantine-color-blue-light)">
                    <Group justify="space-between">
                        <Text fw={700} size="sm">🙏 기도 알림</Text>
                        <Badge size="sm" variant="light" color={unreadCount > 0 ? "red" : "gray"}>
                            {unreadCount}개 안읽음
                        </Badge>
                    </Group>
                </Paper>

                <ScrollArea h={300}>
                    {notifications.length === 0 ? (
                        <Text c="dimmed" ta="center" py="xl" size="sm">
                            알림이 없습니다
                        </Text>
                    ) : (
                        <Stack gap={0}>
                            {notifications.map((notif) => (
                                <Paper
                                    key={notif.id}
                                    p="sm"
                                    bg={notif.read ? "transparent" : "var(--mantine-color-yellow-0)"}
                                    onClick={() => markAsRead(notif.id)}
                                    style={{
                                        cursor: "pointer",
                                        borderBottom: "1px solid var(--mantine-color-gray-2)"
                                    }}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <Group justify="space-between" mb={4}>
                                        <Text size="sm" fw={700}>{notif.title}</Text>
                                        {notif.target === "LEADER" && (
                                            <Badge size="xs" color="blue">리더</Badge>
                                        )}
                                    </Group>
                                    <Text size="sm" c="dimmed" lineClamp={2}>
                                        {notif.body}
                                    </Text>
                                    <Text size="xs" c="dimmed" mt={4}>
                                        {new Date(notif.createdAt).toLocaleString("ko-KR")}
                                    </Text>
                                </Paper>
                            ))}
                        </Stack>
                    )}
                </ScrollArea>

                <Paper p="xs" bg="var(--mantine-color-gray-0)">
                    <Button
                        variant="subtle"
                        size="xs"
                        fullWidth
                        onClick={fetchNotifications}
                        loading={loading}
                    >
                        새로고침
                    </Button>
                </Paper>
            </Popover.Dropdown>
        </Popover>
    );
}
