export class OAuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'OAuthError'
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DatabaseError'
  }
}
