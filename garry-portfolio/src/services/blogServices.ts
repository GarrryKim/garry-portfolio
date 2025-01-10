import { deleteDocumentByDocumentId, fetchDocumentsByUserId, insertDocument } from '@/repositories/blogRepository'

export async function getDocuments(userId: number): Promise<Document[]> {
  const documents = await fetchDocumentsByUserId(userId)

  return documents
}

export async function postDocument({ userId, title }: { userId: number; title: string }) {
  const documentId = await insertDocument({ userId, title })

  return documentId
}

export async function deleteDocument(documentId: number): Promise<boolean> {
  const isDeleted = await deleteDocumentByDocumentId(documentId)

  return isDeleted
}
