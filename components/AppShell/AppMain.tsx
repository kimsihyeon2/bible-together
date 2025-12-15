"use client";

import { AppShell, Container, ActionIcon, useMantineColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { usePathname, useRouter } from "next/navigation";
import { useBibleStore } from "@/store/use-bible-store";
import { useEffect, useState } from "react";
import { NotificationBell } from "@/components/NotificationBell";
import { IconSun, IconMoon, IconLogout } from "@tabler/icons-react";

export function AppMain({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const { me, logout } = useBibleStore();
    const [activeTab, setActiveTab] = useState("home");

    useEffect(() => {
        if (pathname?.startsWith("/cells") && pathname.length > 7) {
            setActiveTab("reading");
        } else if (pathname === "/cells") {
            setActiveTab("home");
        } else if (pathname === "/leader") {
            setActiveTab("leader");
        } else if (pathname === "/admin") {
            setActiveTab("admin");
        } else if (pathname === "/progress") {
            setActiveTab("progress");
        }
    }, [pathname]);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const navItems = [
        { label: "홈", icon: "home", id: "home", path: "/cells" },
        { label: "진행", icon: "bar_chart", id: "progress", path: "/progress", show: true },
        { label: "셀", icon: "groups", id: "leader", path: "/leader", show: me?.role === "LEADER" || me?.role === "PASTOR" },
        { label: "관리", icon: "shield_person", id: "admin", path: "/admin", show: me?.role === "PASTOR" },
    ];

    return (
        <div className="relative min-h-screen w-full bg-[#F2F2F7] dark:bg-black transition-colors">
            {/* Header */}
            <header className="sticky top-0 z-40 glass-nav border-b border-black/5 dark:border-white/10">
                <div className="flex items-center justify-between px-5 py-3">
                    <div className="flex flex-col">
                        {me && (
                            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#34C759]">
                                {me.role === "PASTOR" ? "담임목사" : me.role === "LEADER" ? "셀 리더" : "셀원"}
                            </span>
                        )}
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Bible Together
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        {me && (
                            <>
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
                                    {me.name}님
                                </span>
                                <NotificationBell />
                                <button
                                    onClick={handleLogout}
                                    className="relative rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-red-500"
                                >
                                    <IconLogout size={22} />
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => toggleColorScheme()}
                            className="relative rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-900 dark:text-white"
                        >
                            {colorScheme === "dark" ? <IconSun size={22} /> : <IconMoon size={22} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pb-28">
                <Container size="sm" p="md">
                    {children}
                </Container>
            </main>

            {/* Bottom Navigation - iOS Style */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 glass-nav border-t border-black/5 dark:border-white/10 pb-safe">
                <div className="flex items-center justify-around pt-2 pb-1">
                    {navItems.filter(i => i.show !== false).map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                router.push(item.path);
                            }}
                            className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${activeTab === item.id
                                    ? "text-[#34C759]"
                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                }`}
                        >
                            <span
                                className="material-symbols-outlined text-[26px]"
                                style={{ fontVariationSettings: activeTab === item.id ? "'FILL' 1" : "'FILL' 0" }}
                            >
                                {item.icon}
                            </span>
                            <span className={`text-[10px] ${activeTab === item.id ? "font-semibold" : "font-medium"}`}>
                                {item.label}
                            </span>
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    );
}
