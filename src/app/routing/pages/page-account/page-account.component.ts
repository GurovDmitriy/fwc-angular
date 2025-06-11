import { Component } from "@angular/core"
import { NzColDirective, NzRowDirective } from "ng-zorro-antd/grid"
import { NzTypographyComponent } from "ng-zorro-antd/typography"
import { AccountCardContainerComponent } from "../../../ui/features/account"

@Component({
  selector: "app-page-account",
  imports: [
    NzColDirective,
    NzRowDirective,
    NzTypographyComponent,
    AccountCardContainerComponent,
  ],
  templateUrl: "./page-account.component.html",
})
export class PageAccountComponent {}
