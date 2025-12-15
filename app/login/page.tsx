"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBibleStore } from "@/store/use-bible-store";
import { TextInput, PasswordInput, Button, Paper, Title, Text, Container, Stack, Alert, SegmentedControl, Select } from "@mantine/core";
import { IconAlertCircle, IconBuildingChurch } from "@tabler/icons-react";

// 교구 목록 (Supabase cells 테이블과 동기화)
const CELLS = [
    { value: "FAITH", label: "믿음 교구" },
    { value: "HOPE", label: "소망 교구" },
    { value: "LOVE", label: "레브 교구" },
];

export default function LoginPage() {
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [form, setForm] = useState({ email: "", password: "", name: "", phone: "", cellCode: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { login, signup } = useBibleStore();

    const handleSubmit = async () => {
        setError(null);
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
        <Container size="xs" h="100vh" className="flex items-center justify-center">
            <Paper p="xl" radius="md" withBorder w="100%">
                <Stack gap="md">
                    <div className="text-center">
                        <Title order={2} fw={700} c="blue">Bible Together</Title>
                        <Text c="dimmed" size="sm" mt={4}>
                            함께 읽고, 함께 성장하는 공동체
                        </Text>
                    </div>

                    <SegmentedControl
                        value={mode}
                        onChange={(val) => setMode(val as "login" | "signup")}
                        data={[
                            { label: "로그인", value: "login" },
                            { label: "회원가입", value: "signup" },
                        ]}
                    />

                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        <Stack>
                            {mode === "signup" && (
                                <>
                                    <TextInput
                                        label="이름"
                                        placeholder="실명 또는 닉네임"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        required
                                    />
                                    <Select
                                        label="소속 교구"
                                        placeholder="교구를 선택해주세요"
                                        leftSection={<IconBuildingChurch size={16} />}
                                        data={CELLS}
                                        value={form.cellCode}
                                        onChange={(val) => setForm({ ...form, cellCode: val || "" })}
                                        required
                                    />
                                    <TextInput
                                        label="휴대폰 번호 (선택)"
                                        placeholder="010-1234-5678"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    />
                                </>
                            )}

                            <TextInput
                                label="이메일"
                                placeholder="example@email.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                                type="email"
                            />

                            <PasswordInput
                                label="비밀번호"
                                placeholder="비밀번호 입력"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                            />

                            {error && (
                                <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
                                    {error}
                                </Alert>
                            )}

                            <Button type="submit" fullWidth mt="md" size="md" loading={loading}>
                                {mode === "signup" ? "가입하기" : "로그인"}
                            </Button>
                        </Stack>
                    </form>
                </Stack>
            </Paper>
        </Container>
    );
}

