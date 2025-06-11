import { Component, inject, input, output } from "@angular/core"
import { ActivatedRoute, RouterLink } from "@angular/router"
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
    NzMenuDirective,
    NzMenuItemComponent,
    RouterLink,
  ],
})
export class SiderPanelComponent {
  private route = inject(ActivatedRoute)

  isCollapsed = input(false)
  toggleMenu = output<null>()

  handleToggleMenu() {
    this.toggleMenu.emit(null)
  }
}
