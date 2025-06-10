import { Component } from "@angular/core"
import { NzTypographyComponent } from "ng-zorro-antd/typography"

@Component({
  selector: "app-footer-panel",
  templateUrl: "footer-panel.component.html",
  styleUrl: "footer-panel.component.scss",
  standalone: true,
  imports: [NzTypographyComponent],
})
export class FooterPanelComponent {}
