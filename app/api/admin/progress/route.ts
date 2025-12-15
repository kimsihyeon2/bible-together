import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";

export async function GET(request: NextRequest) {
    try {
        // Get all cells with member count
        const { data: cells, error: cellsError } = await supabase
            .from("cells")
            .select(`
                id,
                name,
                invite_code,
                cell_members (user_id)
            `);

        if (cellsError) {
            console.error("Cells Error:", cellsError);
            // Return mock data if table doesn't exist
            return NextResponse.json({
                progress: [
                    { cellId: "c1", name: "1셀 (청년부)", progress: 78, members: 8 },
                    { cellId: "c2", name: "2셀 (직장인)", progress: 45, members: 12 },
                    { cellId: "c3", name: "3셀 (신혼)", progress: 92, members: 5 },
                ],
                source: "mock"
            });
        }

        // Calculate progress for each cell
        const progressData = await Promise.all(
            (cells || []).map(async (cell: any) => {
                const memberCount = cell.cell_members?.length || 0;

                // Get reading activities for this cell
                const { data: activities } = await supabase
                    .from("reading_activities")
                    .select("user_id, verse")
                    .eq("cell_id", cell.id)
                    .eq("activity_type", "UNDERLINE");

                // Calculate progress (simplified: unique verses read / target verses)
                const uniqueVerses = new Set(
                    (activities || []).map((a: any) => `${a.verse}`)
                ).size;
                const targetVerses = 100;
                const progress = Math.min(Math.round((uniqueVerses / targetVerses) * 100), 100);

                return {
                    cellId: cell.id,
                    name: cell.name,
                    inviteCode: cell.invite_code,
                    progress,
                    members: memberCount
                };
            })
        );

        return NextResponse.json({
            progress: progressData,
            source: "database"
        });

    } catch (error: any) {
        console.error("Admin Progress Error:", error);
        return NextResponse.json({
            progress: [
                { cellId: "c1", name: "1셀 (청년부)", progress: 78, members: 8 },
                { cellId: "c2", name: "2셀 (직장인)", progress: 45, members: 12 },
                { cellId: "c3", name: "3셀 (신혼)", progress: 92, members: 5 },
            ],
            source: "mock",
            error: error.message
        });
    }
}
