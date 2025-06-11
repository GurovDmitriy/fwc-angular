import { DestroyRef, inject, Injectable } from "@angular/core"

import { FormBuilder, Validators } from "@angular/forms"
import { Store } from "@ngrx/store"
import { filter, Observable, Subject, takeUntil, tap } from "rxjs"
import { formErrorMapper } from "../../core/form"
import {
  AuthBaseActions,
  AuthBaseFeature,
  AuthBaseState,
} from "./auth-base.store"
import { AuthMeUpdatePayload } from "./types"

@Injectable({
  providedIn: "any",
})
export class AuthMeUpdateUsecase {
  private destroyRef = inject(DestroyRef)
  private unsubscribe = new Subject<void>()

  private store = inject(Store)
  private formBuilder = inject(FormBuilder)

  form = this.formBuilder.group({
    name: ["", [Validators.required]],
  })

  errorMessages$ = this.form.statusChanges.pipe(
    formErrorMapper(this.form, {
      name: {
        required: () => "field is required",
      },
    }),
  )

  state$: Observable<AuthBaseState> = this.store
    .select(AuthBaseFeature.selectAuthState)
    .pipe(filter((state) => state.statusDetail.includes("[Auth] me")))

  constructor() {
    this.state$
      .pipe(
        takeUntil(this.unsubscribe),
        filter((state) => state.statusIs.success),
        tap((state) => {
          this.form.patchValue({ name: state.user?.["name"] ?? "" })
        }),
      )
      .subscribe()

    this.destroyRef.onDestroy(() => {
      this.destroy()
    })
  }

  handle(): void {
    if (!this.form.valid) return

    this.store.dispatch(
      AuthBaseActions.meUpdate({
        payload: { ...(this.form.value as AuthMeUpdatePayload) },
      }),
    )
  }

  destroy() {
    this.form.reset()
    this.unsubscribe.next()
    this.unsubscribe.complete()
  }
}
