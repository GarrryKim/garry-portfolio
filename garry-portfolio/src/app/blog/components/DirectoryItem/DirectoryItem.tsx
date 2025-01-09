import styles from './DirectoryItem.module.scss'

interface Props {
  icon: string
  title: string
}

const DirectoryItem = ({ icon, title }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>{icon}</div>
      <div>{title}</div>
    </div>
  )
}

export default DirectoryItem
