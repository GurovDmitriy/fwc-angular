import { AsyncPipe, KeyValuePipe } from "@angular/common"
import { Component, DestroyRef, inject, OnInit } from "@angular/core"
import { takeUntilDestroyed } from "@angular/core/rxjs-interop"
import { ReactiveFormsModule } from "@angular/forms"
import { RouterLink } from "@angular/router"
import { NzAlertComponent } from "ng-zorro-antd/alert"
import { NzButtonModule } from "ng-zorro-antd/button"
import { NzCardComponent } from "ng-zorro-antd/card"
import { NzCheckboxModule } from "ng-zorro-antd/checkbox"
import { NzFormModule } from "ng-zorro-antd/form"
import { NzInputModule } from "ng-zorro-antd/input"
import { filter, Subject, tap } from "rxjs"
import { FormFieldDynamicComponent } from "../../../../core/form"
import { AuthSignUpUsecase } from "../../../../domains/auth"

type Action = "submit"

@Component({
  selector: "app-sign-up-form",
  imports: [
    ReactiveFormsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule,
    RouterLink,
    NzCardComponent,
    NzAlertComponent,
    AsyncPipe,
    FormFieldDynamicComponent,
    KeyValuePipe,
  ],
  providers: [AuthSignUpUsecase],
  templateUrl: "./sign-up-form.component.html",
  styleUrl: "./sign-up-form.component.scss",
  standalone: true,
})
export class SignUpFormComponent implements OnInit {
  private actionSubject = new Subject<Action>()
  private action$ = this.actionSubject.asObservable()
  private destroyRef = inject(DestroyRef)

  private signUpAction$ = this.action$.pipe(
    filter((action) => action === "submit"),
    tap(() => {
      this.signUp.handle()
    }),
  )

  signUp = inject(AuthSignUpUsecase)

  constructor() {}

  ngOnInit() {
    this.signUpAction$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe()
  }

  handleAction(action: Action) {
    this.actionSubject.next(action)
  }
}
