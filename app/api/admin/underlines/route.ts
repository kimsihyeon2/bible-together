import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";

export async function GET(request: NextRequest) {
    try {
        // Get recent underlines/reading activities
        const { data: activities, error } = await supabase
            .from("reading_activities")
            .select(`
                id,
                user_id,
                cell_id,
                book,
                chapter,
                verse,
                activity_type,
                translation,
                text_content,
                created_at,
                profiles (name)
            `)
            .eq("activity_type", "UNDERLINE")
            .order("created_at", { ascending: false })
            .limit(50);

        if (error) {
            console.error("Underlines Error:", error);
            // Return mock data if table doesn't exist
            return NextResponse.json({
                underlines: [
                    {
                        id: "ul1",
                        userName: "Pastor Kim",
                        book: "여호수아",
                        chapter: 1,
                        verse: 9,
                        cellId: "c1",
                        createdAt: new Date().toISOString()
                    },
                ],
                source: "mock"
            });
        }

        const underlines = (activities || []).map((a: any) => ({
            id: a.id,
            userId: a.user_id,
            cellId: a.cell_id,
            userName: a.profiles?.name || "Unknown",
            book: a.book,
            chapter: a.chapter,
            verse: a.verse,
            translation: a.translation,
            textContent: a.text_content,
            createdAt: a.created_at
        }));

        return NextResponse.json({
            underlines,
            source: "database"
        });

    } catch (error: any) {
        console.error("Admin Underlines Error:", error);
        return NextResponse.json({
            underlines: [],
            source: "mock",
            error: error.message
        });
    }
}
