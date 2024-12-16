import { pool } from '@/app/_lib/db'
import { User } from '@/app/_lib/dbUser'
import { NextRequest, NextResponse } from 'next/server'
/**
 * @swagger
 * /api/users:
 *   get:
 *     description: 유저 정보 조회
 *     tags:
 *       - users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 유저 정보 반환
 *
 */
export async function GET(request: NextRequest) {
  try {
    const requestUser = request.headers.get('userId')

    // user 테이블에서 유저 조회
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [requestUser])

    if (Array.isArray(rows) && rows.length === 0) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    const users = rows as User[]
    const user = users[0]

    // 성공 응답
    return NextResponse.json({ success: true, data: user }, { status: 200 })
  } catch (err) {
    console.error('GET /api/users 에러: ', err)

    // 에러 응답
    return NextResponse.json({ success: false, message: '유저 정보 fetch 실패' }, { status: 500 })
  }
}
