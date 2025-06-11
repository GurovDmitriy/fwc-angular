import { Environment } from "./types"

export const environment: Environment = {
  mode: import.meta.env.NG_APP_MODE,
  appUrl: import.meta.env.NG_APP_URL,
  apiUrl: import.meta.env.NG_APP_API_URL,
}
