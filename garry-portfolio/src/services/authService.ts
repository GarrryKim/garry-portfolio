import { OAuthError } from '@/app/_lib/errors'
import { randomUUID } from 'crypto'
import { generateAccessToken, generateRefreshToken } from '@/app/_lib/jwt'
import { exchangeCodeForToken, fetchGoogleUserInfo, GoogleUserInfo } from '@/app/_lib/oauth'
import { createUser, getUserByEmail } from '@/services/userService'
import { saveRefreshToken } from '@/services/jwtService'

export async function createAuthUrl() {
  const clientId = process.env.GOOGLE_CLIENT_ID!
  const redirectUri = process.env.GOOGLE_REDIRECT_URI!
  const scope = encodeURIComponent('openid email profile')

  //   고유 state 값 생성
  const state = randomUUID()

  //   Google 인증 URL 생성
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`

  return { state, authUrl }
}

export async function validateState(state: string, storedState: string | undefined) {
  //   state값 검증
  if (!storedState || state !== storedState) {
    throw new OAuthError('유효하지 않은 토큰입니다.')
  }
}

export async function handleGoogleOAuth(code: string): Promise<{ accessToken: string; refreshToken: string }> {
  // 1. Authroization Code를 받아서 Access Token으로 교환
  const tokenData = await exchangeCodeForToken(code)
  const googleAccessToken = tokenData.access_token

  // 2. AccessToken으로 사용자 정보 받아오기
  const userInfo: GoogleUserInfo = await fetchGoogleUserInfo(googleAccessToken)
  const { email, name, picture } = userInfo

  // 이메일 검증
  if (!email) {
    throw new OAuthError('유효하지 않은 이메일입니다.')
  }

  // 3. DB에서 사용자 조회
  let user = await getUserByEmail(email)

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

  return { accessToken, refreshToken }
}
