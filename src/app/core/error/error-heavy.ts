import { ErrorCustom, ErrorParams } from "./types"

export class ErrorHeavy extends Error implements ErrorCustom {
  status: number
  code: string

  constructor(params: ErrorParams) {
    super(params.message)

    this.status = params.status
    this.code = params.code

    this.name = this.constructor.name

    if ((Error as any).captureStackTrace) {
      ;(Error as any).captureStackTrace(this, this.constructor)
    }
  }
}
