import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { generateAccessToken, generateRefreshToken } from '@/app/_lib/jwt'
import { echangeCodeForToken, fetchGoogleUserInfo, GoogleUserInfo } from '@/app/_lib/oauth'
import { createUser, findUserByEmail, User } from '@/app/_lib/dbUser'
import { DatabaseError, OAuthError } from '@/app/_lib/errors'
import { saveRefreshToken } from '@/app/_lib/dbToken'

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

  //   state값 검증
  if (state !== storedState) {
    return NextResponse.json({ error: '유효하지 않은 state 입니다.' }, { status: 400 })
  }

  // state값 검증 후 삭제
  cookieStore.delete('oauth_state')

  try {
    // 1. Authroization Code를 받아서 Access Token으로 교환
    const tokenData = await echangeCodeForToken(code)
    const googleAccessToken = tokenData.access_token

    // 2. AccessToken으로 사용자 정보 받아오기
    const userInfo: GoogleUserInfo = await fetchGoogleUserInfo(googleAccessToken)
    const { email, name, picture } = userInfo

    // 이메일 검증
    if (!email) {
      return NextResponse.json({ error: '유효하지 않은 이메일입니다.' }, { status: 400 })
    }

    // 3. DB에서 사용자 조회
    let user: User | null = await findUserByEmail(email)

    // 4. 사용자가 없다면 생성(회원가입)
    if (!user) {
      user = await createUser(email, name, picture)
    }

    // 5. JWT 토큰 생성
    const accessToken = generateAccessToken({ userId: user.id, email: user.email })
    const { token: refreshToken, expiresAt } = generateRefreshToken({ userId: user.id, email: user.email })

    // 6. Refresh Token을 DB에 저장
    await saveRefreshToken({
      userId: user.id,
      refreshToken: refreshToken,
      expiresAt: expiresAt,
    })

    // 7. Access Token을 리디렉션 URL에 포함
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
    console.error('인증 혹은 DB 오류: ', error)

    if (error instanceof OAuthError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    } else if (error instanceof DatabaseError) {
      return NextResponse.json({ error: '데이터베이스 에러' }, { status: 500 })
    } else {
      return NextResponse.json({ error: '인증 실패' }, { status: 500 })
    }
  }
}
