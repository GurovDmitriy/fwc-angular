import { Component } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import {
  NzContentComponent,
  NzFooterComponent,
  NzLayoutComponent,
} from "ng-zorro-antd/layout"

@Component({
  selector: "app-layout-auth",
  imports: [
    NzContentComponent,
    NzFooterComponent,
    NzLayoutComponent,
    RouterOutlet,
  ],
  templateUrl: "./layout-auth.component.html",
  styleUrl: "./layout-auth.component.scss",
})
export class LayoutAuthComponent {}
