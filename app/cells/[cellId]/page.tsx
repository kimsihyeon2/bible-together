"use client";

import { useBibleStore } from "@/store/use-bible-store";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Container, Paper, Text, Group, ActionIcon, Stack, Drawer,
    SegmentedControl, Tooltip, Avatar, Affix, Transition
} from "@mantine/core";
import { useDisclosure, useWindowScroll } from "@mantine/hooks";
import { IconSettings, IconChevronLeft, IconHighlight, IconArrowUp } from "@tabler/icons-react";

export default function ReadingPage() {
    const params = useParams();
    const cellId = params.cellId as string;
    const router = useRouter();

    const {
        cells, translation, setTranslation,
        todayPlan, loadTodayPlan,
        toggleUnderline, underlines, me, verses // Using verses from store
    } = useBibleStore();

    const [opened, { open, close }] = useDisclosure(false);
    const [scroll, scrollTo] = useWindowScroll();

    useEffect(() => {
        loadTodayPlan(cellId);
    }, [cellId, translation, loadTodayPlan]);

    // If loading...
    if (!todayPlan) {
        return (
            <Container size="sm" py="xl" className="flex justify-center items-center min-h-[50vh]">
                <Text c="dimmed">Loading scripture...</Text>
            </Container>
        );
    }

    return (
        <>
            <ReadingHeader
                title={todayPlan.title}
                onBack={() => router.back()}
                onSettings={open}
            />

            <Container size="sm" py="xl" pb={100} className="font-serif">
                <Stack gap="xl">
                    {/* Passage Header */}
                    <div className="text-center mb-6">
                        <Text size="sm" c="dimmed" tt="uppercase" fw={700} style={{ letterSpacing: '1px' }} mb={8}>
                            Day {todayPlan.dayIndex}
                        </Text>
                        <Text size="xl" fw={900} style={{ fontFamily: 'var(--font-noto-serif-kr)' }}>
                            {todayPlan.passages[0].book} {todayPlan.passages[0].startChapter}장
                        </Text>
                    </div>

                    {/* Verses List */}
                    <Stack gap="md">
                        <AnimatePresence mode="popLayout">
                            {verses.map((verse) => (
                                <VerseItem
                                    key={`${verse.book}-${verse.chapter}-${verse.verse}-${verse.translation}`}
                                    verse={verse}
                                    underlines={underlines.filter(u =>
                                        u.book === verse.book &&
                                        u.chapter === verse.chapter &&
                                        u.verse === verse.verse &&
                                        u.translation === verse.translation
                                    )}
                                    onToggle={() => toggleUnderline(verse, cellId)}
                                    currentUserId={me?.id || ""}
                                    currentUserRole={me?.role || "MEMBER"}
                                />
                            ))}
                        </AnimatePresence>
                    </Stack>
                </Stack>
            </Container>

            {/* Settings Drawer */}
            <Drawer opened={opened} onClose={close} title="읽기 설정" position="bottom" size="sm" radius="md">
                <Stack>
                    <Text size="sm" fw={500}>성경 번역</Text>
                    <SegmentedControl
                        value={translation}
                        onChange={(val) => setTranslation(val as "KRV" | "EASY")}
                        data={[
                            { label: '개역개정', value: 'KRV' },
                            { label: '쉬운성경', value: 'EASY' },
                        ]}
                        fullWidth
                    />
                    <Text size="xs" c="dimmed">
                        번역을 변경하면 자동으로 본문이 업데이트됩니다.
                    </Text>
                </Stack>
            </Drawer>

            <Affix position={{ bottom: 80, right: 20 }}>
                <Transition transition="slide-up" mounted={scroll.y > 0}>
                    {(transitionStyles) => (
                        <ActionIcon
                            style={transitionStyles}
                            onClick={() => scrollTo({ y: 0 })}
                            size="lg"
                            variant="default"
                            radius="xl"
                        >
                            <IconArrowUp size={16} />
                        </ActionIcon>
                    )}
                </Transition>
            </Affix>
        </>
    );
}

// Sub-components
function ReadingHeader({ title, onBack, onSettings }: any) {
    return (
        <Paper
            pos="sticky"
            top={0}
            h={60}
            style={{ zIndex: 99, borderBottom: '1px solid var(--mantine-color-gray-2)' }}
            bg="rgba(255, 255, 255, 0.95)"
        >
            <Group justify="space-between" h="100%" px="md">
                <ActionIcon variant="subtle" color="gray" onClick={onBack}>
                    <IconChevronLeft size={24} />
                </ActionIcon>
                <Text size="sm" fw={600} lineClamp={1}>{title}</Text>
                <ActionIcon variant="subtle" color="gray" onClick={onSettings}>
                    <IconSettings size={22} />
                </ActionIcon>
            </Group>
        </Paper>
    );
}

function VerseItem({ verse, underlines, onToggle, currentUserId, currentUserRole }: any) {
    const isUnderlinedByMe = underlines.some((u: any) => u.userId === currentUserId);

    // Privacy Logic:
    // - If PASTOR, see everyone's underlines.
    // - If MEMBER, see only my own (so 'otherUnderlines' should be hidden or empty).
    // The user requested: "Everyone seeing everyone's is wrong. Only Admin should see."
    const isPastor = currentUserRole === "PASTOR";
    const otherUnderlines = isPastor
        ? underlines.filter((u: any) => u.userId !== currentUserId)
        : []; // Empty for normal members

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            layout
            whileTap={{ scale: 0.98 }}
        >
            <Group
                align="start"
                gap="xs"
                wrap="nowrap"
                onClick={onToggle}
                style={{
                    cursor: 'pointer',
                    padding: '12px 8px',
                    borderRadius: '8px',
                    backgroundColor: isUnderlinedByMe ? 'rgba(255, 237, 130, 0.4)' : 'transparent',
                    border: isUnderlinedByMe ? '1px solid rgba(255, 215, 0, 0.5)' : '1px solid transparent',
                    transition: 'all 0.2s ease-in-out'
                }}
                className="hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
            >
                <Group gap={4} align="start" w={30}>
                    <Text size="xs" ta="right" c="dimmed" mt={4} style={{ userSelect: 'none' }}>
                        {verse.verse}
                    </Text>
                    {isUnderlinedByMe && (
                        <IconHighlight size={14} className="text-yellow-500 mt-1" />
                    )}
                </Group>
                <div className="flex-1">
                    <Text
                        size="lg"
                        lh={1.8}
                        style={{
                            fontFamily: 'var(--font-noto-serif-kr)',
                            textDecorationLine: isUnderlinedByMe ? 'underline' : 'none',
                            textDecorationColor: 'rgba(255, 200, 0, 0.8)',
                            textDecorationThickness: '3px',
                            textUnderlineOffset: '4px'
                        }}
                    >
                        {verse.text}
                    </Text>

                    {/* Social Underlines */}
                    {otherUnderlines.length > 0 && (
                        <Group gap={4} mt={4}>
                            <IconHighlight size={12} className="text-yellow-500" />
                            <Avatar.Group spacing="sm">
                                {otherUnderlines.map((u: any) => (
                                    <Tooltip key={u.id} label={u.userName} withArrow>
                                        <Avatar size="sm" radius="xl" color="blue" variant="light">
                                            {u.userName.slice(0, 1)}
                                        </Avatar>
                                    </Tooltip>
                                ))}
                            </Avatar.Group>
                        </Group>
                    )}
                </div>
            </Group>
        </motion.div>
    );
}
