import { NextRequest, NextResponse } from "next/server";

// In-memory store for translation (for testing purposes)
let currentTranslation = "KRV";

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { translation } = body;

        // Validate translation
        if (!translation || !["KRV", "EASY"].includes(translation)) {
            return NextResponse.json(
                { success: false, message: "유효하지 않은 번역본입니다." },
                { status: 400 }
            );
        }

        // Update translation
        currentTranslation = translation;

        return NextResponse.json({
            success: true,
            translation: currentTranslation,
            message: `번역본이 ${translation}로 변경되었습니다.`
        });

    } catch (error: any) {
        console.error("Translation Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "서버 오류" },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        translation: currentTranslation
    });
}
