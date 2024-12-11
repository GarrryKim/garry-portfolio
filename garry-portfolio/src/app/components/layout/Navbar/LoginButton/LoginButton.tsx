'use client'

import Button from '@/app/components/Button/Button'
import Link from 'next/link'
import { useState } from 'react'

const LoginButton: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const onClickLogout = () => {}

  return (
    <>
      {isLoggedIn ? (
        <Button>로그아웃</Button>
      ) : (
        <Link href={'/api/auth/login'}>
          <Button>로그인</Button>
        </Link>
      )}
    </>
  )
}

export default LoginButton
