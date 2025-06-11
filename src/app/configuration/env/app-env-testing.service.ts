import { environment } from "./environment"
import { Environment } from "./types"

export const APP_ENV_TESTING_SERVICE: Environment = {
  mode: environment.mode,
  appUrl: environment.appUrl,
  apiUrl: environment.apiUrl,
}
