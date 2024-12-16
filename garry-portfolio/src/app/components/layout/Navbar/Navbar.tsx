'use client'

import Link from 'next/link'
import styles from './Navbar.module.scss'
import Button from '@/app/components/Button/Button'
import LoginContainer from './LoginContainer/UserContainer'
import { usePathname } from 'next/navigation'

const Navbar: React.FC = () => {
  const pathname = usePathname()

  console.log(pathname)

  return (
    <nav className={styles.container}>
      <div className={styles['link-bar']}>
        <Link href={'/'}>
          <Button className={pathname === '/' ? 'active' : ''}>홈</Button>
        </Link>
        <Link href={'/portfolio'}>
          <Button className={pathname === '/portfolio' ? 'active' : ''}>포트폴리오</Button>
        </Link>
        <Link href={'/blog'}>
          <Button className={pathname === '/blog' ? 'active' : ''}>블로그</Button>
        </Link>
      </div>
      <LoginContainer />
    </nav>
  )
}

export default Navbar
