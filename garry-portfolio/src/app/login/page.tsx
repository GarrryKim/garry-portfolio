'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const Login: React.FC = () => {
  const searchParams = useSearchParams()

  const saveAccessTokenAtLocalStorage = (accessToken: string) => {
    if (!accessToken) return

    localStorage.setItem('access-token', accessToken)
  }

  // 컴포넌트(페이지) 렌더링시 실행
  useEffect(() => {
    const accessToken = searchParams.get('access-token')
    if (accessToken) {
      saveAccessTokenAtLocalStorage(accessToken)

      window.location.href = '/'
    } else {
      console.log('액세스 토큰이 없습니다.')
    }
  })

  return (
    <>
      <div>로그인중입니다.</div>
    </>
  )
}

export default Login
