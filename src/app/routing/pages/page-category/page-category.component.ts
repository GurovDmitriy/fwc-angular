import { Component } from "@angular/core"
import { NzColDirective, NzRowDirective } from "ng-zorro-antd/grid"
import { NzTypographyComponent } from "ng-zorro-antd/typography"
import { CategoryListComponent } from "../../../ui/features/category/category-list/category-list.component"

@Component({
  selector: "app-page-category",
  imports: [
    NzColDirective,
    NzRowDirective,
    NzTypographyComponent,
    CategoryListComponent,
  ],
  templateUrl: "./page-category.component.html",
})
export class PageCategoryComponent {}
