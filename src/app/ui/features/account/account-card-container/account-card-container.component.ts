import { Component, signal } from "@angular/core"
import { AccountCardComponent } from "./internal/account-card"
import { AccountCardEditComponent } from "./internal/account-card-edit"

type Mode = "default" | "edit"

@Component({
  selector: "app-account-card-container",
  templateUrl: "./account-card-container.component.html",
  imports: [AccountCardComponent, AccountCardEditComponent],
})
export class AccountCardContainerComponent {
  mode = signal<Mode>("default")

  toggleMode(mode: Mode) {
    this.mode.set(mode)
  }
}
