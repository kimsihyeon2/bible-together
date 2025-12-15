"use client";
import { useState, useEffect } from "react";
import { useBibleStore } from "@/store/use-bible-store";
import { useRouter } from "next/navigation";

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
        <div className="font-sans bg-background-light dark:bg-background-dark text-text-main dark:text-white min-h-screen flex flex-col items-center justify-center p-6 selection:bg-primary selection:text-white transition-colors duration-300">
            <div className="w-full max-w-[380px] mx-auto flex flex-col h-full justify-center relative z-10">

                {/* Logo Section */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="relative mb-6 group">
                        <div className="absolute inset-0 bg-primary rounded-[28px] blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                        <div className="relative w-[88px] h-[88px] bg-surface-light dark:bg-surface-dark rounded-[28px] shadow-card flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-[44px]">menu_book</span>
                        </div>
                    </div>
                    <h1 className="text-[28px] font-bold tracking-tight text-text-main dark:text-white mb-2">Bible Together</h1>
                    <p className="text-text-muted text-[15px] font-medium leading-relaxed">Join your community in daily<br />reading and reflection.</p>
                </div>

                {/* Mode Toggle (Custom Addition for Functionality) */}
                <div className="flex w-full bg-surface-light dark:bg-surface-dark rounded-full p-1 mb-6 shadow-card">
                    <button
                        onClick={() => setMode("login")}
                        className={`flex-1 py-2.5 rounded-full text-[14px] font-semibold transition-all duration-200 ${mode === "login"
                            ? "bg-primary text-white shadow-md"
                            : "text-text-muted hover:text-text-main"
                            }`}
                    >
                        Log In
                    </button>
                    <button
                        onClick={() => setMode("signup")}
                        className={`flex-1 py-2.5 rounded-full text-[14px] font-semibold transition-all duration-200 ${mode === "signup"
                            ? "bg-primary text-white shadow-md"
                            : "text-text-muted hover:text-text-main"
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Form */}
                <form className="w-full space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-4">

                        {mode === "signup" && (
                            <>
                                {/* Name Input */}
                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors text-[22px]">person</span>
                                    </div>
                                    <input
                                        className="block w-full rounded-2xl border-none bg-surface-light dark:bg-surface-dark py-[18px] pl-12 pr-4 text-[16px] text-text-main dark:text-white placeholder:text-gray-400 shadow-card ring-0 focus:ring-2 focus:ring-primary/20 focus:shadow-lg transition-all duration-300 ease-out"
                                        placeholder="Full Name"
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    />
                                </div>

                                {/* Cell Selection */}
                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                        <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors text-[22px]">church</span>
                                    </div>
                                    <select
                                        className="block w-full rounded-2xl border-none bg-surface-light dark:bg-surface-dark py-[18px] pl-12 pr-4 text-[16px] text-text-main dark:text-white shadow-card ring-0 focus:ring-2 focus:ring-primary/20 focus:shadow-lg transition-all duration-300 ease-out appearance-none cursor-pointer"
                                        value={form.cellCode}
                                        onChange={(e) => setForm({ ...form, cellCode: e.target.value })}
                                    >
                                        <option value="">Select Cell</option>
                                        {CELLS.map(cell => (
                                            <option key={cell.value} value={cell.value}>{cell.label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                                        <span className="material-symbols-outlined text-[20px]">expand_more</span>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Email Input */}
                        <div className="group relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors text-[22px]">mail</span>
                            </div>
                            <input
                                className="block w-full rounded-2xl border-none bg-surface-light dark:bg-surface-dark py-[18px] pl-12 pr-4 text-[16px] text-text-main dark:text-white placeholder:text-gray-400 shadow-card ring-0 focus:ring-2 focus:ring-primary/20 focus:shadow-lg transition-all duration-300 ease-out"
                                id="email"
                                placeholder="Email Address"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="group relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors text-[22px]">lock</span>
                            </div>
                            <input
                                className="block w-full rounded-2xl border-none bg-surface-light dark:bg-surface-dark py-[18px] pl-12 pr-12 text-[16px] text-text-main dark:text-white placeholder:text-gray-400 shadow-card ring-0 focus:ring-2 focus:ring-primary/20 focus:shadow-lg transition-all duration-300 ease-out"
                                id="password"
                                placeholder="Password"
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />
                            <button
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-text-secondary dark:hover:text-gray-200 transition-colors"
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <span className="material-symbols-outlined text-[22px]">
                                    {showPassword ? "visibility_off" : "visibility"}
                                </span>
                            </button>
                        </div>

                        {mode === "login" && (
                            <div className="flex justify-end">
                                <a className="text-[13px] font-semibold text-primary hover:text-primary-hover transition-colors" href="#">Forgot password?</a>
                            </div>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-600 dark:text-red-400 text-sm animate-fade-in">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button className="w-full rounded-full bg-primary hover:bg-primary-hover py-4 text-white text-[17px] font-bold tracking-wide shadow-lg shadow-primary/25 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed" disabled={loading}>
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            mode === "login" ? "Log In" : "Sign Up"
                        )}
                    </button>

                    {/* Divider */}
                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-background-light dark:bg-background-dark px-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Or</span>
                        </div>
                    </div>

                    {/* Social Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2.5 rounded-2xl bg-surface-light dark:bg-surface-dark py-3.5 px-4 text-[15px] font-semibold text-text-main dark:text-white shadow-card hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200" type="button">
                            <img alt="Apple" className="h-5 w-5 dark:invert" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAs6K7kDUlidjPoohBtvi0pB_QCCFCQ39m8IT9EoPsj25hC6Z2XLOQzciigQ_JgppxjdUpBQN9-U9oiDRIc7fAP8r-C3j-eBRR-boLzNZ86JIxDW2TzgAlMLK5-yc9YcOOHlS7Qh8R8A7N_72DCWhPCv7i2-I8AM66TBbybZdjV4s5Pv_CykUeR-wq6mr8FSCJ0npJSQDxwuAtGBvk324fV7cBcSLqDNywKD99vSLBORTIGwJR_-DPHL-vcsQjgOZYbhpQ2dDWVs6x9" />
                            <span>Apple</span>
                        </button>
                        <button className="flex items-center justify-center gap-2.5 rounded-2xl bg-surface-light dark:bg-surface-dark py-3.5 px-4 text-[15px] font-semibold text-text-main dark:text-white shadow-card hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200" type="button">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                            </svg>
                            <span>Google</span>
                        </button>
                    </div>
                </form>

                <div className="mt-auto pt-8 text-center">
                    <p className="text-text-secondary dark:text-gray-400 text-[15px]">
                        {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                        <button
                            className="font-semibold text-primary hover:text-primary-hover transition-colors ml-1"
                            onClick={() => setMode(mode === "login" ? "signup" : "login")}
                        >
                            {mode === "login" ? "Sign Up" : "Log In"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
