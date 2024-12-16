import Link from 'next/link'
import styles from './Navbar.module.scss'
import Button from '@/app/components/Button/Button'
import LoginContainer from './LoginContainer/LoginContainer'

const Navbar: React.FC = () => {
  return (
    <nav className={styles.container}>
      <Link href={'/'}>
        <Button>홈</Button>
      </Link>
      <LoginContainer />
    </nav>
  )
}

export default Navbar
