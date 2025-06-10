import { Environment } from "./types"

/**
 * Environment
 * - only this vars read import.meta.env
 * - provide this vars in app with service
 * - contains default value
 * - file replacement arch
 */
export const environment: Environment = {
  mode: "development",
  appUrl: import.meta.env.NG_APP_URL,
  apiUrl: import.meta.env.NG_APP_API_URL,
}
