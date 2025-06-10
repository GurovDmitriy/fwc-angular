import { Component } from "@angular/core"
import { NzColDirective, NzRowDirective } from "ng-zorro-antd/grid"
import { NzTypographyComponent } from "ng-zorro-antd/typography"

@Component({
  selector: "app-page-home",
  templateUrl: "./page-home.component.html",
  imports: [NzColDirective, NzRowDirective, NzTypographyComponent],
})
export class PageHomeComponent {}
