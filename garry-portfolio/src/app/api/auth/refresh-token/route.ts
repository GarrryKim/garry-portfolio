import { findRefreshToken, saveRefreshToken } from '@/app/_lib/dbToken'
import { generateAccessToken, generateRefreshToken, validateRefreshToken, verifyToken } from '@/app/_lib/jwt'
import { error } from 'console'
import { NextRequest, NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET 환경 변수가 설정되지 않았습니다.')
}

export async function GET(request: NextRequest) {
  try {
    // refresh-token 쿠키 파싱 (NextRequest의 cookies 메서드 이용)
    const refreshTokenCookie = request.cookies.get('refresh-token')

    // 토큰 누락 에러 처리
    if (!refreshTokenCookie) {
      return NextResponse.json({ error: 'Refresh Token이 없습니다. ' }, { status: 401 })
    }

    const refreshToken = refreshTokenCookie.value

    // Refresh Token 검증 및 TokenPayload 추출
    const decoded = await validateRefreshToken(refreshToken)

    // 새로운 Refresh Token, Access Token 생성
    const newAccessToken = generateAccessToken({ userId: decoded.userId, email: decoded.email })
    const { token: newRefreshToken, expiresAt } = generateRefreshToken({ userId: decoded.userId, email: decoded.email })

    // 새로 발급한 refreshToken 저장
    await saveRefreshToken({
      userId: decoded.userId,
      refreshToken: refreshToken,
      expiresAt: expiresAt,
    })

    // 응답에 accessToken, 쿠키에 refreshToken 저장
    const response = NextResponse.json({ accessToken: newAccessToken }, { status: 200 })
    response.cookies.set('refresh-token', refreshToken, {
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
