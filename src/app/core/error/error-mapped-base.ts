import { ErrorBase } from "./error-base"
import type { ErrorMapped, ErrorMappedParams } from "./types"

export class ErrorMappedBase extends ErrorBase implements ErrorMapped {
  original: any | null | undefined

  constructor(params: ErrorMappedParams) {
    super(params)

    this.original = params.original
  }
}
