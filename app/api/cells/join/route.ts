import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Valid invite codes (Mock for now, can be fetched from DB)
const VALID_INVITE_CODES = ["YOUTH1", "YOUTH2", "WORK2", "FAMILY3", "NEWBIE", "PASTOR"];

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { inviteCode } = body;

        // Validate invite code
        if (!inviteCode || !inviteCode.trim()) {
            return NextResponse.json(
                { success: false, message: "초대 코드를 입력해주세요." },
                { status: 400 }
            );
        }

        const upperCode = inviteCode.toUpperCase().trim();

        // Check if code is valid
        if (!VALID_INVITE_CODES.includes(upperCode)) {
            return NextResponse.json(
                { success: false, message: "유효하지 않은 초대 코드입니다." },
                { status: 400 }
            );
        }

        // Try Supabase integration
        try {
            const supabase = await createClient();

            // Get current user
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                return NextResponse.json(
                    { success: false, message: "로그인이 필요합니다." },
                    { status: 401 }
                );
            }

            // Find cell by invite code
            const { data: cell } = await supabase
                .from("cells")
                .select("*")
                .eq("invite_code", upperCode)
                .single();

            if (cell) {
                // Check if already joined
                const { data: existingMembership } = await supabase
                    .from("cell_members")
                    .select("*")
                    .eq("cell_id", cell.id)
                    .eq("user_id", user.id)
                    .single();

                if (existingMembership) {
                    return NextResponse.json(
                        { success: false, message: "이미 가입된 셀입니다." },
                        { status: 400 }
                    );
                }

                // Join the cell
                const { error: joinError } = await supabase
                    .from("cell_members")
                    .insert({ cell_id: cell.id, user_id: user.id });

                if (joinError) throw joinError;

                return NextResponse.json({
                    success: true,
                    message: "셀에 가입되었습니다!",
                    cellId: cell.id
                });
            }
        } catch (dbError) {
            console.error("DB Error:", dbError);
            // Fall through to mock response
        }

        // Mock response for testing
        return NextResponse.json({
            success: true,
            message: "셀에 가입되었습니다! (Mock)",
            cellId: `cell_${Date.now()}`
        });

    } catch (error: any) {
        console.error("Join Cell Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "서버 오류" },
            { status: 500 }
        );
    }
}
