import { DatabaseError } from '@/app/_lib/errors'
import { User } from '@/types/user'
import { pool } from '@/app/_lib/db'
import { ResultSetHeader } from 'mysql2'

export async function fetchUserByEmail(email: string): Promise<User | null> {
  try {
    const query = 'SELECT id, email, name, picture FROM users WHERE email = ?'
    const [rows] = await pool.execute(query, [email])

    if (!Array.isArray(rows) || rows.length === 0) {
      return null
    }

    const users = rows as User[]
    const user = users[0]

    return user
  } catch (error) {
    console.error('사용자 조회 오류: ', error)
    throw new DatabaseError('사용자 조회 실패')
  }
}

export async function fetchUserById(id: string): Promise<User | null> {
  try {
    const query = 'SELECT * FROM users WHERE id = ?'
    const [rows] = await pool.execute(query, [id])

    if (!Array.isArray(rows) || rows.length === 0) {
      return null
    }

    const users = rows as User[]
    const user = users[0]

    return user
  } catch (error) {
    console.error('사용자 조회 오류: ', error)
    throw new DatabaseError('사용자 조회 실패')
  }
}

export async function insertUser(email: string, name: string, picture: string): Promise<User | null> {
  try {
    const query = 'INSERT INTO users (email, name, picture, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())'
    const [result] = await pool.execute<ResultSetHeader>(query, [email, name, picture])

    const user: User = {
      id: result.insertId,
      email,
      name,
      picture,
    }

    return user
  } catch (error) {
    console.error('사용자 생성 오류: ', error)
    throw new DatabaseError('사용자 생성 실패')
  }
}
