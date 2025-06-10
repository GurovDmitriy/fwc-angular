import { HttpInterceptorFn } from "@angular/common/http"
import { inject } from "@angular/core"
import { catchError } from "rxjs"
import { TOKEN_ERROR_SERVICE } from "../../core/error"

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(TOKEN_ERROR_SERVICE)

  return next(req).pipe(
    catchError((error) => {
      throw errorService.handle(error)
    }),
  )
}
