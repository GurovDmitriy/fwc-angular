import { InjectionToken } from "@angular/core"
import { ConfigTesting } from "./types"

export const TOKEN_CONFIG_TESTING = new InjectionToken<ConfigTesting>(
  "app.config ConfigTest",
)
