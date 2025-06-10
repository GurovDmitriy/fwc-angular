import { AsyncPipe, NgIf } from "@angular/common"
import { Component, inject } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { WaResizeObserver } from "@ng-web-apis/resize-observer"
import { NzAffixComponent } from "ng-zorro-antd/affix"
import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb"
import { NzIconModule } from "ng-zorro-antd/icon"
import { NzLayoutModule } from "ng-zorro-antd/layout"
import { NzMenuModule } from "ng-zorro-antd/menu"
import { TOKEN_MEDIA_QUERY } from "../../../core/media-query"
import { FooterPanelComponent } from "../../../ui/features/footer/footer-panel"
import { FooterPanelMobileComponent } from "../../../ui/features/footer/footer-panel-mobile"
import { HeaderPanelComponent } from "../../../ui/features/header/header-panel"
import { SiderPanelComponent } from "../../../ui/features/sider/sider-panel"

@Component({
  selector: "app-layout-home",
  imports: [
    NzBreadCrumbModule,
    NzIconModule,
    NzMenuModule,
    NzLayoutModule,
    RouterOutlet,
    NgIf,
    AsyncPipe,
    NzAffixComponent,
    WaResizeObserver,
    FooterPanelComponent,
    FooterPanelMobileComponent,
    SiderPanelComponent,
    HeaderPanelComponent,
  ],
  templateUrl: "./layout-home.component.html",
  styleUrl: "./layout-home.component.scss",
})
export class LayoutHomeComponent {
  media = inject(TOKEN_MEDIA_QUERY)

  isOpenDrawer = false
  isCollapsedSider = true

  handleMenuToggle(value?: boolean) {
    if (value) {
      this.isCollapsedSider = value
      this.isOpenDrawer = value
    }

    this.isCollapsedSider = !this.isCollapsedSider
    this.isOpenDrawer = !this.isOpenDrawer
  }

  handleResizeHeader(evt: any) {
    requestAnimationFrame(() => {
      const el = document.querySelector(".ant-affix") as HTMLElement
      const el2 = document.querySelector(
        ".layout-home__header-affix",
      ) as HTMLElement

      if (el) {
        el.style.left = `calc(100% - ${evt[0].contentRect.width}px)`
        el.style.width = `${evt[0].contentRect.width}px`
      }
      if (el2) {
        el2.style.left = `calc(100% - ${evt[0].contentRect.width}px)`
        el2.style.width = `${evt[0].contentRect.width}px`
      }
    })
  }
}
