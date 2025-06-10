import { Injectable } from "@angular/core"
import { ErrorMappedBase } from "./error-mapped-base"
import type { ErrorFactory, ErrorMapped, ErrorMappedParams } from "./types"

@Injectable({
  providedIn: "root",
})
export class ErrorMappedBaseFactory
  implements ErrorFactory<ErrorMappedParams, ErrorMapped>
{
  create(params: ErrorMappedParams): ErrorMapped {
    return new ErrorMappedBase(params)
  }
}
