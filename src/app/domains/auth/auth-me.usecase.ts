import { inject, Injectable } from "@angular/core"

import { Store } from "@ngrx/store"
import { map, startWith, tap } from "rxjs"
import { AuthBaseFeature } from "./auth-base.store"

@Injectable({
  providedIn: "any",
})
export class AuthMeUsecase {
  private store = inject(Store)

  state$ = this.store.select(AuthBaseFeature.selectAuthState).pipe(
    tap((state) => {
      console.log(123, state)
    }),
    map((state) => {
      return {
        status: state.status,
        user: state.user,
        error: state.error,
      }
    }),
    startWith({
      status: "useless",
      user: null,
      error: null,
    }),
  )

  constructor() {}

  handle() {}
}
