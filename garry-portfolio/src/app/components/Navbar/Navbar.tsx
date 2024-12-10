import Link from 'next/link'
import styles from './Navbar.module.scss'
import Button from '@/app/components/Button/Button'

const Navbar: React.FC = () => {
  return (
    <nav className={styles.container}>
      <Link href={'/'}>
        <Button>홈</Button>
      </Link>
      <Link href={'/login'}>
        <Button>로그인</Button>
      </Link>
    </nav>
  )
}

export default Navbar
