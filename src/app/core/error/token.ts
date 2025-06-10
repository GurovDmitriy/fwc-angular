import { InjectionToken } from "@angular/core"
import type { ErrorMapper, ErrorService } from "./types"

export const TOKEN_ERROR_SERVICE = new InjectionToken<ErrorService>(
  "app.service ErrorService",
)

export const TOKEN_ERROR_MAPPER = new InjectionToken<ErrorMapper>(
  "app.service ErrorMapper",
)
