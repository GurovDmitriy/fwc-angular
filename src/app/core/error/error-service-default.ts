import { Inject, Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import { ErrorMappedBase } from "./error-mapped-base"
import { TOKEN_ERROR_MAPPER } from "./token"
import type { ErrorMapped, ErrorMapper, ErrorService } from "./types"

@Injectable()
export class ErrorServiceDefault implements ErrorService {
  private errorSubject = new BehaviorSubject<ErrorMapped | null>(null)
  error$ = this.errorSubject.asObservable()

  constructor(@Inject(TOKEN_ERROR_MAPPER) private errorMapper: ErrorMapper) {}

  handle(error: any): ErrorMapped {
    if (error === this.errorSubject.getValue()) {
      return error
    }

    if (error instanceof ErrorMappedBase) {
      this.errorSubject.next(error)
      return error
    }

    const errorMapped = this.errorMapper.handle(error)
    this.errorSubject.next(errorMapped)

    return errorMapped
  }
}
