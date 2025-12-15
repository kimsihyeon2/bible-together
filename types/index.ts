export type Role = "MEMBER" | "PASTOR" | "LEADER";
export type Translation = "KRV" | "EASY";

export interface User {
    id: string;
    name: string;
    role: Role;
    avatarUrl?: string; // Optional
    myCellIds?: string[]; // Optional for backward compatibility
}

export type Cell = {
    id: string;
    name: string;
    inviteCode?: string;
    memberCount: number; // For dashboard
};

export type Passage = {
    book: string;
    startChapter: number;
    startVerse: number;
    endChapter: number;
    endVerse: number;
};

export type ReadingPlan = {
    dayIndex: number;
    title: string;
    passages: Passage[];
};

export type Verse = {
    book: string;
    chapter: number;
    verse: number;
    text: string;
    translation: Translation;
};

export type Underline = {
    id: string;
    cellId: string;
    userId: string;
    userName: string; // Denormalized for rapid display
    book: string;
    chapter: number;
    verse: number;
    translation: Translation;
    createdAt: string;
};

export type ReadingProgress = {
    cellId: string;
    userId: string;
    dayIndex: number;
    completedAt: string;
};

export type Notification = {
    id: string;
    title: string;
    body: string;
    target: 'ALL' | 'LEADER' | 'CELL';
    createdBy?: string;
    cellId?: string;
    createdAt: string;
    read?: boolean;
};
