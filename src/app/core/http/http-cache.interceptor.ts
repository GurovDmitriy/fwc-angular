import { HttpInterceptorFn } from "@angular/common/http"
import { inject } from "@angular/core"
import { HttpCache } from "./http-cache"

export const httpCacheInterceptor: HttpInterceptorFn = (req, next) => {
  const cache = inject(HttpCache)

  return cache.connect(req, next)
}
