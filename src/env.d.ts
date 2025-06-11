declare interface Env {
  readonly NODE_ENV: string
  readonly NG_APP_MODE: "development" | "production" | "staging" | "testing"
  readonly NG_APP_URL: string
  readonly NG_APP_API_URL: string
}

declare interface ImportMeta {
  readonly env: Env
}
