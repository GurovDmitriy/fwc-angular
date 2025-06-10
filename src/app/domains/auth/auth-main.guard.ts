import { inject } from "@angular/core"
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from "@angular/router"
import { Store } from "@ngrx/store"
import { filter, map } from "rxjs"
import { AuthBaseFeature } from "./auth-base.store"

/**
 * If status success return true
 * If status failure return false
 * Filter "Auth to"
 */
export const authMainGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const store = inject(Store)
  const router = inject(Router)

  return store.select(AuthBaseFeature.selectAuthState).pipe(
    filter(
      (authState) =>
        authState.status === "success" || authState.status === "failure",
    ),
    map((authState) => {
      if (authState.isAuth) {
        return true
      } else {
        return router.createUrlTree(["/sign-in"], {
          queryParams: { redirectUrl: state.url },
        })
      }
    }),
  )
}
