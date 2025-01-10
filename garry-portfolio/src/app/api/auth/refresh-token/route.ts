import { refreshTokens } from '@/services/jwtService'
import { NextRequest, NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET 환경 변수가 설정되지 않았습니다.')
}

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     description: 리프레시 / 액세스 토큰 재발급 요청
 *     tags: [auth]
 *     responses:
 *       200:
 *         description: 리프레시 / 액세스 토큰 재발급
 */
export async function POST(request: NextRequest) {
  try {
    // refresh-token 쿠키 파싱 (NextRequest의 cookies 메서드 이용)
    const refreshTokenCookie = request.cookies.get('refresh-token')

    // 토큰 누락 에러 처리
    if (!refreshTokenCookie) {
      return NextResponse.json({ error: 'Refresh Token이 없습니다. ' }, { status: 401 })
    }

    const refreshToken = refreshTokenCookie.value

    // access, refresh 토큰 재발급 서비스 호출
    const { newAccessToken, newRefreshToken } = await refreshTokens(refreshToken)

    // 응답에 accessToken, 쿠키에 refreshToken 저장
    const response = NextResponse.json({ accessToken: newAccessToken }, { status: 200 })
    response.cookies.set('refresh-token', newRefreshToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error('Refresh Token 검증 오류', error)
    return NextResponse.json({ error: '유효하지 않은 Refresh Token입니다.' }, { status: 403 })
  }
}
