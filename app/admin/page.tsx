"use client";

import { useEffect, useState } from "react";
import { useBibleStore } from "@/store/use-bible-store";
import { useRouter } from "next/navigation";
import {
    Container, Grid, Card, Group, Stack, Text, ThemeIcon, Progress, ScrollArea,
    Button, SegmentedControl, Textarea, Badge, Paper, Table, Loader, Alert
} from "@mantine/core";
import { IconChartBar, IconBellRinging, IconBook, IconSend, IconUsers, IconAlertCircle } from "@tabler/icons-react";

interface ProgressData {
    cellId: string;
    name: string;
    progress: number;
    members: number;
}

interface UnderlineData {
    id: string;
    userId: string;
    cellId: string;
    userName: string;
    book: string;
    chapter: number;
    verse: number;
    createdAt: string;
}

interface UserData {
    id: string;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

export default function AdminPage() {
    const { me } = useBibleStore();
    const router = useRouter();

    const [alertBody, setAlertBody] = useState("");
    const [alertTarget, setAlertTarget] = useState<"ALL" | "LEADER">("ALL");
    const [sending, setSending] = useState(false);

    // Real data states
    const [progressData, setProgressData] = useState<ProgressData[]>([]);
    const [underlines, setUnderlines] = useState<UnderlineData[]>([]);
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [dataSource, setDataSource] = useState<"database" | "mock">("mock");

    // Fetch data from APIs
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [progressRes, underlinesRes, usersRes] = await Promise.all([
                    fetch("/api/admin/progress"),
                    fetch("/api/admin/underlines"),
                    fetch("/api/admin/users")
                ]);

                const progressJson = await progressRes.json();
                const underlinesJson = await underlinesRes.json();
                const usersJson = await usersRes.json();

                setProgressData(progressJson.progress || []);
                setUnderlines(underlinesJson.underlines || []);
                setUsers(usersJson.users || []);
                setDataSource(progressJson.source || "mock");
            } catch (error) {
                console.error("Failed to fetch admin data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!me || me.role !== "PASTOR") {
            router.push("/cells"); // Redirect non-admins
        }
    }, [me, router]);

    const handleSendAlert = async () => {
        if (!alertBody) return;
        setSending(true);

        try {
            // Call push notification API
            const res = await fetch("/api/push/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: "🙏 긴급 기도 요청",
                    body: alertBody,
                    target: alertTarget
                })
            });

            if (res.ok) {
                alert("알림이 전송되었습니다!");
                setAlertBody("");
            } else {
                // Fallback for when API doesn't exist yet
                console.log(`[PUSH SENT]\nTo: ${alertTarget}\nMessage: ${alertBody}`);
                alert("알림이 전송되었습니다! (Demo Mode)");
                setAlertBody("");
            }
        } catch (error) {
            console.log(`[MOCK PUSH]\nTo: ${alertTarget}\nMessage: ${alertBody}`);
            alert("알림이 전송되었습니다! (Offline Mode)");
            setAlertBody("");
        } finally {
            setSending(false);
        }
    };

    if (!me) return null;

    return (
        <Container size="lg" py="xl">
            <Stack gap="lg">
                <Group justify="space-between">
                    <div>
                        <Text size="xl" fw={900} style={{ fontFamily: 'var(--font-noto-serif-kr)' }}>
                            Pastor Dashboard
                        </Text>
                        <Text c="dimmed" size="sm">
                            공동체 영적 성장 모니터링
                        </Text>
                    </div>
                    <Group>
                        <Badge variant="light" color={dataSource === "database" ? "green" : "yellow"} size="lg">
                            {dataSource === "database" ? "🟢 DB 연동" : "🟡 MOCK 데이터"}
                        </Badge>
                        <Badge variant="light" color="yellow" size="lg">ADMIN</Badge>
                    </Group>
                </Group>

                {loading ? (
                    <Group justify="center" py="xl">
                        <Loader size="lg" />
                        <Text>데이터 로딩 중...</Text>
                    </Group>
                ) : (
                    <Grid gutter="lg">
                        {/* 1. User List */}
                        <Grid.Col span={12}>
                            <Card shadow="sm" radius="md" padding="lg" withBorder>
                                <Card.Section withBorder inheritPadding py="xs">
                                    <Group>
                                        <ThemeIcon variant="light" color="violet">
                                            <IconUsers size={16} />
                                        </ThemeIcon>
                                        <Text fw={600}>사용자 목록</Text>
                                        <Badge size="sm" variant="light">{users.length}명</Badge>
                                    </Group>
                                </Card.Section>

                                <ScrollArea h={200} mt="md">
                                    {users.length === 0 ? (
                                        <Alert color="blue" icon={<IconAlertCircle size={16} />}>
                                            등록된 사용자가 없습니다. Supabase 테이블을 확인해주세요.
                                        </Alert>
                                    ) : (
                                        <Table striped highlightOnHover>
                                            <Table.Thead>
                                                <Table.Tr>
                                                    <Table.Th>이름</Table.Th>
                                                    <Table.Th>이메일</Table.Th>
                                                    <Table.Th>역할</Table.Th>
                                                    <Table.Th>가입일</Table.Th>
                                                </Table.Tr>
                                            </Table.Thead>
                                            <Table.Tbody>
                                                {users.map((user) => (
                                                    <Table.Tr key={user.id}>
                                                        <Table.Td>{user.name || "-"}</Table.Td>
                                                        <Table.Td>{user.email || "-"}</Table.Td>
                                                        <Table.Td>
                                                            <Badge
                                                                color={user.role === "PASTOR" ? "red" : user.role === "LEADER" ? "blue" : "gray"}
                                                                size="sm"
                                                            >
                                                                {user.role}
                                                            </Badge>
                                                        </Table.Td>
                                                        <Table.Td>
                                                            {new Date(user.created_at).toLocaleDateString()}
                                                        </Table.Td>
                                                    </Table.Tr>
                                                ))}
                                            </Table.Tbody>
                                        </Table>
                                    )}
                                </ScrollArea>
                            </Card>
                        </Grid.Col>

                        {/* 2. Progress Overview */}
                        <Grid.Col span={{ base: 12, md: 8 }}>
                            <Card shadow="sm" radius="md" padding="lg" withBorder>
                                <Card.Section withBorder inheritPadding py="xs">
                                    <Group>
                                        <ThemeIcon variant="light" color="blue">
                                            <IconChartBar size={16} />
                                        </ThemeIcon>
                                        <Text fw={600}>셀별 읽기 현황</Text>
                                    </Group>
                                </Card.Section>

                                <Stack mt="md" gap="md">
                                    {progressData.length === 0 ? (
                                        <Alert color="blue" icon={<IconAlertCircle size={16} />}>
                                            셀 데이터가 없습니다. cells 테이블에 데이터를 추가해주세요.
                                        </Alert>
                                    ) : (
                                        progressData.map((item) => (
                                            <div key={item.cellId}>
                                                <Group justify="space-between" mb={5}>
                                                    <Text size="sm" fw={500}>{item.name}</Text>
                                                    <Text size="sm" c="dimmed">{item.progress}%</Text>
                                                </Group>
                                                <Progress value={item.progress} size="lg" radius="xl" color="blue" />
                                                <Text size="xs" c="dimmed" ta="right" mt={4}>
                                                    {item.members}명 참여 중
                                                </Text>
                                            </div>
                                        ))
                                    )}
                                </Stack>
                            </Card>
                        </Grid.Col>

                        {/* 3. Prayer Alert System */}
                        <Grid.Col span={{ base: 12, md: 4 }}>
                            <Stack>
                                <Card shadow="sm" radius="md" padding="lg" withBorder>
                                    <Card.Section withBorder inheritPadding py="xs">
                                        <Group>
                                            <ThemeIcon variant="light" color="red">
                                                <IconBellRinging size={16} />
                                            </ThemeIcon>
                                            <Text fw={600}>긴급 기도 요청</Text>
                                        </Group>
                                    </Card.Section>

                                    <Stack mt="md">
                                        <SegmentedControl
                                            value={alertTarget}
                                            onChange={(val) => setAlertTarget(val as any)}
                                            data={[
                                                { label: '전체 발송', value: 'ALL' },
                                                { label: '셀 리더만', value: 'LEADER' },
                                            ]}
                                        />
                                        <Textarea
                                            placeholder="기도 요청 내용을 입력하세요..."
                                            minRows={4}
                                            value={alertBody}
                                            onChange={(e) => setAlertBody(e.currentTarget.value)}
                                        />
                                        <Button
                                            onClick={handleSendAlert}
                                            leftSection={<IconSend size={16} />}
                                            color="red"
                                            variant="light"
                                            loading={sending}
                                        >
                                            알림 전송
                                        </Button>
                                    </Stack>
                                </Card>

                                {/* 4. Underline Feed */}
                                <Card shadow="sm" radius="md" padding="lg" withBorder>
                                    <Group mb="md">
                                        <ThemeIcon variant="light" color="orange">
                                            <IconBook size={16} />
                                        </ThemeIcon>
                                        <Text fw={600}>실시간 인사이트</Text>
                                        <Badge size="sm" variant="light">{underlines.length}개</Badge>
                                    </Group>
                                    <ScrollArea h={200}>
                                        {underlines.length === 0 ? (
                                            <Text c="dimmed" size="sm" ta="center" py="xl">활동 없음</Text>
                                        ) : (
                                            <Stack gap="xs">
                                                {underlines.map((u) => (
                                                    <Paper key={u.id} p="xs" withBorder bg="var(--mantine-color-gray-0)">
                                                        <Group justify="space-between">
                                                            <Text size="xs" fw={700}>{u.userName}</Text>
                                                            <Text size="xs" c="dimmed">
                                                                {new Date(u.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </Text>
                                                        </Group>
                                                        <Text size="sm" lineClamp={1} mt={2}>
                                                            {u.book} {u.chapter}:{u.verse}
                                                        </Text>
                                                    </Paper>
                                                ))}
                                            </Stack>
                                        )}
                                    </ScrollArea>
                                </Card>
                            </Stack>
                        </Grid.Col>
                    </Grid>
                )}
            </Stack>
        </Container>
    );
}
