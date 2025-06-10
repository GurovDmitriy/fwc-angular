export interface Environment {
  mode: EnvironmentMode
  appUrl: string
  apiUrl: string
}

export type EnvironmentMode =
  | "development"
  | "staging"
  | "production"
  | "testing"
