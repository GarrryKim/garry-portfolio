import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  console.log('middleware.ts 실행')
  // 헤더에서 액세서 토큰 가져오기
  const accessToken = req.headers.get('Authorization')

  // 헤더에 액세스 토큰 존재 여부 검사
  if (!accessToken) {
    return new NextResponse(JSON.stringify({ error: '액세스 토큰이 없습니다.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    // 액세스 토큰 검사 api
    const tokenResponse = await fetch(process.env.NEXT_API_BASE_URL + '/api/auth/access-token', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken,
      },
    })

    const data = await tokenResponse.json()
    const userId = data.data.userId

    // 헤더에 추가
    const response = NextResponse.next()
    response.headers.set('userId', JSON.stringify(userId))

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
