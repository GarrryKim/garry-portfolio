import DirectoryItem from '../DirectoryItem/DirectoryItem'
import styles from './DirectoryList.module.scss'

const DirectoryList: React.FC = () => {
  const directoryItems = Array.from({ length: 50 }, (_, x) => x + 1)

  return (
    <section className={styles.container}>
      <DirectoryItem icon="default" title="전체" />
      {directoryItems.map((item) => {
        return <DirectoryItem key={item} icon="default" title={'디렉토리 ' + item.toString()} />
      })}
    </section>
  )
}

export default DirectoryList
