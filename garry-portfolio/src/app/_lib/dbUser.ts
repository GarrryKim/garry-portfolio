import { pool } from '@/app/_lib/db'
import { DatabaseError } from '@/app/_lib/errors'

export interface User {
  id: number
  email: string
  name: string
  picture: string
}

export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const [rows] = await pool.execute('SELECT id, email, name, picture FROM users WHERE email = ?', [email])
    const users = rows as User[]
    return users.length > 0 ? users[0] : null
  } catch (error) {
    console.error('사용자 조회 오류: ', error)
    throw new DatabaseError('사용자 조회 실패')
  }
}

export async function createUser(email: string, name: string, picture: string): Promise<User> {
  try {
    const [result] = await pool.execute(
      'INSERT INTO users (email, name, picture, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [email, name, picture]
    )
    const insertResult = result as any
    return {
      id: insertResult.insertId,
      email,
      name,
      picture,
    }
  } catch (error) {
    console.error('사용자 생성 오류: ', error)
    throw new DatabaseError('사용자 생성 실패')
  }
}
