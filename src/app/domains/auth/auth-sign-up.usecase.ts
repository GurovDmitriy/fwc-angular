import { inject, Injectable } from "@angular/core"

import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms"
import { Store } from "@ngrx/store"
import { BehaviorSubject, filter, Observable } from "rxjs"
import {
  formErrorMapper,
  FormFieldMeta,
  formSameAsValidator,
} from "../../core/form"
import {
  AUTH_FILTER_NAME,
  AuthBaseActions,
  AuthBaseFeature,
  AuthBaseState,
} from "./auth-base.store"
import { AuthEmailValidator } from "./internal/auth-email.validator"
import { AuthSignUpPayload } from "./types"

export interface AuthSignUpForm {
  name: FormControl<string | null>
  email: FormControl<string | null>
  password: FormControl<string | null>
  passwordConfirm: FormControl<string | null>
  about?: FormControl<string | null>
}

@Injectable({
  providedIn: "any",
})
export class AuthSignUpUsecase {
  private store = inject(Store)
  private formBuilder = inject(FormBuilder)
  private authEmailValidator = inject(AuthEmailValidator)

  form: FormGroup<AuthSignUpForm> = this.formBuilder.group(
    {
      name: ["", [Validators.required]],
      email: [
        "",
        {
          validators: [Validators.required, Validators.email],
          asyncValidators: [
            this.authEmailValidator.validate.bind(this.authEmailValidator),
          ],
          // updateOn: "blur",
        },
      ],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],
      passwordConfirm: [
        "",
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],
    },
    {
      validators: [formSameAsValidator("passwordConfirm", "password")],
    },
  ) as FormGroup<AuthSignUpForm>

  errorMessages$ = this.form.statusChanges.pipe(
    formErrorMapper(
      this.form,
      {
        name: {
          required: () => "field is required",
        },

        email: {
          required: () => "field is required",
          email: () => "email format is invalid",
          customExistEmail: () => "email is already exist",
        },

        password: {
          required: () => "field is required",
          minlength: (params: any) =>
            `minimum ${params.requiredLength} symbols`,
          maxlength: () => "character limit exceeded",
        },

        passwordConfirm: {
          required: () => "field is required",
          minlength: (params: any) =>
            `minimum ${params.requiredLength} symbols`,
          maxlength: () => "character limit exceeded",
        },

        about: {
          required: () => "field is required",
          minlength: (params: any) =>
            `minimum ${params.requiredLength} symbols`,
          maxlength: () => "character limit exceeded",
        },
      },
      {
        passwordConfirm: {
          customSameAs: (params: any) =>
            `${params.fieldCurrent} should be same as ${params.filedMatching}`,
        },
      },
    ),
  )

  private formMetaSubject = new BehaviorSubject<
    FormFieldMeta<keyof AuthSignUpForm>[]
  >([
    {
      typeView: "text",
      name: "name",
      placeholder: "Name",
      icon: "user",
    },
    {
      typeView: "email",
      name: "email",
      placeholder: "Email",
      icon: "mail",
    },
    {
      typeView: "password",
      name: "password",
      placeholder: "Password",
      icon: "lock",
    },
    {
      typeView: "password",
      name: "passwordConfirm",
      placeholder: "Confirm password",
      icon: "lock",
    },
  ])

  formMeta$ = this.formMetaSubject.asObservable()

  state$: Observable<AuthBaseState> = this.store
    .select(AuthBaseFeature.selectAuthState)
    .pipe(
      filter((state) => state.statusDetail.includes(AUTH_FILTER_NAME.signUp)),
    )

  constructor() {}

  handle(): void {
    if (!this.form.valid) return

    this.store.dispatch(
      AuthBaseActions.signUp({
        payload: {
          ...this.form.value,
        } as AuthSignUpPayload,
      }),
    )
  }

  toggleAbout() {
    if (!this.form.get("about")) {
      this.form.addControl(
        "about",
        new FormControl("", [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(100),
        ]),
      )

      this.formMetaSubject.next([
        ...this.formMetaSubject.getValue(),
        {
          typeView: "textarea",
          name: "about",
          placeholder: "About",
          icon: "highlight",
        },
      ])
    } else {
      this.form.removeControl("about")

      this.formMetaSubject.next([
        ...this.formMetaSubject.getValue().filter((m) => m.name !== "about"),
      ])
    }
  }
}
