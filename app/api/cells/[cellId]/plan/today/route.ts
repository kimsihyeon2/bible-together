import { NextRequest, NextResponse } from "next/server";

// Mock reading plan data
const MOCK_PLAN = {
    dayIndex: 12,
    title: "여호수아 정복 전쟁 시작",
    passages: [
        {
            book: "여호수아",
            chapter: 1,
            verses: [
                { verse: 1, text: "여호와의 종 모세가 죽은 후에 여호와께서 모세의 수종자 눈의 아들 여호수아에게 말씀하여 이르시되" },
                { verse: 2, text: "내 종 모세가 죽었으니 이제 너는 이 모든 백성과 더불어 일어나 이 요단을 건너 내가 그들 곧 이스라엘 자손에게 주는 그 땅으로 가라" },
                { verse: 3, text: "내가 모세에게 말한 바와 같이 너희 발바닥으로 밟는 곳은 모두 내가 너희에게 주었노니" },
                { verse: 4, text: "곧 광야와 이 레바논에서부터 큰 강 곧 유브라데 강까지 헷 족속의 온 땅과 또 해 지는 쪽 대해까지 너희의 영토가 되리라" },
                { verse: 5, text: "네 평생에 너를 능히 대적할 자가 없으리니 내가 모세와 함께 있었던 것 같이 너와 함께 있을 것임이니라 내가 너를 떠나지 아니하며 버리지 아니하리니" },
                { verse: 6, text: "강하고 담대하라 너는 내가 그들의 조상에게 맹세하여 그들에게 주리라 한 땅을 이 백성에게 차지하게 하리라" },
                { verse: 7, text: "오직 강하고 지극히 담대하여 나의 종 모세가 네게 명령한 그 율법을 다 지켜 행하고 우로나 좌로나 치우치지 말라 그리하면 어디로 가든지 형통하리니" },
                { verse: 8, text: "이 율법책을 네 입에서 떠나지 말게 하며 주야로 그것을 묵상하여 그 안에 기록된 대로 다 지켜 행하라 그리하면 네 길이 평탄하게 될 것이며 네가 형통하리라" },
                { verse: 9, text: "내가 네게 명령한 것이 아니냐 강하고 담대하라 두려워하지 말며 놀라지 말라 네가 어디로 가든지 네 하나님 여호와가 너와 함께 하느니라 하시니라" }
            ]
        }
    ]
};

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ cellId: string }> }
) {
    try {
        const { cellId } = await params;

        // Simulate 500ms async loading delay as per test requirement
        await new Promise(resolve => setTimeout(resolve, 500));

        return NextResponse.json({
            success: true,
            cellId,
            ...MOCK_PLAN
        });

    } catch (error: any) {
        console.error("Plan Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "서버 오류" },
            { status: 500 }
        );
    }
}
