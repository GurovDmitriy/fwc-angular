import { Injectable } from "@angular/core"
import { ErrorBase } from "./error-base"
import type { ErrorFactory, ErrorParams } from "./types"

@Injectable({
  providedIn: "root",
})
export class ErrorBaseFactory implements ErrorFactory<ErrorParams, ErrorBase> {
  create(params: ErrorParams): ErrorBase {
    return new ErrorBase(params)
  }
}
