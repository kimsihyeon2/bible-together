"use client";

import { useBibleStore } from "@/store/use-bible-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDisclosure } from '@mantine/hooks';
import { Modal, TextInput, Button } from '@mantine/core';

export default function CellsPage() {
    const { me, cells, joinCell, underlines } = useBibleStore();
    const router = useRouter();
    const [isHydrated, setIsHydrated] = useState(false);

    // Logic for Join Cell
    const [inviteCode, setInviteCode] = useState("");
    const [joinLoading, setJoinLoading] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (isHydrated && !me) {
            router.push("/login");
        }
    }, [me, router, isHydrated]);

    if (!isHydrated || !me) return null;

    const myCells = cells.filter(cell => me.myCellIds?.includes(cell.id));
    const handleJoin = async () => {
        if (!inviteCode.trim()) return;
        setJoinLoading(true);
        const res = await joinCell(inviteCode);
        setJoinLoading(false);
        if (res.success) {
            alert(res.message);
            close();
            setInviteCode("");
        } else {
            alert(res.message);
        }
    };

    // Calculate generic progress
    const totalChapters = 1189;
    const readChapters = underlines.length > 0 ? Math.min(underlines.length, 100) : 12;
    const completionPercent = Math.round((readChapters / totalChapters) * 100);

    return (
        <div className="relative w-full pb-10 bg-ios-bg-light dark:bg-ios-bg-dark font-sans text-slate-900 dark:text-white antialiased">

            {/* Header omitted here as it's in AppMain, but we can add page-specific content */}
            <div className="px-5 pt-2">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                    반갑습니다,<br />
                    <span className="text-primary">{me.name}</span>님
                </h2>
                <p className="mt-2 text-[15px] font-medium text-slate-500 dark:text-slate-400">
                    오늘도 말씀과 함께하는 하루 되세요.
                </p>
            </div>

            {/* Today's Reading Card */}
            <div className="mt-6 px-5 cursor-pointer" onClick={() => router.push(`/plan/today`)}>
                <div className="group relative overflow-hidden rounded-[2rem] bg-surface-light dark:bg-surface-dark shadow-ios-lg transition-transform active:scale-[0.98]">
                    <div className="relative h-64 w-full">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                        <img
                            alt="Bible Reading"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhaAG7JcTa9y5nZnzx1OnXSG5QbZmcLRgWlRD88LEa92wmYpjJfaDEE1l7nby1PTFJRHONuQs6S5KpCN8sf9cCvXYc-T4RfJdp1MJgk64YM18YaOln1u-xVYom1Qm0SpRnJuxqWu-YMaOuTQ-Mzv8FQCCKbbKLq3kEVuVzy8ZTFjJNgbozP9sXJ4rcW1y5hbbfEAJX3yDUIbSCQ8k8b8PF7kE8HVCbRasfCJy6M151kxy1bKuZ8Aw1WgmMVVb6CNasOoONBGWu3A9R"
                        />
                        <div className="absolute top-4 left-4 z-20">
                            <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 backdrop-blur-md border border-white/20">
                                <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-white">오늘의 말씀</span>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                            <div className="flex items-end justify-between gap-4">
                                <div>
                                    <h3 className="text-3xl font-bold text-white tracking-tight">로마서 8장</h3>
                                    <p className="mt-1 text-sm font-medium text-white/90">Day 14 • 예수님과 동행</p>
                                </div>
                                <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform hover:scale-110 active:scale-95">
                                    <span className="material-symbols-outlined font-bold">play_arrow</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="mt-4 px-5 grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-surface-light dark:bg-surface-dark p-5 shadow-ios flex flex-col justify-between h-40 relative overflow-hidden" onClick={() => router.push("/progress")}>
                    <div className="flex flex-col z-10">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">목표 달성률</span>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{completionPercent}%</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">전체 진행도</span>
                    </div>
                    <div className="absolute -bottom-4 -right-4 h-24 w-24">
                        <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                            <path className="text-slate-100 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4"></path>
                            <path className="text-primary drop-shadow-[0_0_8px_rgba(52,199,89,0.4)]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${completionPercent}, 100`} strokeLinecap="round" strokeWidth="4"></path>
                        </svg>
                    </div>
                </div>
                <div className="rounded-3xl bg-surface-light dark:bg-surface-dark p-5 shadow-ios flex flex-col justify-between h-40">
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">연속 읽기</span>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white mt-1">12일</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">최고 기록 달성!</span>
                    </div>
                    <div className="flex items-center gap-1 mt-auto">
                        <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-orange-500 text-lg">local_fire_department</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* My Communities (Previously Active Plans) */}
            <div className="mt-8 flex flex-col gap-4">
                <div className="px-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">나의 공동체</h3>
                    <button className="text-sm font-medium text-primary hover:text-green-500 transition-colors" onClick={open}>
                        + 공동체 추가
                    </button>
                </div>

                <div className="flex overflow-x-auto px-5 pb-6 gap-4 scrollbar-hide snap-x snap-mandatory no-scrollbar">
                    {/* Render My Cells */}
                    {myCells.map(cell => (
                        <div key={cell.id} className="snap-center shrink-0 w-44 flex flex-col gap-2 group cursor-pointer" onClick={() => router.push(`/cells/${cell.id}`)}>
                            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-md bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                                {/* Placeholder Gradient or Image */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20"></div>
                                <span className="material-symbols-outlined text-4xl text-slate-400">groups</span>

                                <div className="absolute bottom-3 left-3 right-3">
                                    <div className="h-1 w-full bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                                        <div className="h-full w-2/3 bg-primary rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900 dark:text-white leading-tight">{cell.name}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{cell.memberCount}명 참여 중</p>
                            </div>
                        </div>
                    ))}

                    {/* Add Cell Button as a clear option if empty */}
                    {myCells.length === 0 && (
                        <div className="snap-center shrink-0 w-44 flex flex-col gap-2">
                            <button onClick={open} className="w-full aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/10 flex flex-col items-center justify-center gap-3 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-2xl">add</span>
                                </div>
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">공동체 찾기</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions removed/simplified as Bottom Nav covers most */}

            {/* Join Cell Modal */}
            <Modal opened={opened} onClose={close} title="새로운 공동체 참여" centered radius="lg">
                <div className="flex gap-2">
                    <TextInput
                        placeholder="초대 코드 (예: YOUTH1)"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        className="flex-1"
                    />
                    <Button onClick={handleJoin} loading={joinLoading} color="teal">참여</Button>
                </div>
            </Modal>

        </div>
    );
}
