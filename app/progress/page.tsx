"use client";

import { useBibleStore } from "@/store/use-bible-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProgressPage() {
    const { me, underlines } = useBibleStore();
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

    if (!isHydrated || !me) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-3 border-[#34C759] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const totalChapters = 1189; // Total chapters in Bible
    const readChapters = underlines.length > 0 ? Math.min(underlines.length, 100) : 12; // Demo data
    const completionPercent = Math.round((readChapters / totalChapters) * 100);
    const streakDays = 12; // Demo

    return (
        <div className="flex flex-col gap-5 pt-2 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-end">
                <h1 className="text-[34px] font-bold tracking-tight leading-tight text-gray-900 dark:text-white">
                    나의 진행
                </h1>
                <div
                    className="h-10 w-10 rounded-full bg-gradient-to-br from-[#34C759] to-[#32ADE6] flex items-center justify-center text-white font-bold text-sm"
                >
                    {me.name?.charAt(0) || "U"}
                </div>
            </div>

            {/* Streak Badge */}
            <div className="flex items-center gap-3 bg-white dark:bg-[#1C1C1E] p-3 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full text-orange-500">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                        local_fire_department
                    </span>
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">연속 {streakDays}일 읽기!</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">오늘도 화이팅!</p>
                </div>
            </div>

            {/* Completion Ring */}
            <div className="bg-white dark:bg-[#1C1C1E] rounded-[24px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col items-center">
                <div className="flex justify-between w-full mb-4 items-center">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">전체 진행률</h2>
                    <span className="text-sm font-medium text-gray-400">Total</span>
                </div>
                <div className="relative w-48 h-48">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                            className="text-gray-100 dark:text-gray-800"
                            cx="50" cy="50" r="42"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                        />
                        <defs>
                            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#34C759" />
                                <stop offset="100%" stopColor="#32ADE6" />
                            </linearGradient>
                        </defs>
                        <circle
                            cx="50" cy="50" r="42"
                            fill="none"
                            stroke="url(#progress-gradient)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray="263.8"
                            strokeDashoffset={263.8 * (1 - completionPercent / 100)}
                            className="drop-shadow-[0_0_4px_rgba(52,199,89,0.3)]"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold tracking-tighter text-gray-900 dark:text-white">
                            {completionPercent}
                            <span className="text-xl align-top text-gray-400">%</span>
                        </span>
                    </div>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center px-4 font-medium">
                    {completionPercent < 50 ? "조금씩 꾸준히 읽어나가요!" : "절반 넘었어요! 화이팅!"}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                {/* Time Read */}
                <div className="bg-white dark:bg-[#1C1C1E] rounded-[20px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col justify-between h-36">
                    <div className="flex items-start justify-between">
                        <div className="bg-blue-100 dark:bg-blue-500/20 p-2 rounded-full text-[#007AFF]">
                            <span className="material-symbols-outlined text-xl">schedule</span>
                        </div>
                    </div>
                    <div>
                        <span className="text-3xl font-bold block text-gray-900 dark:text-white">
                            14<span className="text-lg text-gray-400 font-medium ml-0.5">시간</span>
                        </span>
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 block">읽은 시간</span>
                    </div>
                </div>

                {/* Chapters & Verses */}
                <div className="bg-white dark:bg-[#1C1C1E] rounded-[20px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col justify-between h-36">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="bg-purple-100 dark:bg-purple-500/20 p-2 rounded-full text-purple-500">
                            <span className="material-symbols-outlined text-xl">menu_book</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 mt-1">
                        <div>
                            <span className="text-xl font-bold block leading-none text-gray-900 dark:text-white">{readChapters}</span>
                            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">장 완독</span>
                        </div>
                        <div className="w-full h-px bg-gray-100 dark:bg-gray-700/50"></div>
                        <div>
                            <span className="text-xl font-bold block leading-none text-gray-900 dark:text-white">{underlines.length}</span>
                            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">밑줄</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Weekly Activity */}
            <div className="bg-white dark:bg-[#1C1C1E] rounded-[24px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">주간 활동</h3>
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">최근 7일</span>
                </div>
                <div className="flex items-end justify-between h-32 gap-3">
                    {["월", "화", "수", "목", "금", "토", "일"].map((day, i) => {
                        const heights = [40, 65, 30, 85, 50, 20, 95];
                        const isToday = i === 3;
                        return (
                            <div key={day} className="flex flex-col items-center gap-2 flex-1 group">
                                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-full relative overflow-hidden">
                                    <div
                                        className={`absolute bottom-0 w-full rounded-full transition-colors ${isToday
                                                ? "bg-[#34C759] shadow-[0_0_10px_rgba(52,199,89,0.3)]"
                                                : "bg-[#34C759]/40 group-hover:bg-[#34C759]/60"
                                            }`}
                                        style={{ height: `${heights[i]}%` }}
                                    />
                                </div>
                                <span className={`text-[10px] font-semibold ${isToday ? "text-gray-900 dark:text-white" : "text-gray-400"
                                    }`}>
                                    {day}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Awards */}
            <div className="bg-white dark:bg-[#1C1C1E] rounded-[24px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">업적</h3>
                    <a className="text-[#007AFF] text-sm font-semibold" href="#">모두 보기</a>
                </div>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1 -mx-2 px-2">
                    {/* Early Riser */}
                    <div className="flex flex-col items-center gap-2 min-w-[76px]">
                        <div className="w-[68px] h-[68px] rounded-full bg-gradient-to-b from-yellow-300 to-yellow-600 shadow-sm flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-3xl drop-shadow-md">
                                wb_sunny
                            </span>
                        </div>
                        <span className="text-[10px] font-semibold text-center text-gray-600 dark:text-gray-300">새벽 독서</span>
                    </div>
                    {/* Gospel Reader */}
                    <div className="flex flex-col items-center gap-2 min-w-[76px]">
                        <div className="w-[68px] h-[68px] rounded-full bg-gradient-to-b from-green-400 to-green-700 shadow-sm flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-3xl drop-shadow-md">
                                auto_stories
                            </span>
                        </div>
                        <span className="text-[10px] font-semibold text-center text-gray-600 dark:text-gray-300">복음서 완독</span>
                    </div>
                    {/* Community */}
                    <div className="flex flex-col items-center gap-2 min-w-[76px]">
                        <div className="w-[68px] h-[68px] rounded-full bg-gradient-to-b from-blue-300 to-blue-600 shadow-sm flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-3xl drop-shadow-md">
                                diversity_3
                            </span>
                        </div>
                        <span className="text-[10px] font-semibold text-center text-gray-600 dark:text-gray-300">함께 읽기</span>
                    </div>
                    {/* Locked */}
                    <div className="flex flex-col items-center gap-2 min-w-[76px] opacity-40 grayscale">
                        <div className="w-[68px] h-[68px] rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                            <span className="material-symbols-outlined text-gray-400 text-2xl">lock</span>
                        </div>
                        <span className="text-[10px] font-semibold text-center text-gray-500">365일 연속</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
