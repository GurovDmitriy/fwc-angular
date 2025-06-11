import { Component } from "@angular/core"
import { NzTypographyComponent } from "ng-zorro-antd/typography"
import { PreviewListComponent } from "../../../ui/features/preview/preview-list/preview-list.component"

@Component({
  selector: "app-page-home",
  templateUrl: "./page-home.component.html",
  styleUrl: "./page-home.component.scss",
  imports: [NzTypographyComponent, PreviewListComponent],
})
export class PageHomeComponent {}
