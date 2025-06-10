import { Component, inject } from "@angular/core"
import { TOKEN_ERROR_SERVICE } from "../../../core/error"

@Component({
  selector: "app-page-not-found",
  template: ` <div>not found</div> `,
  standalone: true,
})
export class PageNotFoundComponent {
  private errorService = inject(TOKEN_ERROR_SERVICE)

  constructor() {
    this.errorService.handle({
      status: 404,
      code: "app/error_client/not_found",
      message: "Page not found",
    })
  }
}
