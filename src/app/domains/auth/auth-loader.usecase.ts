import { inject, Injectable } from "@angular/core"

import { Store } from "@ngrx/store"
import { map, takeWhile } from "rxjs"
import { AuthBaseFeature } from "./auth-base.store"

@Injectable({
  providedIn: "any",
})
export class AuthLoaderUsecase {
  private store = inject(Store)

  state$ = this.store.select(AuthBaseFeature.selectStatus).pipe(
    map((status) => status === "pending" || status === "useless"),
    takeWhile((visible) => visible, true),
  )

  constructor() {}
}
