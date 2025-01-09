import { getUserById } from '@/services/userService'
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
 *       400:
 *         description: 오류 혹은 헤더 누락
 *       404:
 *         description: id로 유저를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 *
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('userId')

    if (!userId) {
      return NextResponse.json({ success: false, message: 'userId 헤더가 누락됐습니다.' }, { status: 400 })
    }

    const user = await getUserById(userId)

    if (!user) {
      return NextResponse.json({ success: false, message: '유저를 찾을 수 없습니다.' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 })
  } catch (err) {
    console.error('GET /api/users 에러: ', err)

    // 에러 응답
    return NextResponse.json({ success: false, message: '유저 정보 조회 중 오류' }, { status: 500 })
  }
}
