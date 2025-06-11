import { inject, Injectable } from "@angular/core"

import { Store } from "@ngrx/store"
import { Observable } from "rxjs"
import { ErrorMapped } from "../../core/error"
import { StatusName } from "../../core/status"
import { AuthBaseFeature } from "./auth-base.store"
import { AuthUser } from "./types"

export interface AuthMeUsecaseState {
  status: StatusName
  user: AuthUser | null
  error: ErrorMapped | null
}

@Injectable({
  providedIn: "any",
})
export class AuthMeUsecase {
  private store = inject(Store)

  state$: Observable<AuthMeUsecaseState> = this.store.select(
    AuthBaseFeature.selectAuthState,
  )

  constructor() {}

  handle() {}
}
