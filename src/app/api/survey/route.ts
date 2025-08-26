import { NextResponse } from 'next/server'

interface SurveyPayload {
    email: string
    reason_mindfulness: string
    preferred_service_format: string
    preferred_content_type: string
}

export async function POST(req: Request) {
    try {
        const body: SurveyPayload = await req.json()

        // 외부 API로 전달 (Cloudflare Tunnel)
        const res = await fetch(`${process.env.API_BASE_URL}/survey`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })

        if (!res.ok) {
            throw new Error(`외부 API 요청 실패: ${res.status}`)
        }

        const data = await res.json()
        return NextResponse.json(data, { status: 200 })
    } catch (error) {
        console.error('❌ 설문 제출 실패:', error)
        return NextResponse.json({ success: false, message: '설문 제출 실패' }, { status: 500 })
    }
}
