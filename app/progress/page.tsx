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

    if (!isHydrated || !me) return null;

    const totalChapters = 1189;
    const readChapters = underlines.length > 0 ? Math.min(underlines.length, 100) : 12; // Placeholder logic
    const completionPercent = Math.round((readChapters / totalChapters) * 100);

    return (
        <div className="bg-ios-bg-light dark:bg-ios-bg-dark text-slate-900 dark:text-white antialiased transition-colors duration-200 min-h-screen pb-32">

            {/* Header / Nav-like top bar */}
            <div className="flex items-center justify-between px-4 py-2 sticky top-0 z-30 bg-ios-bg-light/80 dark:bg-ios-bg-dark/80 backdrop-blur-md border-b border-black/5 dark:border-white/10">
                <button
                    onClick={() => router.push("/cells")}
                    className="flex items-center gap-1 text-ios-blue active:opacity-60 transition-opacity"
                >
                    <span className="material-symbols-outlined text-2xl">chevron_left</span>
                    <span className="text-[17px] leading-none -ml-1">홈으로</span>
                </button>
                <span className="text-[17px] font-semibold text-center">나의 진도</span>
                <button className="flex items-center justify-center text-ios-blue active:opacity-60 transition-opacity">
                    <span className="material-symbols-outlined text-xl">ios_share</span>
                </button>
            </div>

            <div className="flex flex-col gap-5 px-4 pt-4">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-end">
                        <h1 className="text-[34px] font-bold tracking-tight leading-tight text-gray-900 dark:text-white">요약</h1>
                        <div className="h-10 w-10 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                            <img src={me.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCHPcHGBqs2PA_hkmk6LOvxQWjHoBksA4O7FUv_p9aD7Odpm28PvbcOVuOmUqHof5O-8oVxRUx2-PIOmvWQG2YHJeJOtfMRPcA6z6y3wJsbEF7f7Bws07PiM5tIGq-1ZKp9QjJ7_v_v8bqwDE6ghHM75pwYOu7Tg4CwnPNodUTRFeovGYOkYj45CkRI76ivDf_xnspxJqgHcrKmAcGEAGkBez3bnSev9WiS9D02ooojb7JM1FO__hQ0etX7feMTwSijNHG_xEA7TpGC"} className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white dark:bg-ios-card-dark p-3 rounded-2xl shadow-ios">
                        <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full text-ios-orange">
                            <span className="material-symbols-outlined filled">local_fire_department</span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">현재 연속 기록</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">12일 연속 읽기 중입니다!</p>
                        </div>
                    </div>
                </div>

                {/* Completion Chart */}
                <div className="bg-ios-card-light dark:bg-ios-card-dark rounded-[24px] p-6 shadow-ios flex flex-col items-center justify-center relative overflow-hidden group active:scale-[0.99] transition-transform duration-200 ease-out">
                    <div className="flex justify-between w-full mb-4 items-center">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">성경 통독</h2>
                        <span className="text-sm font-medium text-gray-400">전체</span>
                    </div>
                    <div className="relative size-48">
                        <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                            <circle className="text-gray-100 dark:text-gray-800" cx="50" cy="50" fill="none" r="42" stroke="currentColor" strokeLinecap="round" strokeWidth="8"></circle>
                            <circle
                                className="drop-shadow-[0_0_4px_rgba(52,199,89,0.3)] text-primary"
                                cx="50" cy="50" fill="none" r="42"
                                stroke="currentColor"
                                strokeDasharray="263.8"
                                strokeDashoffset={263.8 * (1 - completionPercent / 100)}
                                strokeLinecap="round"
                                strokeWidth="8"
                            ></circle>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold tracking-tighter text-gray-900 dark:text-white">{completionPercent}<span className="text-xl align-top text-gray-400">%</span></span>
                        </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center px-4 font-medium">잘하고 있어요! 벌써 이만큼이나 읽으셨네요.</p>
                </div>

                {/* Mini Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-ios-card-light dark:bg-ios-card-dark rounded-[20px] p-4 shadow-ios flex flex-col justify-between h-36 active:scale-[0.98] transition-transform duration-200">
                        <div className="flex items-start justify-between">
                            <div className="bg-blue-100 dark:bg-blue-500/20 p-2 rounded-full text-ios-blue">
                                <span className="material-symbols-outlined text-xl">schedule</span>
                            </div>
                        </div>
                        <div>
                            <span className="text-3xl font-bold block text-gray-900 dark:text-white">14<span className="text-lg text-gray-400 font-medium ml-0.5">h</span></span>
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 block">읽은 시간</span>
                        </div>
                    </div>
                    <div className="bg-ios-card-light dark:bg-ios-card-dark rounded-[20px] p-4 shadow-ios flex flex-col justify-between h-36 active:scale-[0.98] transition-transform duration-200">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="bg-purple-100 dark:bg-purple-500/20 p-2 rounded-full text-purple-500">
                                <span className="material-symbols-outlined text-xl">menu_book</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 mt-1">
                            <div>
                                <span className="text-xl font-bold block leading-none text-gray-900 dark:text-white">{readChapters}</span>
                                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">읽은 장</span>
                            </div>
                            <div className="w-full h-px bg-gray-100 dark:bg-gray-700/50"></div>
                            <div>
                                <span className="text-xl font-bold block leading-none text-gray-900 dark:text-white">{underlines.length}</span>
                                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">읽은 절</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Awards */}
                <div className="bg-ios-card-light dark:bg-ios-card-dark rounded-[24px] p-5 shadow-ios mb-4 mt-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">획득 배지</h3>
                        <a className="text-ios-blue text-sm font-semibold active:opacity-60" href="#">모두 보기</a>
                    </div>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1 -mx-2 px-2">
                        <div className="flex flex-col items-center gap-2 min-w-[76px] group cursor-pointer">
                            <div className="size-[68px] rounded-full bg-gradient-to-b from-yellow-300 to-yellow-600 shadow-sm border border-yellow-200/50 flex items-center justify-center relative overflow-hidden group-active:scale-95 transition-transform">
                                <div className="absolute inset-0 bg-white/10 rounded-full rotate-45 transform translate-y-1/2"></div>
                                <span className="material-symbols-outlined text-white text-3xl drop-shadow-md">wb_sunny</span>
                            </div>
                            <span className="text-[10px] font-semibold text-center leading-tight line-clamp-2 w-full text-gray-600 dark:text-gray-300">얼리버드</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 min-w-[76px] group cursor-pointer">
                            <div className="size-[68px] rounded-full bg-gradient-to-b from-green-400 to-green-700 shadow-sm border border-green-200/50 flex items-center justify-center relative overflow-hidden group-active:scale-95 transition-transform">
                                <div className="absolute inset-0 bg-white/10 rounded-full rotate-45 transform translate-y-1/2"></div>
                                <span className="material-symbols-outlined text-white text-3xl drop-shadow-md">auto_stories</span>
                            </div>
                            <span className="text-[10px] font-semibold text-center leading-tight line-clamp-2 w-full text-gray-600 dark:text-gray-300">다독왕</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
