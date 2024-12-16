import { randomUUID } from 'crypto'
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
  const clientId = process.env.GOOGLE_CLIENT_ID!
  const redirectUri = process.env.GOOGLE_REDIRECT_URI!
  const scope = encodeURIComponent('openid email profile')

  //   고유 state 값 생성
  const state = randomUUID()

  //   Google 인증 URL 생성
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`

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
