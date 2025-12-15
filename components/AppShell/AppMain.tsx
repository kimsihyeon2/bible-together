"use client";

import { usePathname, useRouter } from "next/navigation";
import { useBibleStore } from "@/store/use-bible-store";
import { useEffect, useState } from "react";
import { NotificationBell } from "@/components/NotificationBell";
import { useMantineColorScheme } from "@mantine/core";

export function AppMain({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { me, logout } = useBibleStore();
    const { toggleColorScheme } = useMantineColorScheme();
    const [activeTab, setActiveTab] = useState("home");

    useEffect(() => {
        if (pathname === "/cells") setActiveTab("home");
        else if (pathname === "/progress") setActiveTab("progress");
        else if (pathname === "/leader") setActiveTab("leader");
        else if (pathname === "/admin") setActiveTab("admin");
    }, [pathname]);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const isAuthPage = pathname === "/login";

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="relative min-h-screen w-full bg-ios-bg-light dark:bg-ios-bg-dark font-sans text-slate-900 dark:text-white antialiased transition-colors duration-200">
            {/* Header */}
            <header className="sticky top-0 z-40 glass-nav border-b border-black/5 dark:border-white/10 transition-all duration-300">
                <div className="flex items-center justify-between px-5 py-3 max-w-md mx-auto">
                    <div className="flex flex-col">
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-ios-green">
                            {me?.role === "PASTOR" ? "Pastor" : me?.role === "LEADER" ? "Cell Leader" : "Member"}
                        </span>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Bible Together</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined text-[24px] text-slate-900 dark:text-white" onClick={toggleColorScheme}>contrast</span>
                        </div>
                        <NotificationBell />
                        <button className="h-9 w-9 overflow-hidden rounded-full border border-black/10 dark:border-white/10" onClick={handleLogout}>
                            <img alt="User Profile" className="h-full w-full object-cover bg-slate-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHPcHGBqs2PA_hkmk6LOvxQWjHoBksA4O7FUv_p9aD7Odpm28PvbcOVuOmUqHof5O-8oVxRUx2-PIOmvWQG2YHJeJOtfMRPcA6z6y3wJsbEF7f7Bws07PiM5tIGq-1ZKp9QjJ7_v_v8bqwDE6ghHM75pwYOu7Tg4CwnPNodUTRFeovGYOkYj45CkRI76ivDf_xnspxJqgHcrKmAcGEAGkBez3bnSev9WiS9D02ooojb7JM1FO__hQ0etX7feMTwSijNHG_xEA7TpGC" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex flex-col gap-6 pt-4 pb-32 max-w-md mx-auto">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 glass-nav border-t border-black/5 dark:border-white/10 safe-bottom">
                <div className="flex items-center justify-around pt-2 pb-1 max-w-md mx-auto">
                    <button
                        onClick={() => router.push("/cells")}
                        className={`flex flex-col items-center gap-1 p-2 w-16 ${activeTab === "home" ? "text-ios-green" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}
                    >
                        <span className={`material-symbols-outlined text-[26px] ${activeTab === "home" ? "filled" : ""}`}>home</span>
                        <span className={`text-[10px] ${activeTab === "home" ? "font-semibold" : "font-medium"}`}>Home</span>
                    </button>

                    <button
                        onClick={() => router.push("/progress")}
                        className={`flex flex-col items-center gap-1 p-2 w-16 ${activeTab === "progress" ? "text-ios-green" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}
                    >
                        <span className={`material-symbols-outlined text-[26px] ${activeTab === "progress" ? "filled" : ""}`}>bar_chart</span>
                        <span className={`text-[10px] ${activeTab === "progress" ? "font-semibold" : "font-medium"}`}>Progress</span>
                    </button>

                    {(me?.role === "LEADER" || me?.role === "PASTOR") && (
                        <button
                            onClick={() => router.push("/leader")}
                            className={`flex flex-col items-center gap-1 p-2 w-16 ${activeTab === "leader" ? "text-ios-green" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}
                        >
                            <span className={`material-symbols-outlined text-[26px] ${activeTab === "leader" ? "filled" : ""}`}>groups</span>
                            <span className={`text-[10px] ${activeTab === "leader" ? "font-semibold" : "font-medium"}`}>Cell</span>
                        </button>
                    )}

                    {me?.role === "PASTOR" && (
                        <button
                            onClick={() => router.push("/admin")}
                            className={`flex flex-col items-center gap-1 p-2 w-16 ${activeTab === "admin" ? "text-ios-green" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}
                        >
                            <span className={`material-symbols-outlined text-[26px] ${activeTab === "admin" ? "filled" : ""}`}>shield_person</span>
                            <span className={`text-[10px] ${activeTab === "admin" ? "font-semibold" : "font-medium"}`}>Admin</span>
                        </button>
                    )}
                </div>
            </nav>
            <style jsx global>{`
                .safe-bottom {
                    padding-bottom: env(safe-area-inset-bottom, 20px);
                }
            `}</style>
        </div>
    );
}
