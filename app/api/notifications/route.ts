import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const role = searchParams.get("role");

        // Get notifications based on user role
        let query = supabase
            .from("notifications")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(20);

        // Filter by target based on role
        if (role === "LEADER") {
            // Leaders see ALL and LEADER notifications
            query = query.in("target", ["ALL", "LEADER"]);
        } else if (role === "MEMBER") {
            // Members see only ALL notifications
            query = query.eq("target", "ALL");
        }
        // PASTOR sees all notifications (no filter)

        const { data: notifications, error } = await query;

        if (error) {
            console.error("Notifications Fetch Error:", error);
            return NextResponse.json({
                notifications: [],
                source: "mock"
            });
        }

        // Get read status if userId provided
        let readIds: string[] = [];
        if (userId) {
            const { data: reads } = await supabase
                .from("notification_reads")
                .select("notification_id")
                .eq("user_id", userId);
            readIds = reads?.map(r => r.notification_id) || [];
        }

        const formattedNotifications = (notifications || []).map((n: any) => ({
            id: n.id,
            title: n.title,
            body: n.body,
            target: n.target,
            createdAt: n.created_at,
            read: readIds.includes(n.id)
        }));

        return NextResponse.json({
            notifications: formattedNotifications,
            source: "database"
        });

    } catch (error: any) {
        console.error("Notifications Error:", error);
        return NextResponse.json({
            notifications: [],
            source: "mock",
            error: error.message
        });
    }
}

// Mark notification as read
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { notificationId, userId } = body;

        if (!notificationId || !userId) {
            return NextResponse.json(
                { success: false, message: "Missing parameters" },
                { status: 400 }
            );
        }

        await supabase
            .from("notification_reads")
            .upsert({
                notification_id: notificationId,
                user_id: userId
            });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
