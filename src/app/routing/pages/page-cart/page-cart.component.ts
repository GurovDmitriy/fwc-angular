import { Component } from "@angular/core"
import { NzColDirective, NzRowDirective } from "ng-zorro-antd/grid"
import { NzTypographyComponent } from "ng-zorro-antd/typography"

@Component({
  selector: "app-page-cart",
  imports: [NzColDirective, NzRowDirective, NzTypographyComponent],
  templateUrl: "./page-cart.component.html",
})
export class PageCartComponent {}
