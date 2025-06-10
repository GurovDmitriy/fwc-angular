import { AsyncPipe } from "@angular/common"
import { Component, inject } from "@angular/core"
import { NzAvatarComponent } from "ng-zorro-antd/avatar"
import { NzButtonComponent } from "ng-zorro-antd/button"
import { NzCardComponent, NzCardMetaComponent } from "ng-zorro-antd/card"
import { NzWaveDirective } from "ng-zorro-antd/core/wave"
import { NzIconDirective } from "ng-zorro-antd/icon"
import { NzSkeletonComponent } from "ng-zorro-antd/skeleton"
import { AuthMeUsecase } from "../../../../domains/auth"
import { AuthSignOutUsecase } from "../../../../domains/auth/auth-sign-out.usecase"

@Component({
  selector: "app-account-card",
  templateUrl: "./account-card.component.html",
  imports: [
    AsyncPipe,
    NzCardComponent,
    NzCardMetaComponent,
    NzSkeletonComponent,
    NzAvatarComponent,
    NzIconDirective,
    NzButtonComponent,
    NzWaveDirective,
  ],
})
export class AccountCardComponent {
  me = inject(AuthMeUsecase)
  sign = inject(AuthSignOutUsecase)

  state$ = this.me.state$

  handleSignOut() {
    this.sign.handle()
  }

  handleUpdate() {}
  handleRemove() {}
}
