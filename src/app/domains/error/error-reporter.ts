import { Inject, Injectable } from "@angular/core"
import { filter, Subject, takeUntil, tap } from "rxjs"
import { ErrorService, TOKEN_ERROR_SERVICE } from "../../core/error"

@Injectable()
export class ErrorReporter {
  private unsubscribe = new Subject<void>()

  constructor(@Inject(TOKEN_ERROR_SERVICE) private errorService: ErrorService) {
    this.errorService.error$
      .pipe(
        takeUntil(this.unsubscribe),
        filter((error) => Boolean(error)),
        tap((error) => {
          console.group("ErrorReporter")
          console.log(error)
          console.groupEnd()
        }),
      )
      .subscribe()
  }

  destroy() {
    this.unsubscribe.next()
    this.unsubscribe.complete()
  }
}
