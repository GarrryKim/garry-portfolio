import jwt from 'jsonwebtoken'
import { findRefreshToken } from './dbToken'

const JWT_SECRET = process.env.JWT_SECRET as string

interface TokenPayload {
  userId: number
  email: string
  iat?: number // 생성 시간
  exp?: number // 만료 시간
}

interface TokenWithExpiry {
  token: string
  expiresAt: Date
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' })
}

export function generateRefreshToken(payload: TokenPayload): TokenWithExpiry {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
  const decoded = jwt.decode(token) as { exp: number } | null

  if (!decoded || !decoded.exp) {
    throw new Error('토큰 오류: 만료 시간 없음')
  }

  const expiresAt = new Date(decoded.exp * 1000)
  return { token, expiresAt }
}

export function verifyToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload

  // 타입 가드
  if (typeof decoded !== 'object' || decoded === null) {
    throw new Error('TokenPayload가 유효하지 않습니다.')
  }

  if (typeof decoded.userId !== 'number' || typeof decoded.email !== 'string') {
    throw new Error('TokenPayload 형식 오류 (userId || string)')
  }

  return decoded
}

export async function validateRefreshToken(refreshToken: string): Promise<TokenPayload> {
  // Refresh Token 검증
  const decoded = verifyToken(refreshToken)
  console.log('decoded: ', decoded)

  // Refresh Token DB 저장 여부 확인
  const storedToken = await findRefreshToken(refreshToken)
  if (!storedToken) {
    throw new Error('유효하지 않은 Refresh Token입니다.')
  }

  // Refresh Token 만료 여부 확인
  if (new Date() > storedToken.expiresAt) {
    throw new Error('Refresh Token이 만료되었습니다.')
  }

  return decoded
}
