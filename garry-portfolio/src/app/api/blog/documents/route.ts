import { getDocuments, postDocument } from '@/services/blogServices'
import { NextRequest, NextResponse } from 'next/server'

/**
 * @swagger
 * /api/blog/documents:
 *   get:
 *     description: 유저의 문서 목록 조회
 *     tags:
 *       - blog
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 문서 목록 반환
 *
 */

export async function GET(request: NextRequest) {
  try {
    const userId = Number(request.headers.get('userId'))

    if (!userId) {
      return NextResponse.json({ success: false, message: 'userId 헤더가 누락됐습니다.' }, { status: 400 })
    }

    const documents = await getDocuments(userId)

    if (!documents || documents.length === 0) {
      return NextResponse.json({ success: true, data: [] }, { status: 200 })
    }

    return NextResponse.json({ success: true, data: documents }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다. 다시 시도해주세요.' },
      { status: 500 }
    )
  }
}

/**
 * @swagger
 * /api/blog/documents:
 *   post:
 *     description: 유저의 제목으로 문서 작성
 *     tags:
 *       - blog
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: 생성할 문서의 제목
 *     responses:
 *       200:
 *         description: 문서 id 반환
 *       400:
 *         description: 유효하지 않은 요청
 *       500:
 *         description: 서버 에러
 *
 */
export async function POST(request: NextRequest) {
  try {
    const userId = Number(request.headers.get('userId'))

    const body = await request.json()
    const { title } = body

    if (!userId || typeof userId !== 'number') {
      console.log(userId)
      return NextResponse.json({ success: false, message: '유효하지 않은 사용자 ID입니다. ' }, { status: 400 })
    }

    if (!title || typeof title !== 'string') {
      return NextResponse.json({ success: false, message: '유효하지 않은 제목입니다.' }, { status: 400 })
    }

    // 서비스 호출
    const documentId = postDocument({ userId, title })

    return NextResponse.json({ success: true, data: documentId }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      {
        success: false,
        message: '서버 오류가 발생했습니다. 다시 시도해주세요.',
      },
      { status: 500 }
    )
  }
}
