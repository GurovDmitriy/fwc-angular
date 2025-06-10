import { Component } from "@angular/core"
import { NzColDirective, NzRowDirective } from "ng-zorro-antd/grid"
import { NzTypographyComponent } from "ng-zorro-antd/typography"
import { AccountCardComponent } from "../../../ui/features/account/account-card/account-card.component"

@Component({
  selector: "app-page-account",
  imports: [
    NzColDirective,
    NzRowDirective,
    NzTypographyComponent,
    AccountCardComponent,
  ],
  templateUrl: "./page-account.component.html",
})
export class PageAccountComponent {}
