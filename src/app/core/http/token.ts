import { InjectionToken } from "@angular/core"
import { HttpCacheConfig } from "./types"

export const TOKEN_HTTP_CACHE_CONFIG = new InjectionToken<HttpCacheConfig>(
  "app.config HttpCacheConfig",
)
