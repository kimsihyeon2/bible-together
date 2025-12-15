"use client";
import { useState, useEffect } from "react";
import { useBibleStore } from "@/store/use-bible-store";
import { useRouter } from "next/navigation";
import { IconMail, IconLock, IconUser, IconPhone, IconBuildingChurch, IconEye, IconEyeOff } from "@tabler/icons-react";

const CELLS = [
    { value: "FAITH", label: "믿음 교구" },
    { value: "HOPE", label: "소망 교구" },
    { value: "LOVE", label: "사랑 교구" },
];

export default function LoginPage() {
    const { login, signup, me } = useBibleStore();
    const router = useRouter();
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [form, setForm] = useState({ email: "", password: "", name: "", phone: "", cellCode: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (me) {
            router.replace("/cells");
        }
    }, [me, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (mode === "signup") {
                if (!form.email || !form.password || !form.name) {
                    setError("이름, 이메일, 비밀번호를 모두 입력해주세요.");
                    setLoading(false);
                    return;
                }
                if (!form.cellCode) {
                    setError("소속 교구를 선택해주세요.");
                    setLoading(false);
                    return;
                }
                const res = await signup(form.email, form.password, form.name, form.phone, form.cellCode);
                if (res.success) {
                    router.replace("/cells");
                } else {
                    setError(res.message);
                }
            } else {
                if (!form.email || !form.password) {
                    setError("이메일과 비밀번호를 입력해주세요.");
                    setLoading(false);
                    return;
                }
                const res = await login(form.email, form.password);
                if (res.success) {
                    router.replace("/cells");
                } else {
                    setError(res.message);
                }
            }
        } catch (err: any) {
            setError(err.message || "오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F2F2F7] dark:bg-black transition-colors duration-300">
            <div className="w-full max-w-[380px] mx-auto flex flex-col items-center animate-fade-in">
                {/* Logo */}
                <div className="relative mb-6 group">
                    <div className="absolute inset-0 bg-[#34C759] rounded-[28px] blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                    <div className="relative w-[88px] h-[88px] bg-white dark:bg-[#1C1C1E] rounded-[28px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#34C759] text-[44px]">menu_book</span>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-[28px] font-bold tracking-tight text-black dark:text-white mb-2">
                    Bible Together
                </h1>
                <p className="text-[#8E8E93] text-[15px] font-medium leading-relaxed text-center mb-8">
                    함께 읽고, 함께 성장하는<br />성경 읽기 공동체
                </p>

                {/* Mode Toggle */}
                <div className="flex w-full bg-white dark:bg-[#1C1C1E] rounded-full p-1 mb-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                    <button
                        onClick={() => setMode("login")}
                        className={`flex-1 py-3 rounded-full text-[15px] font-semibold transition-all duration-200 ${mode === "login"
                                ? "bg-[#34C759] text-white shadow-lg"
                                : "text-[#8E8E93] hover:text-black dark:hover:text-white"
                            }`}
                    >
                        로그인
                    </button>
                    <button
                        onClick={() => setMode("signup")}
                        className={`flex-1 py-3 rounded-full text-[15px] font-semibold transition-all duration-200 ${mode === "signup"
                                ? "bg-[#34C759] text-white shadow-lg"
                                : "text-[#8E8E93] hover:text-black dark:hover:text-white"
                            }`}
                    >
                        회원가입
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    {mode === "signup" && (
                        <>
                            {/* Name Input */}
                            <div className="group relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <IconUser className="text-gray-400 group-focus-within:text-[#34C759] transition-colors" size={22} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="이름"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="block w-full rounded-2xl border-none bg-white dark:bg-[#1C1C1E] py-[18px] pl-12 pr-4 text-[16px] text-black dark:text-white placeholder:text-gray-400 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-0 focus:ring-2 focus:ring-[#34C759]/20 focus:shadow-lg transition-all duration-300 ease-out outline-none"
                                />
                            </div>

                            {/* Cell Selection */}
                            <div className="group relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                    <IconBuildingChurch className="text-gray-400 group-focus-within:text-[#34C759] transition-colors" size={22} />
                                </div>
                                <select
                                    value={form.cellCode}
                                    onChange={(e) => setForm({ ...form, cellCode: e.target.value })}
                                    className="block w-full rounded-2xl border-none bg-white dark:bg-[#1C1C1E] py-[18px] pl-12 pr-4 text-[16px] text-black dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-0 focus:ring-2 focus:ring-[#34C759]/20 focus:shadow-lg transition-all duration-300 ease-out outline-none appearance-none cursor-pointer"
                                >
                                    <option value="">교구를 선택해주세요</option>
                                    {CELLS.map(cell => (
                                        <option key={cell.value} value={cell.value}>{cell.label}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    {/* Email Input */}
                    <div className="group relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <IconMail className="text-gray-400 group-focus-within:text-[#34C759] transition-colors" size={22} />
                        </div>
                        <input
                            type="email"
                            placeholder="이메일"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="block w-full rounded-2xl border-none bg-white dark:bg-[#1C1C1E] py-[18px] pl-12 pr-4 text-[16px] text-black dark:text-white placeholder:text-gray-400 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-0 focus:ring-2 focus:ring-[#34C759]/20 focus:shadow-lg transition-all duration-300 ease-out outline-none"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="group relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <IconLock className="text-gray-400 group-focus-within:text-[#34C759] transition-colors" size={22} />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="비밀번호"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="block w-full rounded-2xl border-none bg-white dark:bg-[#1C1C1E] py-[18px] pl-12 pr-12 text-[16px] text-black dark:text-white placeholder:text-gray-400 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-0 focus:ring-2 focus:ring-[#34C759]/20 focus:shadow-lg transition-all duration-300 ease-out outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#3C3C43] dark:hover:text-gray-200 transition-colors"
                        >
                            {showPassword ? <IconEyeOff size={22} /> : <IconEye size={22} />}
                        </button>
                    </div>

                    {mode === "signup" && (
                        <div className="group relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <IconPhone className="text-gray-400 group-focus-within:text-[#34C759] transition-colors" size={22} />
                            </div>
                            <input
                                type="tel"
                                placeholder="전화번호 (선택)"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                className="block w-full rounded-2xl border-none bg-white dark:bg-[#1C1C1E] py-[18px] pl-12 pr-4 text-[16px] text-black dark:text-white placeholder:text-gray-400 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-0 focus:ring-2 focus:ring-[#34C759]/20 focus:shadow-lg transition-all duration-300 ease-out outline-none"
                            />
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-600 dark:text-red-400 text-sm animate-fade-in">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-full bg-[#34C759] hover:bg-[#30B753] py-4 text-white text-[17px] font-bold tracking-wide shadow-lg shadow-[#34C759]/25 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : mode === "login" ? (
                            "로그인"
                        ) : (
                            "가입하기"
                        )}
                    </button>
                </form>

                {/* Forgot Password (Login only) */}
                {mode === "login" && (
                    <div className="mt-4">
                        <a href="#" className="text-[13px] font-semibold text-[#34C759] hover:text-[#30B753] transition-colors">
                            비밀번호를 잊으셨나요?
                        </a>
                    </div>
                )}

                {/* Divider */}
                <div className="relative w-full py-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-widest bg-[#F2F2F7] dark:bg-black">
                            또는
                        </span>
                    </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-4 w-full">
                    <button className="flex items-center justify-center gap-2.5 rounded-2xl bg-white dark:bg-[#1C1C1E] py-3.5 px-4 text-[15px] font-semibold text-black dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 active:scale-[0.98]">
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="currentColor" />
                        </svg>
                        <span>Apple</span>
                    </button>
                    <button className="flex items-center justify-center gap-2.5 rounded-2xl bg-white dark:bg-[#1C1C1E] py-3.5 px-4 text-[15px] font-semibold text-black dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 active:scale-[0.98]">
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span>Google</span>
                    </button>
                </div>

                {/* Toggle Link */}
                <div className="mt-8 text-center">
                    <p className="text-[#3C3C43] dark:text-gray-400 text-[15px]">
                        {mode === "login" ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}
                        <button
                            onClick={() => setMode(mode === "login" ? "signup" : "login")}
                            className="font-semibold text-[#34C759] hover:text-[#30B753] transition-colors ml-1"
                        >
                            {mode === "login" ? "회원가입" : "로그인"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
