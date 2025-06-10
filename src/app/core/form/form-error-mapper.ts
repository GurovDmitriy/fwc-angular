import { Injectable } from "@angular/core"
import { FormGroup } from "@angular/forms"
import { map, Observable } from "rxjs"

/**
 * Example:
 *
 * ```ts
 *  errorMessage$ = this.form.statusChanges.pipe(
 *     formErrorMapper(this.form, {
 *       name: {
 *         required: () => "field is required",
 *       },
 *       phone: {
 *         required: () => "field is required",
 *       },
 *     } as const),
 *   )
 * ```
 */
export function formErrorMapper<
  TFormGroup extends FormGroup,
  TErrorMap extends Record<string, any>,
>(formGroup: TFormGroup, errorMap: TErrorMap) {
  return (
    observable: Observable<any>,
  ): Observable<Record<keyof TErrorMap, string>> => {
    return new Observable<Record<keyof TErrorMap, string>>((subscriber) => {
      const subscription = observable.subscribe({
        next() {
          const _newValue = Object.entries(formGroup.controls).reduce(
            (prev, next: any) => {
              return {
                ...prev,
                [next[0]]: !(errorMap[next[0]] && next[1].errors)
                  ? ""
                  : Object.entries(next[1].errors)
                      .reduce<string[]>((messages, [errorKey, errorValue]) => {
                        messages.push(errorMap[next[0]][errorKey](errorValue))
                        return messages
                      }, [])
                      .join(", "),
              }
            },
            {},
          )

          subscriber.next(_newValue as any)
        },
        error(error: any) {
          subscriber.error(error)
        },
        complete() {
          subscriber.complete()
        },
      })

      return () => {
        subscription.unsubscribe()
      }
    })
  }
}

/**
 * Example:
 *
 * ```ts
 *   errorMessage$ = this.formErrorMapper.create(this.form, {
 *     name: {
 *       required: () => "field is required",
 *     },
 *     phone: {
 *       required: () => "field is required",
 *     },
 *   } as const)
 * ```
 */
@Injectable({
  providedIn: "any",
})
export class FormErrorMapper<
  TFormGroup extends FormGroup,
  TErrorMap extends Record<string, any>,
> {
  constructor() {}

  create(
    form: TFormGroup,
    errorMap: TErrorMap,
  ): Observable<Record<keyof TErrorMap, string>> {
    return form.statusChanges.pipe(
      map(() => {
        return Object.entries(form.controls).reduce((prev, next) => {
          return {
            ...prev,
            [next[0]]: this._getErrorMessage(errorMap, next[0], next[1].errors),
          }
        }, {})
      }),
    ) as Observable<Record<keyof TErrorMap, string>>
  }

  private _getErrorMessage(
    errorMap: any,
    name: any,
    errors: any,
  ): string | null {
    if (errorMap[name] && errors) {
      return Object.entries(errors)
        .reduce<string[]>((messages, [errorKey, errorValue]) => {
          messages.push(errorMap[name][errorKey](errorValue))
          return messages
        }, [])
        .join(", ")
    }

    return null
  }
}
