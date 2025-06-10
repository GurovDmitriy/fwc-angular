export interface AuthSignUpPayload {
  username: string
  email: string
  password: string
  passwordConfirmation: string
}

export interface AuthSignInPayload {
  email: string
  password: string
}

export interface AuthSignToken {
  id: string
  tokenAccess: string
  tokenRefresh: string
}

export interface AuthUser {
  id: string
  username: string
  email: string
}

export interface AuthResponse<T> {
  code: string
  message: string
  data: T
}
