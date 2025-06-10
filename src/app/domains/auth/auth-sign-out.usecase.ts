import { inject, Injectable } from "@angular/core"

import { Store } from "@ngrx/store"
import { filter, map, startWith } from "rxjs"
import { AuthBaseActions, AuthBaseFeature } from "./auth-base.store"

@Injectable({
  providedIn: "any",
})
export class AuthSignOutUsecase {
  private store = inject(Store)

  state$ = this.store.select(AuthBaseFeature.selectAuthState).pipe(
    filter((state) => state.statusDetail.includes("[Auth] signOut")),
    map((state) => {
      return {
        status: state.status,
        error: state.error,
      }
    }),
    startWith({
      status: "useless",
      error: null,
    }),
  )

  constructor() {}

  handle() {
    return this.store.dispatch(AuthBaseActions.signOut())
  }
}
