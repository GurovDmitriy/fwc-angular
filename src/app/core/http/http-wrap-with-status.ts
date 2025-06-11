import { catchError, defer, map, Observable, of, startWith } from "rxjs"

export function httpWrapWithStatus<TData = any, TError = any>(
  condition: () => boolean = () => true,
) {
  return (
    observable: Observable<TData>,
  ): Observable<{
    status: "useless" | "pending" | "success" | "failure"
    data: TData | null
    error: TError | null
    useless: boolean
    pending: boolean
    success: boolean
    failure: boolean
  }> => {
    return defer(() => {
      if (condition()) {
        return observable.pipe(
          map((data) => ({
            status: "success" as const,
            data,
            error: null,
            useless: false,
            pending: false,
            success: true,
            failure: false,
          })),
          catchError((error) => {
            return of({
              status: "failure" as const,
              data: null,
              error,
              useless: false,
              pending: false,
              success: false,
              failure: true,
            })
          }),
          startWith({
            status: "pending" as const,
            data: null,
            error: null,
            useless: false,
            pending: true,
            success: false,
            failure: false,
          }),
        )
      } else {
        return of({
          status: "useless" as const,
          data: null,
          error: null,
          useless: true,
          pending: false,
          success: false,
          failure: false,
        })
      }
    })
  }
}
