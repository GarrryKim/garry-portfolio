'use client'

import IconButton from '@/app/components/IconButton/IconButton'
import DocuemntItem from '../DocumentItem/DocumentItem'
import styles from './DocumentList.module.scss'
import { useState } from 'react'

const directoryItems = [1, 1, 1, 2, 3, 4, 5, 6, 7, 8]

const DocuemntList: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const handleItemClick = (idx: number) => {
    setSelectedIdx(idx)
  }

  return (
    <section className={styles.container}>
      <div className={styles['tool-bar']}>
        <IconButton>w</IconButton>
        <IconButton>s</IconButton>
      </div>
      <div className={styles['list-container']}>
        {directoryItems.map((_, idx) => {
          const isPrevSelected = selectedIdx === idx
          const isNextSelected = selectedIdx === idx + 1

          return idx === directoryItems.length - 1 ? (
            <DocuemntItem
              onClick={() => handleItemClick(idx)}
              key={`doc-${idx}`}
              className={idx === selectedIdx ? 'selected' : ''}
            />
          ) : (
            <>
              <DocuemntItem
                onClick={() => handleItemClick(idx)}
                key={`doc-${idx}`}
                className={idx === selectedIdx ? 'selected' : ''}
              />
              <div
                className={`${styles.divider} ${isPrevSelected || isNextSelected ? styles.selected : ''}`}
                key={`div-${idx}`}
              />
            </>
          )
        })}
      </div>
    </section>
  )
}

export default DocuemntList
