import { generateAccessToken, generateRefreshToken, validateRefreshToken, verifyToken } from '@/app/_lib/jwt'
import { fetchRefreshTokenByTokenValue, insertRefreshToken } from '@/repositories/jwtRepository'
import { RefreshToken } from '@/types/jwt'

// access token 유효성 검증
export async function validateAccessToken(accessToken: string) {
  if (!accessToken) {
    throw new Error('액세스 토큰이 없습니다.')
  }

  const decoded = verifyToken(accessToken)
  return decoded
}

// refresh token 저장 쿼리
export async function saveRefreshToken({ userId, refreshToken, expiresAt }: RefreshToken): Promise<string | null> {
  const isRefreshTokenSaved = await insertRefreshToken({ userId, refreshToken, expiresAt })

  if (!isRefreshTokenSaved) {
    return null
  }

  return refreshToken
}

// refresh token 조회 쿼리
export async function findRefreshToken(token: string): Promise<RefreshToken | null> {
  const refreshToken = await fetchRefreshTokenByTokenValue(token)

  return refreshToken
}

// access, refresh 토큰 재발급
export async function refreshTokens(refreshToken: string) {
  // Refresh Token 검증 및 TokenPayload 추출
  const decoded = await validateRefreshToken(refreshToken)

  // 새로운 Refresh Token, Access Token 생성
  const newAccessToken = generateAccessToken({ userId: decoded.userId, email: decoded.email })
  const { token: newRefreshToken, expiresAt } = generateRefreshToken({ userId: decoded.userId, email: decoded.email })

  // 새로 발급한 refreshToken 저장
  const savedRefreshToken = await saveRefreshToken({
    userId: decoded.userId,
    refreshToken: newRefreshToken,
    expiresAt: expiresAt,
  })

  if (!savedRefreshToken) {
    throw new Error('Refresh Token 저장 실패')
  }

  return {
    newAccessToken,
    newRefreshToken,
  }
}
