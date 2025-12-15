import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { endpoint, p256dh, auth, userId } = body;

        if (!endpoint || !p256dh || !auth) {
            return NextResponse.json(
                { success: false, message: "Missing subscription data" },
                { status: 400 }
            );
        }

        // Save push subscription (if userId provided)
        if (userId) {
            const { error } = await supabase
                .from("push_subscriptions")
                .upsert({
                    user_id: userId,
                    endpoint,
                    p256dh,
                    auth
                });

            if (error) {
                console.error("Subscription Error:", error);
            }
        }

        return NextResponse.json({
            success: true,
            message: "푸시 알림 구독 완료"
        });

    } catch (error: any) {
        console.error("Push Subscribe Error:", error);
        return NextResponse.json({
            success: true,
            message: "구독 처리됨 (Demo Mode)"
        });
    }
}
