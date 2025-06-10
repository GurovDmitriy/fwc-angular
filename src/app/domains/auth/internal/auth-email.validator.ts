import { inject, Injectable } from "@angular/core"
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from "@angular/forms"
import { catchError, map, Observable, of, switchMap, timer } from "rxjs"
import { AuthApiService } from "./auth-api.service"

@Injectable({ providedIn: "root" })
export class AuthEmailValidator implements AsyncValidator {
  private readonly api = inject(AuthApiService)

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return timer(1000).pipe(
      switchMap(() =>
        this.api.validateEmail({ email: control.value }).pipe(
          map(() => null),
          catchError(() => of({ customExistEmail: true })),
        ),
      ),
    )
  }
}
