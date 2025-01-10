import { fetchUserByEmail, fetchUserById, insertUser } from '@/repositories/userRepository'
import { User } from '@/types/user'

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await fetchUserByEmail(email)

  return user
}

export async function getUserById(id: string): Promise<User | null> {
  const user = await fetchUserById(id)

  return user
}

export async function createUser(email: string, name: string, picture: string): Promise<User> {
  const user = await insertUser(email, name, picture)

  if (!user) {
    throw new Error('유저 생성 실패')
  }

  return user
}
