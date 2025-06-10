import { environment } from "./environment"
import { Environment } from "./types"

/**
 * AppEnvService
 * - env compile-time
 * - only this file read file environment
 * - only this file provide environment values
 */
export const APP_ENV_SERVICE: Environment = {
  mode: environment.mode,
  appUrl: environment.appUrl,
  apiUrl: environment.apiUrl,
}
