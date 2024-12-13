import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './app/_lib/jwt'

export function middleware(req: NextRequest) {
  console.log('middleware.ts 실행')
  // 헤더에서 액세서 토큰 가져오기
  const accessToken = req.headers.get('access-token')

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

    // 헤더에 추가
    const response = NextResponse.next()
    response.headers.set('user', JSON.stringify(decoded))

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

// 아래 config에 설정한 경로를 검사 (JWT 토큰 검사)
export const config = {
  matcher: '/api/users',
}
