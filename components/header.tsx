"use client";

import { useBibleStore } from "@/store/use-bible-store";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { BookOpen, UserCircle, Settings, Moon, Sun, Monitor } from "lucide-react";
import { useEffect } from "react";

export function Header() {
    const { me, setMe, theme, setTheme } = useBibleStore();
    const router = useRouter();

    const isPastor = me.role === "PASTOR";

    // Apply theme on mount and when theme changes
    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        if (theme === "system") {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            root.classList.add(prefersDark ? "dark" : "light");
        } else {
            root.classList.add(theme);
        }
    }, [theme]);

    const cycleTheme = () => {
        if (theme === "light") setTheme("dark");
        else if (theme === "dark") setTheme("system");
        else setTheme("light");
    };

    const ThemeIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center max-w-4xl mx-auto px-4">
                <div
                    className="mr-4 flex items-center gap-2 font-serif font-bold text-xl cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => router.push("/cells")}
                    data-testid="logo-home-link"
                >
                    <BookOpen className="h-6 w-6 text-primary" />
                    <span className="hidden xs:inline">Bible Together</span>
                </div>

                <div className="flex flex-1 items-center justify-end space-x-1 sm:space-x-2">
                    {/* User Info - hide on very small screens */}
                    <div className="text-sm text-muted-foreground hidden md:block">
                        {me.name} <span className="text-xs opacity-70">({isPastor ? "Pastor" : "Member"})</span>
                    </div>

                    {/* Theme Toggle Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={cycleTheme}
                        title={`Theme: ${theme}`}
                        aria-label="Toggle theme"
                        data-testid="theme-toggle-button"
                    >
                        <ThemeIcon className="h-5 w-5" />
                    </Button>

                    {/* Cells Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push("/cells")}
                        data-testid="cells-nav-button"
                        aria-label="Go to Cells"
                    >
                        <UserCircle className="h-5 w-5" />
                    </Button>

                    {/* Admin Button - ALWAYS visible for Pastors on all screen sizes */}
                    {isPastor && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push("/admin")}
                            data-testid="admin-nav-button"
                            aria-label="Go to Admin Dashboard"
                        >
                            <Settings className="h-5 w-5" />
                        </Button>
                    )}

                    {/* Role Toggle for Prototype - responsive text */}
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-xs ml-1 sm:ml-2 whitespace-nowrap"
                        onClick={() => setMe({ role: isPastor ? "MEMBER" : "PASTOR" })}
                        data-testid="role-toggle-button"
                        aria-label={isPastor ? "Switch to Member view" : "Switch to Pastor view"}
                    >
                        <span className="hidden sm:inline">{isPastor ? "View as Member" : "View as Pastor"}</span>
                        <span className="sm:hidden">{isPastor ? "Member" : "Pastor"}</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
