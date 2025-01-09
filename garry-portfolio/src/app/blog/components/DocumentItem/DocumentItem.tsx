import styles from './DocumentItem.module.scss'

type DocumentItemProps = React.HTMLAttributes<HTMLDivElement>

const DocuemntItem: React.FC<DocumentItemProps> = ({ onClick, className, ...props }) => {
  return (
    <div
      className={`${styles.container} ${className?.includes('selected') ? styles.selected : ''}`}
      onClick={onClick}
      {...props}
    >
      <div className={styles.title}>제목</div>
      <div className={styles.content}>내용</div>
      <div className={styles.date}>날짜</div>
    </div>
  )
}

export default DocuemntItem
