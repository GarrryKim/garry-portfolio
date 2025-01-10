import { deleteDocument } from '@/services/blogServices'
import { NextRequest, NextResponse } from 'next/server'

/**
 * @swagger
 * /api/blog/documents/{documentId}:
 *   delete:
 *     description: 문서 id로 문서 삭제
 *     tags:
 *       - blog
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: documentId
 *         in: path
 *         description: 삭제할 문서의 id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: 문서 삭제 성공
 *       400:
 *         description: 유효하지 않은 요청
 *       404:
 *         description: 없는 문서 번호
 *       500:
 *         description: 서버 에러
 *
 */
export async function DELETE(request: NextRequest, { params }: { params: { documentId: number } }) {
  try {
    const userId = Number(request.headers.get('userId'))
    const { documentId } = await params

    if (!userId || typeof userId !== 'number') {
      console.log(userId)
      return NextResponse.json({ success: false, message: '유효하지 않은 사용자 ID입니다. ' }, { status: 400 })
    }

    // 서비스 호출
    const result = await deleteDocument(documentId)

    if (!result) {
      return NextResponse.json({ success: false, message: '문서를 찾을 수 없습니다.' }, { status: 404 })
    }

    return new NextResponse(null, { status: 204 })
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
