import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";

export async function GET(request: NextRequest) {
    try {
        // Get all profiles
        const { data: profiles, error: profilesError } = await supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false });

        if (profilesError) {
            console.error("Profiles Error:", profilesError);
            // Return mock data if table doesn't exist
            return NextResponse.json({
                users: [
                    { id: "mock1", name: "홍길동", email: "hong@test.com", role: "MEMBER", created_at: new Date().toISOString() },
                    { id: "mock2", name: "김철수", email: "kim@test.com", role: "LEADER", created_at: new Date().toISOString() },
                ],
                source: "mock"
            });
        }

        return NextResponse.json({
            users: profiles || [],
            source: "database"
        });

    } catch (error: any) {
        console.error("Admin Users Error:", error);
        return NextResponse.json({
            users: [
                { id: "mock1", name: "홍길동", email: "hong@test.com", role: "MEMBER", created_at: new Date().toISOString() },
            ],
            source: "mock",
            error: error.message
        });
    }
}
