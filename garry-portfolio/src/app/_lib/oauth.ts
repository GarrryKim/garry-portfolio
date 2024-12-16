import axios from 'axios'

export interface TokenResponse {
  access_token: string
  expires_in: number
  token_type: string
  scope: string
}

export interface GoogleUserInfo {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  locale: string
}

export async function echangeCodeForToken(code: string): Promise<TokenResponse> {
  try {
    // Authroization Code를 받아서 Access Token으로 교환
    const response = await axios.post<TokenResponse>('https://oauth2.googleapis.com/token', null, {
      params: {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data
  } catch (error) {
    console.error('Code -> Token 교환 오류 (구글 OAuth)', error)
    throw new Error('Code -> Token 교환에 실패했습니다. (구글 OAuth)')
  }
}

export async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  try {
    const response = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('사용자 정보 가져오기 오류 (구글 OAuth): ', error)
    throw new Error('사용자 정보를 가져오는데 실패했습니다. (구글 OAuth)')
  }
}
