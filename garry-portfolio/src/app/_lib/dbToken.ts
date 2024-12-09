import { pool } from '@/app/_lib/db'
import { RowDataPacket } from 'mysql2'

// 데이터베이스 행 타입 정의
interface RefreshTokenRow extends RowDataPacket {
  user_id: number
  refresh_token: string
  expires_at: Date
}

interface RefreshToken {
  userId: number
  refreshToken: string
  expiresAt: Date
}

// refresh token 저장 쿼리
export async function saveRefreshToken({ userId, refreshToken, expiresAt }: RefreshToken): Promise<void> {
  const query = `
    INSERT INTO refresh_tokens (user_id, refresh_token, expires_at)
    VALUES (?, ?, ?)`

  await pool.execute(query, [userId, refreshToken, expiresAt])
}

// refresh token 조회 쿼리
export async function findRefreshToken(refreshToken: string): Promise<RefreshToken | null> {
  const query = `
    SELECT * FROM refresh_tokens WHERE refresh_token = ?
    `

  const [rows] = await pool.execute<RefreshTokenRow[]>(query, [refreshToken])

  if (rows.length === 0) return null

  const row = rows[0]
  return {
    userId: row.user_id,
    refreshToken: row.refresh_token,
    expiresAt: row.expires_at,
  }
}
