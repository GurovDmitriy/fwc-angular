import { Component } from "@angular/core"
import { NzTypographyComponent } from "ng-zorro-antd/typography"

@Component({
  selector: "app-header-panel",
  templateUrl: "header-panel.component.html",
  styleUrl: "header-panel.component.scss",
  standalone: true,
  imports: [NzTypographyComponent],
})
export class HeaderPanelComponent {}
