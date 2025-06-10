import { InjectionToken } from "@angular/core"
import type { MediaQuery } from "./types"

export const TOKEN_MEDIA_QUERY = new InjectionToken<MediaQuery>(
  "app.service MediaQueryService",
)
