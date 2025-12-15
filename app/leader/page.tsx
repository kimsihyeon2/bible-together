"use client";

import { useEffect, useState } from "react";
import { useBibleStore } from "@/store/use-bible-store";
import { useRouter } from "next/navigation";
import {
    Container, Title, Text, Paper, Stack, Group, Button, Badge,
    TextInput, Modal, CopyButton, ActionIcon, Tooltip, Table, Card, Loader, Center
} from "@mantine/core";
import { IconCopy, IconCheck, IconPlus, IconUsers, IconShare } from "@tabler/icons-react";

// 초대코드 생성 함수
function generateInviteCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export default function LeaderPage() {
    const { me, cells } = useBibleStore();
    const router = useRouter();
    const [isHydrated, setIsHydrated] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [newCellName, setNewCellName] = useState("");
    const [loading, setLoading] = useState(false);
    const [myCells, setMyCells] = useState<any[]>([]);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (isHydrated && (!me || (me.role !== "LEADER" && me.role !== "PASTOR"))) {
            router.replace("/cells");
        }
    }, [me, router, isHydrated]);

    useEffect(() => {
        // Load cells managed by this user (or all for PASTOR)
        const loadCells = async () => {
            if (!me) return;
            try {
                const { supabase } = await import("@/utils/supabase/client");
                let query = supabase.from("cells").select("*");

                // PASTOR sees all, LEADER sees their cells
                if (me.role === "LEADER") {
                    query = query.in("id", me.myCellIds || []);
                }

                const { data } = await query;
                setMyCells(data || []);
            } catch (e) {
                console.error("Failed to load cells", e);
                // Fallback to local cells
                setMyCells(cells.filter(c => me?.myCellIds?.includes(c.id)));
            }
        };
        loadCells();
    }, [me, cells]);

    const handleCreateCell = async () => {
        if (!newCellName.trim()) return;
        setLoading(true);

        try {
            const { supabase } = await import("@/utils/supabase/client");
            const inviteCode = generateInviteCode();

            const { data, error } = await supabase.from("cells").insert({
                name: newCellName,
                invite_code: inviteCode
            }).select().single();

            if (error) throw error;

            setMyCells([...myCells, data]);
            setCreateModalOpen(false);
            setNewCellName("");
        } catch (e) {
            console.error("Failed to create cell", e);
        } finally {
            setLoading(false);
        }
    };

    if (!isHydrated) {
        return <Center h="50vh"><Loader /></Center>;
    }

    if (!me || (me.role !== "LEADER" && me.role !== "PASTOR")) {
        return null;
    }

    return (
        <Container size="sm" py="xl">
            <Stack gap="lg">
                <Group justify="space-between" align="center">
                    <div>
                        <Title order={2}>셀 관리</Title>
                        <Text c="dimmed" size="sm">
                            {me.role === "PASTOR" ? "모든 셀 관리" : "내가 관리하는 셀"}
                        </Text>
                    </div>
                    {me.role === "PASTOR" && (
                        <Button
                            leftSection={<IconPlus size={16} />}
                            onClick={() => setCreateModalOpen(true)}
                        >
                            새 셀 만들기
                        </Button>
                    )}
                </Group>

                {myCells.length === 0 ? (
                    <Paper p="xl" withBorder ta="center">
                        <IconUsers size={48} opacity={0.3} />
                        <Text c="dimmed" mt="md">관리 중인 셀이 없습니다</Text>
                    </Paper>
                ) : (
                    <Stack gap="md">
                        {myCells.map((cell) => (
                            <Card key={cell.id} withBorder padding="lg" radius="md">
                                <Group justify="space-between" align="flex-start">
                                    <div>
                                        <Text fw={600} size="lg">{cell.name}</Text>
                                        <Group gap="xs" mt="xs">
                                            <Badge variant="light" color="blue">
                                                초대코드: {cell.invite_code}
                                            </Badge>
                                            <CopyButton value={cell.invite_code} timeout={2000}>
                                                {({ copied, copy }) => (
                                                    <Tooltip label={copied ? "복사됨!" : "초대코드 복사"}>
                                                        <ActionIcon
                                                            color={copied ? "teal" : "blue"}
                                                            variant="subtle"
                                                            onClick={copy}
                                                        >
                                                            {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                                                        </ActionIcon>
                                                    </Tooltip>
                                                )}
                                            </CopyButton>
                                        </Group>
                                    </div>
                                    <Button
                                        variant="light"
                                        size="sm"
                                        leftSection={<IconShare size={14} />}
                                        onClick={() => {
                                            const url = `${window.location.origin}/login?code=${cell.invite_code}`;
                                            navigator.share?.({
                                                title: `${cell.name} 셀 초대`,
                                                text: `${cell.name}에 가입하세요! 초대코드: ${cell.invite_code}`,
                                                url
                                            }) || navigator.clipboard.writeText(url);
                                        }}
                                    >
                                        공유
                                    </Button>
                                </Group>

                                <Text size="sm" c="dimmed" mt="md">
                                    멤버 수: {cell.memberCount || "-"} | 진행률: {cell.progress || "-"}%
                                </Text>
                            </Card>
                        ))}
                    </Stack>
                )}
            </Stack>

            {/* 새 셀 만들기 모달 */}
            <Modal
                opened={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                title="새 셀 만들기"
            >
                <Stack>
                    <TextInput
                        label="셀 이름"
                        placeholder="예: 1셀 (청년부)"
                        value={newCellName}
                        onChange={(e) => setNewCellName(e.target.value)}
                    />
                    <Text size="sm" c="dimmed">
                        초대코드가 자동으로 생성됩니다
                    </Text>
                    <Button
                        onClick={handleCreateCell}
                        loading={loading}
                        disabled={!newCellName.trim()}
                    >
                        생성하기
                    </Button>
                </Stack>
            </Modal>
        </Container>
    );
}
