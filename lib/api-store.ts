// Shared in-memory store for API routes (simulates database)
// In production, this would be replaced with actual database queries

export type Translation = "KRV" | "EASY";
export type Theme = "light" | "dark" | "system";

interface Cell {
    id: string;
    name: string;
    inviteCode: string;
    memberCount: number;
}

interface Underline {
    id: string;
    cellId: string;
    userId: string;
    userName: string;
    book: string;
    chapter: number;
    verse: number;
    translation: Translation;
    createdAt: string;
}

interface UserSession {
    id: string;
    name: string;
    translation: Translation;
    theme: Theme;
    cells: string[]; // cell IDs the user has joined
}

// Valid invite codes
export const VALID_INVITE_CODES = ["YOUTH1", "YOUTH2", "WORK2", "FAMILY3", "NEWBIE", "PASTOR", "VALIDCODE"];

// In-memory cells database
export const cellsDB: Cell[] = [
    { id: "c1", name: "1셀 (청년부)", inviteCode: "YOUTH1", memberCount: 8 },
    { id: "c2", name: "2셀 (직장인)", inviteCode: "WORK2", memberCount: 12 },
];

// In-memory underlines database
export const underlinesDB: Underline[] = [];

// In-memory user session (simplified - would use cookies/JWT in production)
export const userSession: UserSession = {
    id: "u1",
    name: "Guest User",
    translation: "KRV",
    theme: "system",
    cells: ["c1", "c2"],
};

// Mock Bible data
export const MOCK_VERSES_KRV = [
    { book: "여호수아", chapter: 1, verse: 1, text: "여호와의 종 모세가 죽은 후에...", translation: "KRV" },
    { book: "여호수아", chapter: 1, verse: 2, text: "내 종 모세가 죽었으니...", translation: "KRV" },
    { book: "여호수아", chapter: 1, verse: 9, text: "내가 네게 명령한 것이 아니냐...", translation: "KRV" },
];

export const MOCK_VERSES_EASY = [
    { book: "여호수아", chapter: 1, verse: 1, text: "주님의 종 모세가 죽은 뒤에...", translation: "EASY" },
    { book: "여호수아", chapter: 1, verse: 2, text: "내 종 모세가 죽었다...", translation: "EASY" },
    { book: "여호수아", chapter: 1, verse: 9, text: "내가 네게 명령하지 않았느냐...", translation: "EASY" },
];

export const MOCK_PLAN = {
    dayIndex: 12,
    title: "여호수아 정복 전쟁 시작",
    passages: [{ book: "여호수아", startChapter: 1, startVerse: 1, endChapter: 1, endVerse: 9 }],
};
