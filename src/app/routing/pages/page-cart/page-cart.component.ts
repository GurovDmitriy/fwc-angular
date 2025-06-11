import { Component } from "@angular/core"
import { NzColDirective, NzRowDirective } from "ng-zorro-antd/grid"
import { NzTypographyComponent } from "ng-zorro-antd/typography"
import { CartDetailComponent } from "../../../ui/features/cart/cart-detail/cart-detail.component"

@Component({
  selector: "app-page-cart",
  imports: [
    NzColDirective,
    NzRowDirective,
    NzTypographyComponent,
    CartDetailComponent,
  ],
  templateUrl: "./page-cart.component.html",
})
export class PageCartComponent {}
