'use client'

import { apiAuthClient } from '@/app/services/apiClient'
import { User } from '@/types/user'
import { useEffect, useState } from 'react'
import styles from './UserInfo.module.scss'

const UserInfo: React.FC = () => {
  const [userInfo, setUserInfo] = useState<User | null>(null)
  const fetchUserInfo = async () => {
    try {
      const response = await apiAuthClient('/users')
      if (!response.data.success) return

      const data: User = response.data.data

      return data
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const userData = await fetchUserInfo()

      if (userData) {
        setUserInfo(userData)
      }
    }
    fetchData()
  }, [])

  return (
    <div className={styles['user-container']}>
      {userInfo ? (
        <>
          <img className={styles['user-img']} src={userInfo?.picture} alt="이미지" />
          <span className={styles['user-text']}>{userInfo?.name}</span>
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

export default UserInfo
