import { Component } from "@angular/core"
import { NzColDirective, NzRowDirective } from "ng-zorro-antd/grid"
import { NzTypographyComponent } from "ng-zorro-antd/typography"
import { ProductDetailComponent } from "../../../ui/features/product/product-detail/product-detail.component"

@Component({
  selector: "app-page-category",
  imports: [
    NzColDirective,
    NzRowDirective,
    NzTypographyComponent,
    ProductDetailComponent,
  ],
  templateUrl: "./page-product.component.html",
})
export class PageProductComponent {}
