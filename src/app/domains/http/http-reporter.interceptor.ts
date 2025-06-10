import { HttpEventType, HttpInterceptorFn } from "@angular/common/http"
import { tap } from "rxjs"

export const httpReporterInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response) {
        console.group("httpReporterInterceptor:")

        console.log("request:")
        console.log(req)
        console.log("response:")
        console.log(event)

        console.groupEnd()
      }
    }),
  )
}
