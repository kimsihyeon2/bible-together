"use client";

import { useBibleStore } from "@/store/use-bible-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SettingsPage() {
    const { me, logout, underlines } = useBibleStore();
    const router = useRouter();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (isHydrated && !me) {
            router.replace("/login");
        }
    }, [me, router, isHydrated]);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    if (!isHydrated || !me) return null;

    // Stats (placeholder logic)
    const streakDays = 12;
    const chaptersRead = underlines.length > 0 ? Math.min(underlines.length, 50) : 45;

    return (
        <div className="bg-ios-bg-light dark:bg-ios-bg-dark font-display text-slate-900 dark:text-white antialiased min-h-screen pb-32">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-ios-bg-light/90 dark:bg-ios-bg-dark/90 backdrop-blur-md transition-colors duration-300">
                <div className="flex flex-col px-4 pt-14 pb-2">
                    <h1 className="text-[34px] font-bold tracking-tight text-black dark:text-white leading-tight">설정</h1>
                    <div className="mt-2 relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
                        </div>
                        <input
                            className="w-full bg-[#E3E3E8] dark:bg-[#1C1C1E] border-none rounded-[10px] py-2 pl-10 pr-4 text-[17px] text-black dark:text-white placeholder-slate-500 focus:ring-0"
                            placeholder="검색"
                            type="text"
                        />
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-md mx-auto flex flex-col gap-5 mt-4">
                {/* Profile Section */}
                <section className="px-4">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative">
                            <div
                                className="w-[84px] h-[84px] rounded-full bg-slate-200 bg-cover bg-center ring-1 ring-black/5 dark:ring-white/10"
                                style={{ backgroundImage: `url('${me.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCHPcHGBqs2PA_hkmk6LOvxQWjHoBksA4O7FUv_p9aD7Odpm28PvbcOVuOmUqHof5O-8oVxRUx2-PIOmvWQG2YHJeJOtfMRPcA6z6y3wJsbEF7f7Bws07PiM5tIGq-1ZKp9QjJ7_v_v8bqwDE6ghHM75pwYOu7Tg4CwnPNodUTRFeovGYOkYj45CkRI76ivDf_xnspxJqgHcrKmAcGEAGkBez3bnSev9WiS9D02ooojb7JM1FO__hQ0etX7feMTwSijNHG_xEA7TpGC"}')` }}
                            ></div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <h2 className="text-[22px] font-semibold text-black dark:text-white leading-tight">{me.name}</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-[15px]">{me.role === "PASTOR" ? "담임목사" : me.role === "LEADER" ? "리더" : "성도"}</p>
                            <button className="text-ios-blue text-[15px] mt-0.5 text-left">프로필 수정</button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-surface-light dark:bg-surface-dark rounded-[18px] p-4 flex flex-col justify-between h-[88px] shadow-sm">
                            <div className="flex justify-between items-start">
                                <span className="material-symbols-outlined text-ios-orange text-2xl">local_fire_department</span>
                                <span className="text-2xl font-bold text-black dark:text-white">{streakDays}</span>
                            </div>
                            <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400">연속 읽기</span>
                        </div>
                        <div className="bg-surface-light dark:bg-surface-dark rounded-[18px] p-4 flex flex-col justify-between h-[88px] shadow-sm">
                            <div className="flex justify-between items-start">
                                <span className="material-symbols-outlined text-ios-blue text-2xl">auto_stories</span>
                                <span className="text-2xl font-bold text-black dark:text-white">{chaptersRead}</span>
                            </div>
                            <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400">읽은 장</span>
                        </div>
                    </div>
                </section>

                <div className="flex flex-col gap-6 px-4">

                    {/* Security & Community */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-[10px] overflow-hidden shadow-sm">
                        <div className="relative flex items-center p-3 pl-4 active:bg-slate-100 dark:active:bg-slate-800 transition-colors cursor-pointer group">
                            <div className="w-[28px] h-[28px] rounded-[6px] bg-ios-blue flex items-center justify-center text-white mr-3 shrink-0">
                                <span className="material-symbols-outlined text-[18px]">lock</span>
                            </div>
                            <div className="flex-1 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 pt-1 group-last:border-0">
                                <span className="text-[17px] text-black dark:text-white">보안 및 이메일</span>
                                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-[20px] mr-2">chevron_right</span>
                            </div>
                        </div>
                        <div className="relative flex items-center p-3 pl-4 pt-0 active:bg-slate-100 dark:active:bg-slate-800 transition-colors cursor-pointer group">
                            <div className="w-[28px] h-[28px] rounded-[6px] bg-ios-purple flex items-center justify-center text-white mr-3 shrink-0 mt-2">
                                <span className="material-symbols-outlined text-[18px]">church</span>
                            </div>
                            <div className="flex-1 flex items-center justify-between pt-3 pb-1">
                                <span className="text-[17px] text-black dark:text-white">공동체</span>
                                <div className="flex items-center gap-2 mr-2">
                                    <span className="text-[17px] text-slate-500 dark:text-slate-400">{me.role === "PASTOR" ? "담임목사" : me.role === "LEADER" ? "리더" : "성도"}</span>
                                    <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-[20px]">chevron_right</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reading Settings */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-[10px] overflow-hidden shadow-sm">
                        <div className="relative flex items-center p-3 pl-4 active:bg-slate-100 dark:active:bg-slate-800 transition-colors cursor-pointer group">
                            <div className="w-[28px] h-[28px] rounded-[6px] bg-ios-orange flex items-center justify-center text-white mr-3 shrink-0">
                                <span className="material-symbols-outlined text-[18px]">translate</span>
                            </div>
                            <div className="flex-1 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 pt-1">
                                <span className="text-[17px] text-black dark:text-white">번역본</span>
                                <div className="flex items-center gap-2 mr-2">
                                    <span className="text-[17px] text-slate-500 dark:text-slate-400">개역개정</span>
                                    <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-[20px]">chevron_right</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative flex items-center p-3 pl-4 pt-0 active:bg-slate-100 dark:active:bg-slate-800 transition-colors cursor-pointer group">
                            <div className="w-[28px] h-[28px] rounded-[6px] bg-slate-500 flex items-center justify-center text-white mr-3 shrink-0 mt-2">
                                <span className="material-symbols-outlined text-[18px]">format_size</span>
                            </div>
                            <div className="flex-1 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pt-3 pb-3">
                                <span className="text-[17px] text-black dark:text-white">글자 크기</span>
                                <div className="flex items-center gap-2 mr-2">
                                    <span className="text-[17px] text-slate-500 dark:text-slate-400">보통</span>
                                    <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-[20px]">chevron_right</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative flex items-center p-3 pl-4 pt-0 active:bg-slate-100 dark:active:bg-slate-800 transition-colors cursor-pointer group">
                            <div className="w-[28px] h-[28px] rounded-[6px] bg-slate-400 flex items-center justify-center text-white mr-3 shrink-0 mt-2">
                                <span className="material-symbols-outlined text-[18px]">speed</span>
                            </div>
                            <div className="flex-1 flex items-center justify-between pt-3 pb-1">
                                <span className="text-[17px] text-black dark:text-white">오디오 속도</span>
                                <div className="flex items-center gap-2 mr-2">
                                    <span className="text-[17px] text-slate-500 dark:text-slate-400">1.0x</span>
                                    <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-[20px]">chevron_right</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-[10px] overflow-hidden shadow-sm">
                        <div className="relative flex items-center p-3 pl-4 active:bg-slate-100 dark:active:bg-slate-800 transition-colors cursor-pointer group">
                            <div className="w-[28px] h-[28px] rounded-[6px] bg-ios-red flex items-center justify-center text-white mr-3 shrink-0">
                                <span className="material-symbols-outlined text-[18px]">notifications_active</span>
                            </div>
                            <div className="flex-1 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 pt-1">
                                <span className="text-[17px] text-black dark:text-white">매일 알림</span>
                                <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-[6px] mr-2">
                                    <span className="text-[15px] font-semibold text-black dark:text-white">오전 7:00</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative flex items-center p-3 pl-4 pt-0">
                            <div className="w-[28px] h-[28px] rounded-[6px] bg-primary flex items-center justify-center text-white mr-3 shrink-0 mt-2">
                                <span className="material-symbols-outlined text-[18px]">groups</span>
                            </div>
                            <div className="flex-1 flex items-center justify-between pt-3 pb-1">
                                <span className="text-[17px] text-black dark:text-white">공동체 활동</span>
                                <input defaultChecked className="ios-toggle mr-2" type="checkbox" />
                            </div>
                        </div>
                    </div>

                    {/* Help & Logout */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-[10px] overflow-hidden shadow-sm">
                        <div className="relative flex items-center p-3 pl-4 active:bg-slate-100 dark:active:bg-slate-800 transition-colors cursor-pointer group">
                            <div className="w-[28px] h-[28px] rounded-[6px] bg-ios-blue flex items-center justify-center text-white mr-3 shrink-0">
                                <span className="material-symbols-outlined text-[18px]">help</span>
                            </div>
                            <div className="flex-1 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 pt-1">
                                <span className="text-[17px] text-black dark:text-white">도움말</span>
                                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-[20px] mr-2">chevron_right</span>
                            </div>
                        </div>
                        <div className="relative flex items-center p-3 pl-4 pt-0 active:bg-slate-100 dark:active:bg-slate-800 transition-colors cursor-pointer group">
                            <div className="w-[28px] h-[28px] rounded-[6px] bg-ios-teal flex items-center justify-center text-white mr-3 shrink-0 mt-2">
                                <span className="material-symbols-outlined text-[18px]">policy</span>
                            </div>
                            <div className="flex-1 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pt-3 pb-3">
                                <span className="text-[17px] text-black dark:text-white">개인정보 처리방침</span>
                                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-[20px] mr-2">chevron_right</span>
                            </div>
                        </div>
                        <div
                            className="relative flex items-center p-3 pl-4 pt-0 active:bg-slate-100 dark:active:bg-slate-800 transition-colors cursor-pointer group"
                            onClick={handleLogout}
                        >
                            <div className="flex-1 flex items-center justify-center pt-3 pb-1">
                                <span className="text-[17px] text-ios-red font-normal">로그아웃</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center pb-8 pt-2">
                        <p className="text-[13px] text-slate-400 dark:text-slate-500">Bible Together v2.4.1</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
