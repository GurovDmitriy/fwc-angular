import { ErrorHandler, Inject, Injectable } from "@angular/core"
import { TOKEN_ERROR_SERVICE } from "./token"
import type { ErrorService } from "./types"

@Injectable()
export class ErrorHandlerDefault implements ErrorHandler {
  constructor(
    @Inject(TOKEN_ERROR_SERVICE) private errorService: ErrorService,
  ) {}

  handleError(error: any) {
    this.errorService.handle(error)
  }
}
