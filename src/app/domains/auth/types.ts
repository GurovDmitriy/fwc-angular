export interface AuthSignUpPayload {
  email: string
  name: string
  password: string
  passwordConfirm: string
}

export interface AuthSignInPayload {
  email: string
  password: string
}

export interface AuthMeUpdatePayload {
  email: string
}

export interface AuthSignToken {
  id: string
  tokenAccess: string
  tokenRefresh: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
}

export interface AuthResponse<T> {
  code: string
  message: string
  data: T
}
