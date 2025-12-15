import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Cell, Underline, Translation, ReadingPlan, Verse } from "@/types";

interface BibleState {
    // User State
    me: User | null;
    setMe: (user: Partial<User>) => void;
    login: (email: string, password?: string) => Promise<{ success: boolean; message: string }>;
    signup: (email: string, password: string, name: string, phone?: string, cellCode?: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;

    // App State
    currentCellId: string | null;
    setCurrentCellId: (id: string | null) => void;
    translation: Translation;
    setTranslation: (t: Translation) => void;

    // Theme
    theme: "light" | "dark" | "system";
    setTheme: (t: "light" | "dark" | "system") => void;

    // Data (Mocked Backend)
    cells: Cell[];
    validInviteCodes: string[]; // List of valid invite codes
    joinCell: (code: string) => Promise<{ success: boolean; message: string }> | { success: boolean; message: string };

    // Reading Logic
    todayPlan: ReadingPlan | null;
    loadTodayPlan: (cellId: string) => void;
    verses: Verse[];

    // Interactive
    underlines: Underline[];
    toggleUnderline: (verse: Verse, cellId: string) => Promise<void> | void;
}

// Enhanced Cell Type with Progress
interface CellWithProgress extends Cell {
    progress?: number;
}

const MOCK_CELLS: CellWithProgress[] = [
    { id: "c1", name: "1셀 (청년부)", memberCount: 8, inviteCode: "YOUTH1", progress: 65 },
    { id: "c2", name: "2셀 (직장인)", memberCount: 12, inviteCode: "WORK2", progress: 42 },
];

// Valid invite codes database
const VALID_INVITE_CODES = ["YOUTH1", "YOUTH2", "WORK2", "FAMILY3", "NEWBIE", "PASTOR"];

const MOCK_PLAN: ReadingPlan = {
    dayIndex: 12,
    title: "여호수아 정복 전쟁 시작",
    passages: [{ book: "여호수아", startChapter: 1, startVerse: 1, endChapter: 1, endVerse: 9 }],
};

const MOCK_VERSES_KRV: Verse[] = [
    { book: "여호수아", chapter: 1, verse: 1, text: "여호와의 종 모세가 죽은 후에 여호와께서 모세의 수종자 눈의 아들 여호수아에게 말씀하여 이르시되", translation: "KRV" },
    { book: "여호수아", chapter: 1, verse: 2, text: "내 종 모세가 죽었으니 이제 너는 이 모든 백성과 더불어 일어나 이 요단을 건너 내가 그들 곧 이스라엘 자손에게 주는 그 땅으로 가라", translation: "KRV" },
    { book: "여호수아", chapter: 1, verse: 3, text: "내가 모세에게 말한 바와 같이 너희 발바닥으로 밟는 곳은 모두 내가 너희에게 주었노니", translation: "KRV" },
    { book: "여호수아", chapter: 1, verse: 4, text: "곧 광야와 이 레바논에서부터 큰 강 곧 유브라데 강까지 헷 족속의 온 땅과 또 해 지는 쪽 대해까지 너희의 영토가 되리라", translation: "KRV" },
    { book: "여호수아", chapter: 1, verse: 5, text: "네 평생에 너를 능히 대적할 자가 없으리니 내가 모세와 함께 있었던 것 같이 너와 함께 있을 것임이니라 내가 너를 떠나지 아니하며 버리지 아니하리니", translation: "KRV" },
    { book: "여호수아", chapter: 1, verse: 6, text: "강하고 담대하라 너는 내가 그들의 조상에게 맹세하여 그들에게 주리라 한 땅을 이 백성에게 차지하게 하리라", translation: "KRV" },
    { book: "여호수아", chapter: 1, verse: 7, text: "오직 강하고 지극히 담대하여 나의 종 모세가 네게 명령한 그 율법을 다 지켜 행하고 우로나 좌로나 치우치지 말라 그리하면 어디로 가든지 형통하리니", translation: "KRV" },
    { book: "여호수아", chapter: 1, verse: 8, text: "이 율법책을 네 입에서 떠나지 말게 하며 주야로 그것을 묵상하여 그 안에 기록된 대로 다 지켜 행하라 그리하면 네 길이 평탄하게 될 것이며 네가 형통하리라", translation: "KRV" },
    { book: "여호수아", chapter: 1, verse: 9, text: "내가 네게 명령한 것이 아니냐 강하고 담대하라 두려워하지 말며 놀라지 말라 네가 어디로 가든지 네 하나님 여호와가 너와 함께 하느니라 하시니라", translation: "KRV" },
];

// EASY Bible mock data (쉬운성경)
const MOCK_VERSES_EASY: Verse[] = [
    { book: "여호수아", chapter: 1, verse: 1, text: "주님의 종 모세가 죽은 뒤에, 주님께서 모세의 부하인 눈의 아들 여호수아에게 말씀하셨습니다.", translation: "EASY" },
    { book: "여호수아", chapter: 1, verse: 2, text: "\"내 종 모세가 죽었다. 이제 너는 이 모든 백성과 함께 일어나서 요단 강을 건너, 내가 이스라엘 백성에게 주는 땅으로 가거라.\"", translation: "EASY" },
    { book: "여호수아", chapter: 1, verse: 3, text: "\"내가 모세에게 말한 것처럼, 너희 발이 밟는 모든 곳을 내가 너희에게 주었다.\"", translation: "EASY" },
    { book: "여호수아", chapter: 1, verse: 4, text: "\"광야와 레바논에서부터 큰 강 유프라테스까지, 헷 족속의 모든 땅과 해 지는 쪽 대해까지 너희 땅이 될 것이다.\"", translation: "EASY" },
    { book: "여호수아", chapter: 1, verse: 5, text: "\"네가 살아 있는 동안 아무도 너를 이기지 못할 것이다. 내가 모세와 함께했던 것처럼 너와 함께할 것이다. 나는 너를 떠나지 않고 버리지 않을 것이다.\"", translation: "EASY" },
    { book: "여호수아", chapter: 1, verse: 6, text: "\"힘을 내고 용기를 가져라! 네가 이 백성에게 땅을 나누어 줄 것이다. 그 땅은 내가 너희 조상들에게 주겠다고 맹세한 땅이다.\"", translation: "EASY" },
    { book: "여호수아", chapter: 1, verse: 7, text: "\"오직 힘을 내고 큰 용기를 가져라. 나의 종 모세가 네게 명령한 모든 율법을 지키고 따라라. 좌우로 치우치지 말라. 그러면 네가 어디를 가든지 잘될 것이다.\"", translation: "EASY" },
    { book: "여호수아", chapter: 1, verse: 8, text: "\"이 율법책이 네 입에서 떠나지 않게 하고, 밤낮으로 그것을 묵상하여 그 안에 기록된 대로 다 지켜 행하라. 그러면 네 길이 형통하고 성공할 것이다.\"", translation: "EASY" },
    { book: "여호수아", chapter: 1, verse: 9, text: "\"내가 네게 명령하지 않았느냐? 힘을 내고 용기를 가져라! 두려워하지 말고 놀라지 말라. 네가 어디를 가든지 네 하나님 주님이 너와 함께할 것이다.\"", translation: "EASY" },
];

export const useBibleStore = create<BibleState>()(
    persist(
        (set, get) => ({
            // Update User Type definition in types.ts (Simulated here by updating initial state)
            // We need to update the Mock Data and State initialization

            me: null,
            setMe: (update) => set((state) => ({ me: state.me ? { ...state.me, ...update } : null })),
            logout: () => {
                // Clear user data and redirect to login
                set({ me: null, currentCellId: null });
                // Also sign out from Supabase if connected
                if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_SUPABASE_URL) {
                    import("@/utils/supabase/client").then(({ supabase }) => {
                        supabase.auth.signOut();
                    });
                }
            },

            currentCellId: null,
            setCurrentCellId: (id) => set({ currentCellId: id }),

            translation: "KRV",
            setTranslation: (t) => {
                // Update translation and swap verses accordingly
                const verses = t === "KRV" ? MOCK_VERSES_KRV : MOCK_VERSES_EASY;
                set({ translation: t, verses });
            },

            theme: "system",
            setTheme: (t) => {
                set({ theme: t });
                // Apply theme to document
                if (typeof window !== "undefined") {
                    const root = document.documentElement;
                    root.classList.remove("light", "dark");
                    if (t === "system") {
                        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                        root.classList.add(prefersDark ? "dark" : "light");
                    } else {
                        root.classList.add(t);
                    }
                }
            },

            login: async (email, password) => {
                if (!email || !password) return { success: false, message: "이메일과 비밀번호를 입력해주세요." };

                // Check for test/demo email patterns FIRST (before Supabase)
                const isTestEmail = email === "test@demo.com" ||
                    email.includes("@example.com") ||
                    email.includes("@test.com") ||
                    email.startsWith("test");

                if (isTestEmail) {
                    const testName = email.split("@")[0] || "TestUser";
                    // Determine role based on email pattern
                    const isAdmin = email.includes("admin") || email.includes("pastor");
                    const isLeader = email.includes("leader");
                    // Use UUID format for DB compatibility
                    const demoUUID = crypto.randomUUID();

                    set({
                        me: {
                            id: demoUUID,
                            name: testName,
                            role: isAdmin ? "PASTOR" : isLeader ? "LEADER" : "MEMBER",
                            myCellIds: ["c1"] // Pre-join first cell for testing
                        }
                    });
                    return { success: true, message: `데모 로그인 성공 (${isAdmin ? '관리자' : isLeader ? '리더' : '멤버'})` };
                }

                // Real Supabase auth for non-test emails
                try {
                    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
                        const { supabase } = await import("@/utils/supabase/client");

                        const { data, error } = await supabase.auth.signInWithPassword({
                            email,
                            password
                        });

                        if (error) {
                            console.error("Login Error:", error);
                            return { success: false, message: "이메일 또는 비밀번호가 일치하지 않습니다." };
                        }

                        if (data.user) {
                            // Fetch Profile & Cells (Shared Logic)
                            const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
                            const { data: memberships } = await supabase.from("cell_members").select("cell_id").eq("user_id", data.user.id);
                            const myCellIds = memberships?.map(m => m.cell_id) || [];

                            set({
                                me: {
                                    id: data.user.id,
                                    name: profile?.name || data.user.email?.split('@')[0] || "User",
                                    role: profile?.role || "MEMBER",
                                    avatarUrl: profile?.avatar_url,
                                    myCellIds
                                }
                            });
                            return { success: true, message: "로그인 성공" };
                        }
                    }
                } catch (e: any) {
                    console.error("Supabase Error:", e);
                }

                return { success: false, message: "DB 연동을 확인해주세요." };
            },

            signup: async (email, password, name, phone, cellCode) => {
                try {
                    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
                        const { supabase } = await import("@/utils/supabase/client");

                        const { data, error } = await supabase.auth.signUp({
                            email,
                            password,
                            options: {
                                data: { name, phone }
                            }
                        });

                        if (error) throw error;

                        if (data.user) {
                            // Create Profile
                            const { error: profileError } = await supabase.from("profiles").upsert({
                                id: data.user.id,
                                email,
                                name,
                                role: "MEMBER" // Default
                            });

                            if (profileError) console.error("Profile Create Error", profileError);

                            // Auto-join to selected cell if provided
                            let myCellIds: string[] = [];
                            if (cellCode) {
                                // Find cell by invite code
                                const { data: cellData } = await supabase
                                    .from("cells")
                                    .select("id")
                                    .eq("invite_code", cellCode)
                                    .single();

                                if (cellData) {
                                    // Add to cell_members
                                    await supabase.from("cell_members").upsert({
                                        cell_id: cellData.id,
                                        user_id: data.user.id
                                    });
                                    myCellIds = [cellData.id];
                                }
                            }

                            // Auto Login Set State
                            set({
                                me: {
                                    id: data.user.id,
                                    name,
                                    role: "MEMBER",
                                    avatarUrl: undefined,
                                    myCellIds
                                }
                            });
                            return { success: true, message: "회원가입 성공! 교구에 가입되었습니다." };
                        }
                    }
                } catch (e: any) {
                    console.error("Signup Error", e);
                    return { success: false, message: e.message || "회원가입 실패" };
                }
                return { success: false, message: "시스템 오류" };
            },

            cells: MOCK_CELLS,
            validInviteCodes: VALID_INVITE_CODES,
            joinCell: async (code) => {
                const { me } = get();
                if (!me) {
                    return { success: false, message: "로그인이 필요합니다." };
                }
                if (!code || !code.trim()) {
                    return { success: false, message: "초대 코드를 입력해주세요." };
                }
                const upperCode = code.toUpperCase().trim();

                // 1. Try Supabase
                try {
                    // Check local client env first to avoid crashing if not set
                    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
                        const { supabase } = await import("@/utils/supabase/client");

                        // Find cell
                        const { data: cell, error: cellError } = await supabase
                            .from("cells")
                            .select("*")
                            .eq("invite_code", upperCode)
                            .single();

                        if (cell) {
                            // Join
                            const { error: joinError } = await supabase
                                .from("cell_members")
                                .insert({ cell_id: cell.id, user_id: me.id });

                            if (!joinError) {
                                // Refresh cells
                                // const { data: myCells } = ... (omitted for brevity)

                                // Update local state for immediate feedback
                                set((state) => {
                                    if (!state.me) return state;
                                    return {
                                        me: { ...state.me, myCellIds: [...(state.me.myCellIds || []), cell.id] }
                                    };
                                });

                                return { success: true, message: "셀에 가입되었습니다! (DB)" };
                            }
                        }
                    }
                } catch (e) {
                    console.error("Supabase join failed, falling back to mock", e);
                }

                // 2. Fallback to Mock
                const { validInviteCodes, cells, me: currentUser } = get();

                // Check if code is valid
                if (!validInviteCodes.includes(upperCode)) {
                    return { success: false, message: "유효하지 않은 초대 코드입니다." };
                }

                // Find existing cell with this invite code
                const existingCell = cells.find((c) => c.inviteCode === upperCode);

                // Check if user already joined this cell
                const cellIdToCheck = existingCell?.id;
                const alreadyJoined = cellIdToCheck && currentUser?.myCellIds?.includes(cellIdToCheck);

                if (alreadyJoined) {
                    return { success: false, message: "이미 가입된 셀입니다." };
                }

                // If cell exists, just add user to it
                if (existingCell) {
                    set((state) => {
                        if (!state.me) return state;
                        return {
                            me: { ...state.me, myCellIds: [...(state.me.myCellIds || []), existingCell.id] }
                        };
                    });
                    return { success: true, message: `${existingCell.name}에 가입되었습니다!` };
                }

                // If cell doesn't exist, create new one
                const newCell: CellWithProgress = {
                    id: `c${Date.now()}`,
                    name: `새로운 셀 (${upperCode})`,
                    memberCount: 1,
                    inviteCode: upperCode,
                };

                // Update State: Add Cell AND Add to My Cells
                set((state) => {
                    if (!state.me) return state;
                    return {
                        cells: [...state.cells, newCell],
                        me: { ...state.me, myCellIds: [...(state.me.myCellIds || []), newCell.id] }
                    };
                });
                return { success: true, message: "셀에 가입되었습니다!" };
            },

