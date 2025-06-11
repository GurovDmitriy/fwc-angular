import { Component, inject, output, Signal } from "@angular/core"
import { toSignal } from "@angular/core/rxjs-interop"
import { NzAvatarComponent } from "ng-zorro-antd/avatar"
import { NzButtonComponent } from "ng-zorro-antd/button"
import { NzCardComponent, NzCardMetaComponent } from "ng-zorro-antd/card"
import { NzWaveDirective } from "ng-zorro-antd/core/wave"
import { NzIconDirective } from "ng-zorro-antd/icon"
import { NzSkeletonComponent } from "ng-zorro-antd/skeleton"
import { map } from "rxjs"
import { Status, StatusName } from "../../../../../../core/status"
import { AuthMeUsecase, AuthUser } from "../../../../../../domains/auth"
import { AuthSignOutUsecase } from "../../../../../../domains/auth/auth-sign-out.usecase"
import { Nullable } from "../../../../../../shared/utils/types"

interface State {
  status: StatusName
  user: Nullable<AuthUser>
}

@Component({
  selector: "app-account-card",
  templateUrl: "./account-card.component.html",
  imports: [
    NzCardComponent,
    NzCardMetaComponent,
    NzSkeletonComponent,
    NzAvatarComponent,
    NzIconDirective,
    NzButtonComponent,
    NzWaveDirective,
  ],
  providers: [AuthMeUsecase],
})
export class AccountCardComponent {
  me = inject(AuthMeUsecase)
  sign = inject(AuthSignOutUsecase)

  actionEdit = output<void>()

  state: Signal<State> = toSignal(
    this.me.state$.pipe(
      map((state) => {
        return {
          status: state.status,
          user: {
            id: state.user?.id ?? null,
            name: state.user?.name ?? null,
            email: state.user?.email ?? null,
          },
        }
      }),
    ),
    {
      initialValue: {
        status: Status.useless,
        user: {
          id: null,
          name: null,
          email: null,
        },
      },
    },
  )

  handleSignOut() {
    this.sign.handle()
  }

  handleUpdate() {
    this.actionEdit.emit()
  }

  handleRemove() {}
}
