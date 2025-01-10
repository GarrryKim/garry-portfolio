import { pool } from '@/app/_lib/db'
import { DatabaseError } from '@/app/_lib/errors'
import { RefreshToken } from '@/types/jwt'
import { ResultSetHeader } from 'mysql2'

// refresh token 저장 쿼리
export async function insertRefreshToken({ userId, refreshToken, expiresAt }: RefreshToken): Promise<boolean> {
  try {
    const query = `
      INSERT INTO refresh_tokens (user_id, refresh_token, expires_at)
      VALUES (?, ?, ?)`
    const [result] = await pool.execute<ResultSetHeader>(query, [userId, refreshToken, expiresAt])

    return result.affectedRows > 0
  } catch (error) {
    console.error('refresh 토큰 저장 오류', error)
    throw new DatabaseError('refresh 토큰 저장 실패')
  }
}

// refresh token 조회 쿼리
export async function fetchRefreshTokenByTokenValue(token: string): Promise<RefreshToken | null> {
  try {
    const query = `
      SELECT * FROM refresh_tokens WHERE refresh_token = ?
      `

    const [rows] = await pool.execute(query, [token])

    const refreshTokens = rows as RefreshToken[]
    const refreshToken = refreshTokens[0]

    return refreshToken
  } catch (error) {
    console.error('refresh 토큰 조회 실패', error)
    throw new DatabaseError('refresh 토큰 조회 실패')
  }
}
