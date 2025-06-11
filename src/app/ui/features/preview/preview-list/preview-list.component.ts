import { AsyncPipe, NgOptimizedImage } from "@angular/common"
import { Component, inject } from "@angular/core"
import { RouterLink } from "@angular/router"
import { NzCardComponent } from "ng-zorro-antd/card"
import { NzColDirective, NzRowDirective } from "ng-zorro-antd/grid"
import { PreviewListUsecase } from "../../../../domains/preview"

@Component({
  selector: "app-preview-list",
  templateUrl: "./preview-list.component.html",
  styleUrl: "./preview-list.component.scss",
  imports: [
    NgOptimizedImage,
    NzColDirective,
    NzRowDirective,
    AsyncPipe,
    NzCardComponent,
    RouterLink,
  ],
})
export class PreviewListComponent {
  preview = inject(PreviewListUsecase)

  state$ = this.preview.handle()

  placeholder = Array.from({ length: 16 }, (v, k) => ({ id: k }))

  constructor() {}
}
