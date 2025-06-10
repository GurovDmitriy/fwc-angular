import { HttpInterceptorFn } from "@angular/common/http"
import { inject } from "@angular/core"
import { concatMap } from "rxjs"
import { AuthStorageService } from "./internal"

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(AuthStorageService)

  return storage.getItem("tokenAccess").pipe(
    concatMap((tokenAccess) => {
      const newReq = tokenAccess
        ? req.clone({
            headers: req.headers?.append(
              "Authorization",
              `Bearer ${tokenAccess}`,
            ),
          })
        : req

      return next(newReq)
    }),
  )
}
