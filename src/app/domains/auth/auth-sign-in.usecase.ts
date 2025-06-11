import { inject, Injectable } from "@angular/core"

import { FormBuilder, Validators } from "@angular/forms"
import { Store } from "@ngrx/store"
import { filter, Observable } from "rxjs"
import { formErrorMapper } from "../../core/form"
import {
  AuthBaseActions,
  AuthBaseFeature,
  AuthBaseState,
} from "./auth-base.store"
import { AuthSignInPayload } from "./types"

@Injectable({
  providedIn: "any",
})
export class AuthSignInUsecase {
  private store = inject(Store)
  private formBuilder = inject(FormBuilder)

  form = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
    password: [
      "",
      [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    ],
  })

  errorMessages$ = this.form.statusChanges.pipe(
    formErrorMapper(this.form, {
      email: {
        required: () => "field is required",
        email: () => "email format is invalid",
      },

      password: {
        required: () => "field is required",
        minlength: (params: any) => `minimum ${params.requiredLength} symbols`,
        maxlength: () => "character limit exceeded",
      },
    }),
  )

  state$: Observable<AuthBaseState> = this.store
    .select(AuthBaseFeature.selectAuthState)
    .pipe(filter((state) => state.statusDetail.includes("[Auth] signIn")))

  constructor() {}

  handle(): void {
    if (!this.form.valid) return

    this.store.dispatch(
      AuthBaseActions.signIn({
        payload: { ...(this.form.value as AuthSignInPayload) },
      }),
    )
  }
}