            todayPlan: null,
            verses: [],
            loadTodayPlan: (cellId) => {
                const { translation } = get();
                const verses = translation === "KRV" ? MOCK_VERSES_KRV : MOCK_VERSES_EASY;
                // Simulate API delay
                setTimeout(() => {
                    set({ todayPlan: MOCK_PLAN, verses });
                }, 300);
            },

            underlines: [
                { id: "ul1", cellId: "c1", userId: "u2", userName: "Pastor Kim", book: "여호수아", chapter: 1, verse: 9, translation: "KRV", createdAt: new Date().toISOString() }
            ],
            toggleUnderline: async (verse, cellId) => {
                const { me, underlines } = get();

                if (!me) return;

                const existing = underlines.find(
                    (u) =>
                        u.cellId === cellId &&
                        u.book === verse.book &&
                        u.chapter === verse.chapter &&
                        u.verse === verse.verse &&
                        u.translation === verse.translation &&
                        u.userId === me.id
                );

                // Optimistic UI Update
                if (existing) {
                    set({ underlines: underlines.filter((u) => u.id !== existing.id) });
                } else {
                    const newUnderline: Underline = {
                        id: `ul${Date.now()}`,
                        cellId,
                        userId: me.id,
                        userName: me.name,
                        book: verse.book,
                        chapter: verse.chapter,
                        verse: verse.verse,
                        translation: verse.translation,
                        createdAt: new Date().toISOString(),
                    };
                    set({ underlines: [...underlines, newUnderline] });
                }

                // Sync with DB
                try {
                    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
                        const { supabase } = await import("@/utils/supabase/client");
                        if (existing) {
                            await supabase.from("reading_activities").delete().match({
                                user_id: me.id,
                                book: verse.book,
                                chapter: verse.chapter,
                                verse: verse.verse
                            });
                        } else {
                            await supabase.from("reading_activities").insert({
                                user_id: me.id,
                                cell_id: cellId,
                                book: verse.book,
                                chapter: verse.chapter,
                                verse: verse.verse,
                                activity_type: "UNDERLINE",
                                translation: verse.translation,
                                text_content: verse.text
                            });
                        }
                    }
                } catch (e) {
                    console.error("DB Sync failed", e);
                }
            },
        }),
        {
            name: "bible-together-storage",
            partialize: (state) => ({
                me: state.me,
                underlines: state.underlines,
                translation: state.translation,
            }),
        }
    )
);
