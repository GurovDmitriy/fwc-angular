import { Injectable } from "@angular/core"
import { ErrorHeavy } from "./error-heavy"
import type { ErrorFactory, ErrorParams } from "./types"

@Injectable({
  providedIn: "root",
})
export class ErrorHeavyFactory
  implements ErrorFactory<ErrorParams, ErrorHeavy>
{
  create(params: ErrorParams): ErrorHeavy {
    return new ErrorHeavy(params)
  }
}
