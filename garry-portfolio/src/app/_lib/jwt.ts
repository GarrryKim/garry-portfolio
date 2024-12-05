import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET as string

interface TokenPayload {
  userId: number
  email: string
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

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET)
}
