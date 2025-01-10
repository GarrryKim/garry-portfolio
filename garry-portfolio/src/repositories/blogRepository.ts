import { pool } from '@/app/_lib/db'
import { DatabaseError } from '@/app/_lib/errors'
import { ResultSetHeader } from 'mysql2'

export async function fetchDocumentsByUserId(userId: number) {
  try {
    const query = 'SELECT * from documents where user_id = ?'
    const [rows] = await pool.execute(query, [userId])

    if (!Array.isArray(rows) || rows.length === 0) {
      return []
    }

    const documents = rows as Document[]

    return documents
  } catch (error) {
    throw new DatabaseError(`문서 조회 실패 ${error instanceof Error ? error.message : error}`)
  }
}

export async function insertDocument({ userId, title }: { userId: number; title: string }) {
  try {
    const query = 'INSERT INTO documents (user_id, title) VALUES (?, ?)'
    const [result] = await pool.execute<ResultSetHeader>(query, [userId, title])

    return result.insertId
  } catch (error) {
    throw new DatabaseError(`문서 저장 실패 ${error instanceof Error ? error.message : error}`)
  }
}

export async function deleteDocumentByDocumentId(documentId: number) {
  try {
    const query = 'DELETE FROM documents WHERE id = ?'
    const [result] = await pool.execute<ResultSetHeader>(query, [documentId])

    if (result.affectedRows === 0) {
      return false
    }
    return true
  } catch (error) {
    throw new DatabaseError(`문서 삭제 실패 ${error instanceof Error ? error.message : error}`)
  }
}
