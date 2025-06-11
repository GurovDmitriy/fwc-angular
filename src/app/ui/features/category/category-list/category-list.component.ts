import { AsyncPipe, NgOptimizedImage } from "@angular/common"
import { Component, inject } from "@angular/core"
import { ActivatedRoute, RouterLink } from "@angular/router"
import { NzCardComponent } from "ng-zorro-antd/card"
import { NzColDirective, NzRowDirective } from "ng-zorro-antd/grid"
import { switchMap } from "rxjs"
import { ProductByCategoryUsecase } from "../../../../domains/product"

@Component({
  selector: "app-category-list",
  templateUrl: "./category-list.component.html",
  styleUrl: "./category-list.component.scss",
  imports: [
    NgOptimizedImage,
    NzColDirective,
    NzRowDirective,
    AsyncPipe,
    NzCardComponent,
    RouterLink,
  ],
})
export class CategoryListComponent {
  private route = inject(ActivatedRoute)

  category = inject(ProductByCategoryUsecase)

  state$ = this.route.params.pipe(
    switchMap((params) => this.category.handle(params["categoryId"])),
  )

  placeholder = Array.from({ length: 16 }, (v, k) => ({ id: k }))

  constructor() {}
}
