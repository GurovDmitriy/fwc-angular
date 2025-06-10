import { HttpContextToken, HttpInterceptorFn } from "@angular/common/http"
import { inject } from "@angular/core"
import { Store } from "@ngrx/store"
import { catchError, concatMap, filter, take, throwError } from "rxjs"
import { ErrorBaseFactory } from "../../core/error"
import { AuthBaseActions, AuthBaseFeature } from "./auth-base.store"

const TOKEN_REFRESH_SKIP = new HttpContextToken(() => false)

export const authTokenRefreshInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store)
  const errorFactory = inject(ErrorBaseFactory)

  const authState$ = store.select(AuthBaseFeature.selectAuthState)

  if (req.context.get(TOKEN_REFRESH_SKIP)) {
    return next(req)
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 && !req.url.includes("refresh")) {
        store.dispatch(AuthBaseActions.tokenRefresh())

        return authState$.pipe(
          filter(
            (state) => state.status === "success" || state.status === "failure",
          ),
          take(1),
          concatMap((state) => {
            if (state.status === "success") {
              const clonedReq = req.clone({
                context: req.context.set(TOKEN_REFRESH_SKIP, true),
              })
              return next(clonedReq)
            } else {
              return throwError(() =>
                errorFactory.create({
                  status: 0,
                  code: "app/auth/token_refresh_failed",
                  message: "Token refresh failed",
                }),
              )
            }
          }),
        )
      }
      return throwError(() => error)
    }),
  )
}
