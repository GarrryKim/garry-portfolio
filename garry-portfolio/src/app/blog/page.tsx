import DirectoryList from './components/DirectoryList/DirectoryList'
import DocuemntList from './components/DocumentList/DocumentList'
import styles from './page.module.scss'

const Blog: React.FC = () => {
  return (
    <div className={styles.container}>
      <DirectoryList />
      <DocuemntList />
    </div>
  )
}

export default Blog
