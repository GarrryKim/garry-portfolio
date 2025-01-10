import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { DatabaseError, OAuthError } from '@/app/_lib/errors'
import { handleGoogleOAuth, validateState } from '@/services/authService'

/**
 * @swagger
 * /api/auth/callback/google:
 *   get:
 *     description: Google Oauth2.0 callback
 *     tags: [auth]
 *     responses:
 *       200:
 *         description: redirect
 *       400:
 *         description: DB 관련 에러
 *       500:
 *         description: 서버 에러
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  if (!code || !state) {
    return NextResponse.json({ error: 'Code 또는 state 정보가 누락됐습니다.' }, { status: 400 })
  }

  //   쿠키에 저장된 state 값 가져오기
  const cookieStore = await cookies()
  const storedState = cookieStore.get('oauth_state')?.value

  try {
    // state 값 검증
    await validateState(state, storedState)

    // state값 검증 후 삭제
    cookieStore.delete('oauth_state')

    // Google OAuth 처리
    const { accessToken, refreshToken } = await handleGoogleOAuth(code)

    // Redirect URL 생성
    if (!process.env.JWT_REDIRECT_URL) {
      throw new Error('JWT_REDIRECT_URL 환경 변수가 설정되지 않았습니다.')
    }

    const redirectUrl = new URL(process.env.JWT_REDIRECT_URL)
    redirectUrl.searchParams.set('access-token', accessToken)

    // 8. Refresh Token을 쿠키에 저장
    const response = NextResponse.redirect(redirectUrl.toString())
    response.cookies.set('refresh-token', refreshToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error('Google OAuth 에러: ', error)

    if (error instanceof OAuthError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    } else if (error instanceof DatabaseError) {
      return NextResponse.json({ error: '데이터베이스 에러' }, { status: 500 })
    } else {
      return NextResponse.json({ error: '인증 실패' }, { status: 500 })
    }
  }
}
