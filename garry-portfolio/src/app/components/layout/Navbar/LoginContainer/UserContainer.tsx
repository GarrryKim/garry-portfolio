'use client'

import Button from '@/app/components/Button/Button'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import UserInfo from '../UserInfoBox/UserInfo'
import styles from './UserContainer.module.css'

const UserContainer: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // 컴포넌트 로드시 로그인 여부 검사
  useEffect(() => {
    const isAccessTokenSaved = checkAccessToken()

    if (isAccessTokenSaved) {
      setIsLoggedIn(true)
    }
  }, [])

  const onClickLogout = () => {
    removeAccesTokenFromLocalStorage()
  }

  const checkAccessToken = () => {
    // 로컬 스토리지에서 액세스 토큰 존재 여부 검사
    const accessToken = localStorage.getItem('access-token')

    if (!accessToken) {
      return false
    } else {
      return true
    }
  }

  // 로컬 스토리지에서 액세스 토큰 삭제
  const removeAccesTokenFromLocalStorage = () => {
    // 로컬 스토리지에서 액세스 토큰 존재 여부 검사
    checkAccessToken()

    localStorage.removeItem('access-token')

    // 로그아웃
    setIsLoggedIn(false)
  }

  // 쿠키 삭제 차후 구현

  return (
    <div className={styles.container}>
      {isLoggedIn ? (
        <>
          <UserInfo />
          <Button onClick={onClickLogout}>로그아웃</Button>
        </>
      ) : (
        <Link href={'/api/auth/login'}>
          <Button>로그인</Button>
        </Link>
      )}
    </div>
  )
}

export default UserContainer
