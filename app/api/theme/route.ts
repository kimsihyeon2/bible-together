import { NextRequest, NextResponse } from "next/server";

// In-memory store for theme (for testing purposes)
let currentTheme: "light" | "dark" | "system" = "system";

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { theme } = body;

        // Validate theme
        if (!theme || !["light", "dark", "system"].includes(theme)) {
            return NextResponse.json(
                { success: false, message: "유효하지 않은 테마입니다." },
                { status: 400 }
            );
        }

        // Update theme
        currentTheme = theme;

        return NextResponse.json({
            success: true,
            theme: currentTheme,
            message: `테마가 ${theme}로 변경되었습니다.`
        });

    } catch (error: any) {
        console.error("Theme Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "서버 오류" },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        theme: currentTheme
    });
}
