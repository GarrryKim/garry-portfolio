import { createAuthUrl } from '@/services/authService'
import { NextResponse } from 'next/server'

/**
 * @swagger
 * /api/auth/login:
 *   get:
 *     description: 구글 로그인 요청
 *     tags: [auth]
 *     responses:
 *       307:
 *         description: 구글 로그인 페이지로 redirect
 */
export async function GET() {
  // 서비스 호출
  const { state, authUrl } = await createAuthUrl()

  //   응답
  const response = NextResponse.redirect(authUrl)
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 300,
  })

  return response
}
