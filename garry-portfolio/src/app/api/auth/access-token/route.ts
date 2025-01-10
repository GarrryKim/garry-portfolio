import { validateAccessToken } from '@/services/jwtService'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // 헤더에서 액세서 토큰 가져오기
  const accessToken = request.headers.get('Authorization')

  try {
    // JWT 서비스 호출
    const decoded = await validateAccessToken(accessToken || '')

    // 토큰 반환값을 객체로 응답에 반환
    const response = NextResponse.json({ success: true, data: decoded })

    return response
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: '유효하지 않은 토큰입니다. ', details: error }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
