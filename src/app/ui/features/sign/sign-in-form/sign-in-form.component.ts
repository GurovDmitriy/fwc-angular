import { AsyncPipe } from "@angular/common"
import { Component, inject, OnDestroy } from "@angular/core"
import { takeUntilDestroyed } from "@angular/core/rxjs-interop"
import { ReactiveFormsModule } from "@angular/forms"
import { RouterLink } from "@angular/router"
import { NzAlertComponent } from "ng-zorro-antd/alert"
import { NzButtonModule } from "ng-zorro-antd/button"
import { NzCardComponent } from "ng-zorro-antd/card"
import { NzCheckboxModule } from "ng-zorro-antd/checkbox"
import { NzFormModule } from "ng-zorro-antd/form"
import { NzInputModule } from "ng-zorro-antd/input"
import { NzSpaceComponent, NzSpaceItemDirective } from "ng-zorro-antd/space"
import { filter, Subject, tap } from "rxjs"
import { AuthSignInUsecase } from "../../../../domains/auth"

type Action = "submit"

@Component({
  selector: "app-sign-in-form",
  imports: [
    ReactiveFormsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule,
    RouterLink,
    NzAlertComponent,
    NzCardComponent,
    NzSpaceComponent,
    NzSpaceItemDirective,
    AsyncPipe,
  ],
  templateUrl: "./sign-in-form.component.html",
  styleUrl: "./sign-in-form.component.scss",
  standalone: true,
})
export class SignInFormComponent implements OnDestroy {
  private actionSubject = new Subject<Action>()
  private action$ = this.actionSubject.asObservable()

  signIn = inject(AuthSignInUsecase)

  private signInAction$ = this.action$.pipe(
    filter((action) => action === "submit"),
    tap(() => {
      this.signIn.handle()
    }),
  )

  constructor() {
    this.signInAction$.pipe(takeUntilDestroyed()).subscribe()
  }

  handleAction(action: Action): void {
    this.actionSubject.next(action)
  }

  ngOnDestroy() {
    this.signIn.destroy()
  }
}
