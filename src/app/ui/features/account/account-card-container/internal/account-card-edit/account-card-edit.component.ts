import { AsyncPipe } from "@angular/common"
import { Component, inject, output } from "@angular/core"
import { takeUntilDestroyed } from "@angular/core/rxjs-interop"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { NzButtonComponent } from "ng-zorro-antd/button"
import { NzCardComponent } from "ng-zorro-antd/card"
import { NzWaveDirective } from "ng-zorro-antd/core/wave"
import {
  NzFormControlComponent,
  NzFormDirective,
  NzFormItemComponent,
} from "ng-zorro-antd/form"
import { NzColDirective, NzRowDirective } from "ng-zorro-antd/grid"
import { NzIconDirective } from "ng-zorro-antd/icon"
import { NzInputDirective, NzInputGroupComponent } from "ng-zorro-antd/input"
import { NzTypographyComponent } from "ng-zorro-antd/typography"
import { tap } from "rxjs"
import { AuthMeUpdateUsecase } from "../../../../../../domains/auth/auth-me-edit.usecase"

@Component({
  selector: "app-account-card-edit",
  templateUrl: "./account-card-edit.component.html",
  imports: [
    NzCardComponent,
    NzButtonComponent,
    NzWaveDirective,
    FormsModule,
    NzColDirective,
    NzFormControlComponent,
    NzFormDirective,
    NzFormItemComponent,
    NzInputDirective,
    NzInputGroupComponent,
    NzRowDirective,
    ReactiveFormsModule,
    AsyncPipe,
    NzIconDirective,
    NzTypographyComponent,
  ],
  providers: [AuthMeUpdateUsecase],
})
export class AccountCardEditComponent {
  meUpdate = inject(AuthMeUpdateUsecase)

  actionReset = output<void>()

  constructor() {
    this.meUpdate.state$
      .pipe(
        takeUntilDestroyed(),
        tap((state) => {
          if (state.statusIs.success) {
            this.handleReset()
          }
        }),
      )
      .subscribe()
  }

  handleSave() {
    this.meUpdate.handle()
  }

  handleReset() {
    this.actionReset.emit()
  }
}
