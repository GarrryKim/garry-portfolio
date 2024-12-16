import { verifyToken } from '@/app/_lib/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // 헤더에서 액세서 토큰 가져오기
  const accessToken = request.headers.get('Authorization')

  // 헤더에 액세스 토큰 존재 여부 검사
  if (!accessToken) {
    return new NextResponse(JSON.stringify({ error: '액세스 토큰이 없습니다.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    // 토큰 검사
    const decoded = verifyToken(accessToken)

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
