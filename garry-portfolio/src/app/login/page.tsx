'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const Login: React.FC = () => {
  const searchParams = useSearchParams()

  // 액세스 토큰 로컬 스토리지에 저장
  const saveAccessTokenAtLocalStorage = (accessToken: string) => {
    // 액세스 토큰 검사
    if (!accessToken) return

    localStorage.setItem('access-token', accessToken)
  }

  // 컴포넌트(페이지) 렌더링시 실행
  useEffect(() => {
    // 쿼리 파라미터에서 액세스 토큰 받아오기
    const accessToken = searchParams.get('access-token')
    if (accessToken) {
      saveAccessTokenAtLocalStorage(accessToken)

      window.location.href = '/'
    } else {
      console.log('액세스 토큰이 없습니다.')
    }
  }, [])

  return (
    <>
      <div>로그인중입니다.</div>
    </>
  )
}

export default Login
