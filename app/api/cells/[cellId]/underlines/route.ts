import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// In-memory store for underlines (for testing purposes)
const underlineStore: Map<string, any[]> = new Map();

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ cellId: string }> }
) {
    try {
        const { cellId } = await params;
        const body = await request.json();
        const { book, chapter, verse, translation } = body;

        // Get user ID from header (for multi-user testing)
        const userId = request.headers.get("X-User-Id") || "anonymous";

        // Validate required fields
        if (!book || !chapter || !verse) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Try Supabase integration
        try {
            const supabase = await createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // Check if underline exists
                const { data: existing } = await supabase
                    .from("reading_activities")
                    .select("*")
                    .eq("user_id", user.id)
                    .eq("cell_id", cellId)
                    .eq("book", book)
                    .eq("chapter", chapter)
                    .eq("verse", verse)
                    .single();

                if (existing) {
                    // Remove underline (toggle off)
                    await supabase
                        .from("reading_activities")
                        .delete()
                        .eq("id", existing.id);

                    return NextResponse.json({
                        success: true,
                        action: "removed",
                        message: "밑줄이 제거되었습니다."
                    });
                } else {
                    // Add underline (toggle on)
                    await supabase
                        .from("reading_activities")
                        .insert({
                            user_id: user.id,
                            cell_id: cellId,
                            book,
                            chapter,
                            verse,
                            activity_type: "UNDERLINE",
                            translation: translation || "KRV"
                        });

                    return NextResponse.json({
                        success: true,
                        action: "added",
                        message: "밑줄이 추가되었습니다."
                    });
                }
            }
        } catch (dbError) {
            console.error("DB Error:", dbError);
            // Fall through to mock response
        }

        // Mock response for testing
        const key = `${cellId}-${userId}-${book}-${chapter}-${verse}`;
        const cellUnderlines = underlineStore.get(cellId) || [];

        const existingIndex = cellUnderlines.findIndex(
            u => u.userId === userId && u.book === book && u.chapter === chapter && u.verse === verse
        );

        if (existingIndex >= 0) {
            // Remove
            cellUnderlines.splice(existingIndex, 1);
            underlineStore.set(cellId, cellUnderlines);
            return NextResponse.json({
                success: true,
                action: "removed",
                message: "밑줄이 제거되었습니다. (Mock)"
            });
        } else {
            // Add
            cellUnderlines.push({
                id: `ul_${Date.now()}`,
                userId,
                book,
                chapter,
                verse,
                translation: translation || "KRV",
                createdAt: new Date().toISOString()
            });
            underlineStore.set(cellId, cellUnderlines);
            return NextResponse.json({
                success: true,
                action: "added",
                message: "밑줄이 추가되었습니다. (Mock)"
            });
        }

    } catch (error: any) {
        console.error("Underline Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "서버 오류" },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ cellId: string }> }
) {
    try {
        const { cellId } = await params;
        const underlines = underlineStore.get(cellId) || [];

        return NextResponse.json({
            success: true,
            underlines
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
