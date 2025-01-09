import styles from './IconButton.module.scss'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

const IconButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button className={`${styles.button}`} {...props}>
      {children}
    </button>
  )
}

export default IconButton
