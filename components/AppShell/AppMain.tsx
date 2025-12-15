"use client";

import { AppShell, Burger, Group, Text, UnstyledButton, useMantineColorScheme, ActionIcon, Container, Button, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconHome, IconBook, IconUser, IconSun, IconMoon, IconFriends, IconLogout } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { useBibleStore } from "@/store/use-bible-store";
import { useEffect, useState } from "react";
import { NotificationBell } from "@/components/NotificationBell";

export function AppMain({ children }: { children: React.ReactNode }) {
    const [opened, { toggle }] = useDisclosure();
    const pathname = usePathname();
    const router = useRouter();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const { me, logout } = useBibleStore();
    const [activeTab, setActiveTab] = useState("home");

    // Determine active tab based on path
    useEffect(() => {
        if (pathname?.startsWith("/cells") && pathname.length > 7) {
            setActiveTab("reading");
        } else if (pathname === "/cells") {
            setActiveTab("home");
        } else if (pathname === "/admin") {
            setActiveTab("admin");
        }
    }, [pathname]);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const navItems = [
        { label: "홈", icon: IconHome, id: "home", path: "/cells" },
        { label: "Community", icon: IconFriends, id: "community", path: "/cells" }, // Placeholder
        { label: "Admin", icon: IconUser, id: "admin", path: "/admin", show: me?.role === "PASTOR" },
    ];

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: "sm",
                collapsed: { mobile: !opened, desktop: true }, // Sidebar hidden on desktop too for mobile-first feel? Or show it? Let's hide for now to focus on bottom nav feel.
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        <Text fw={700} size="lg" variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 90 }}>
                            Bible Together
                        </Text>
                    </Group>
                    <Group gap="xs">
                        {me && (
                            <>
                                <Text size="sm" c="dimmed" visibleFrom="sm">{me.name}님</Text>
                                <NotificationBell />
                                <ActionIcon onClick={handleLogout} variant="light" size="lg" radius="xl" color="red" title="로그아웃">
                                    <IconLogout size={18} />
                                </ActionIcon>
                            </>
                        )}
                        <ActionIcon onClick={() => toggleColorScheme()} variant="default" size="lg" radius="xl">
                            <IconSun size={18} className="light-hidden" />
                            <IconMoon size={18} className="dark-hidden" />
                        </ActionIcon>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                {/* Mobile Drawer Content */}
                <Text>Menu</Text>
            </AppShell.Navbar>

            <AppShell.Main pb={80}> {/* Padding bottom for fixed footer */}
                <Container size="sm" p={0}>
                    {children}
                </Container>
            </AppShell.Main>

            {/* Bottom Navigation (Mobile First) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 h-[65px] z-50 flex justify-around items-center px-2 pb-safe">
                {navItems.filter(i => i.show !== false).map((item) => (
                    <UnstyledButton
                        key={item.id}
                        onClick={() => {
                            setActiveTab(item.id);
                            router.push(item.path);
                        }}
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeTab === item.id
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            }`}
                    >
                        <item.icon size={22} stroke={activeTab === item.id ? 2.5 : 1.5} />
                        <Text size="xs" fw={activeTab === item.id ? 700 : 500}>
                            {item.label}
                        </Text>
                    </UnstyledButton>
                ))}
            </div>
        </AppShell>
    );
}
