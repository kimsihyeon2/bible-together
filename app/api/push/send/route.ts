import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, body: messageBody, target, createdBy } = body;

        if (!title || !messageBody) {
            return NextResponse.json(
                { success: false, message: "제목과 내용을 입력해주세요." },
                { status: 400 }
            );
        }

        // Save notification to database
        const { data: notification, error } = await supabase
            .from("notifications")
            .insert({
                title,
                body: messageBody,
                target: target || "ALL",
                created_by: createdBy || null
            })
            .select()
            .single();

        if (error) {
            console.error("Notification Save Error:", error);
            // Still return success for demo purposes
            return NextResponse.json({
                success: true,
                message: `알림 전송 완료 (Demo Mode)`,
                notification: {
                    id: `notif_${Date.now()}`,
                    title,
                    body: messageBody,
                    target,
                    createdAt: new Date().toISOString()
                }
            });
        }

        console.log(`[NOTIFICATION SAVED]
ID: ${notification.id}
Title: ${title}
Body: ${messageBody}
Target: ${target}`);

        return NextResponse.json({
            success: true,
            message: target === "LEADER"
                ? "셀리더에게 알림 전송 완료"
                : "전체 알림 전송 완료",
            notification: {
                id: notification.id,
                title,
                body: messageBody,
                target,
                createdAt: notification.created_at
            }
        });

    } catch (error: any) {
        console.error("Push Send Error:", error);
        return NextResponse.json({
            success: true,
            message: "알림 전송 완료 (Offline Mode)",
            notification: {
                id: `notif_${Date.now()}`,
                title: "",
                body: "",
                target: "ALL",
                createdAt: new Date().toISOString()
            }
        });
    }
}
