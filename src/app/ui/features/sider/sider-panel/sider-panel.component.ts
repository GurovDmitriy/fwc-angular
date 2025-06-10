import { Component, input, output } from "@angular/core"
import { RouterLink } from "@angular/router"
import { SvgIconComponent } from "angular-svg-icon"
import { NzButtonComponent } from "ng-zorro-antd/button"
import { NzIconDirective } from "ng-zorro-antd/icon"
import { NzMenuDirective, NzMenuItemComponent } from "ng-zorro-antd/menu"

@Component({
  selector: "app-sider-panel",
  templateUrl: "sider-panel.component.html",
  styleUrl: "sider-panel.component.scss",
  standalone: true,
  imports: [
    NzButtonComponent,
    NzIconDirective,
    SvgIconComponent,
    NzMenuDirective,
    NzMenuItemComponent,
    RouterLink,
  ],
})
export class SiderPanelComponent {
  isCollapsed = input(false)
  toggleMenu = output<null>()

  handleToggleMenu() {
    this.toggleMenu.emit(null)
  }

  // test ci
}
