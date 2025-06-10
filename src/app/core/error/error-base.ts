import { ErrorCustom, ErrorParams } from "./types"

export class ErrorBase implements ErrorCustom {
  status: number
  code: string
  message: string

  constructor(params: ErrorParams) {
    this.status = params.status
    this.code = params.code
    this.message = params.message
  }
}
