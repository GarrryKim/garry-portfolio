import { pool } from '@/app/_lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // user 테이블에서 유저 조회
    const [rows] = await pool.query('SELECT * FROM user')

    // 성공 응답
    return NextResponse.json({ success: true, data: rows }, { status: 200 })
  } catch (err) {
    console.error('GET /api/users 에러: ', err)

    // 에러 응답
    return NextResponse.json({ success: false, message: '유저 정보 fetch 실패' }, { status: 500 })
  }
}
