import styles from './Button.module.scss'

interface ButtonProps {
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({ children }) => {
  return <div className={styles.button}>{children}</div>
}

export default Button
