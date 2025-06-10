import { Component } from "@angular/core"
import { RouterLink } from "@angular/router"
import { NzIconDirective } from "ng-zorro-antd/icon"
import { NzMenuDirective, NzMenuItemComponent } from "ng-zorro-antd/menu"

@Component({
  selector: "app-footer-panel-mobile",
  templateUrl: "footer-panel-mobile.component.html",
  styleUrl: "footer-panel-mobile.component.scss",
  standalone: true,
  imports: [NzIconDirective, NzMenuDirective, NzMenuItemComponent, RouterLink],
})
export class FooterPanelMobileComponent {}
