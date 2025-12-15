"use client";

import { useBibleStore } from "@/store/use-bible-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconUsers, IconPlus, IconArrowRight, IconAlertCircle } from "@tabler/icons-react";
import {
    Title, Text, TextInput, Button, Paper, Group, Stack, Badge,
    Container, ThemeIcon, Alert, Card, Loader, Center
} from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";

export default function CellsPage() {
    const { me, cells, joinCell } = useBibleStore();
    // Filter cells to show only those explicitly joined by the user
    const myCells = cells.filter(cell => me?.myCellIds?.includes(cell.id));

    const [inviteCode, setInviteCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [isHydrated, setIsHydrated] = useState(false);
    const router = useRouter();

    // Wait for hydration before checking auth
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (isHydrated && !me) {
            router.push("/login");
        }
    }, [me, router, isHydrated]);

    const handleJoin = () => {
        if (!inviteCode.trim()) {
            setFeedback({ type: "error", message: "초대 코드를 입력해주세요." });
            return;
        }

        setLoading(true);
        setTimeout(async () => {
            const result = await joinCell(inviteCode);

            if (result.success) {
                setFeedback({ type: "success", message: result.message });
                setInviteCode("");
            } else {
                setFeedback({ type: "error", message: result.message });
            }
            setLoading(false);
        }, 600);
    };

    useEffect(() => {
        if (feedback) {
            const timer = setTimeout(() => setFeedback(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [feedback]);

    // Show loading while hydrating
    if (!isHydrated) {
        return (
            <Center h="50vh">
                <Loader size="lg" />
            </Center>
        );
    }

    if (!me) return null;

    return (
        <Container size="sm" py="xl">
            <Stack gap="xl">
                {/* Welcome Header */}
                <div>
                    <Title order={2} fw={700}>
                        반가워요, <Text span c="blue" inherit>{me.name}</Text>님!
                    </Title>
                    <Text c="dimmed" size="sm" mt={4}>
                        오늘도 함께 말씀을 읽으며 성장해봐요.
                    </Text>
                </div>

                {/* Joined Cells */}
                <div>
                    <Group justify="space-between" mb="md">
                        <Title order={4}>내 공동체</Title>
                        <Badge variant="light" size="lg">{myCells.length}개</Badge>
                    </Group>

                    {myCells.length === 0 ? (
                        <Alert color="blue" title="가입된 공동체가 없습니다" icon={<IconAlertCircle size={16} />}>
                            아래에서 초대 코드를 입력하여 공동체에 참여해보세요.
                        </Alert>
                    ) : (
                        <Stack gap="md">
                            {myCells.map((cell) => (
                                <Card
                                    key={cell.id}
                                    padding="lg"
                                    radius="lg"
                                    withBorder
                                    component="button"
                                    onClick={() => router.push(`/cells/${cell.id}`)}
                                    className="hover:shadow-md transition-shadow cursor-pointer text-left w-full group"
                                >
                                    <Group justify="space-between" align="start">
                                        <Group gap="md">
                                            <ThemeIcon size="xl" radius="md" variant="light" color="blue">
                                                <IconUsers size={24} />
                                            </ThemeIcon>
                                            <div>
                                                <Text fw={600} size="lg">{cell.name}</Text>
                                                <Group gap="xs" mt={4}>
                                                    <IconUsers size={14} className="text-gray-500" />
                                                    <Text size="sm" c="dimmed">{cell.memberCount}명의 멤버</Text>

                                                    {/* Progress Badge */}
                                                    {(cell as any).progress !== undefined && (
                                                        <Badge color="blue" variant="light" size="sm" ml="auto">
                                                            진도율 {(cell as any).progress}%
                                                        </Badge>
                                                    )}
                                                </Group>
                                            </div>
                                        </Group>
                                        <IconArrowRight className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                                    </Group>
                                </Card>
                            ))}
                        </Stack>
                    )}
                </div>

                {/* Join New Cell */}
                <Paper p="xl" radius="lg" bg="var(--mantine-color-gray-0)" withBorder>
                    <Stack gap="md">
                        <Group gap="xs">
                            <ThemeIcon variant="light" color="teal" size="md">
                                <IconPlus size={16} />
                            </ThemeIcon>
                            <Text fw={600}>새로운 공동체 참여하기</Text>
                        </Group>

                        <Group align="start">
                            <TextInput
                                placeholder="초대 코드 입력 (예: YOUTH1)"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value)}
                                size="md"
                                radius="md"
                                className="flex-1"
                                error={feedback?.type === "error"}
                            />
                            <Button
                                onClick={handleJoin}
                                loading={loading}
                                color="teal"
                                size="md"
                                radius="md"
                            >
                                참여
                            </Button>
                        </Group>

                        <AnimatePresence>
                            {feedback && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <Alert
                                        variant="light"
                                        color={feedback.type === "success" ? "teal" : "red"}
                                        title={feedback.type === "success" ? "성공!" : "오류"}
                                        icon={<IconAlertCircle size={16} />}
                                    >
                                        {feedback.message}
                                    </Alert>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Stack>
                </Paper>
            </Stack>
        </Container>
    );
}
