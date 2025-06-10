import { Observable } from "rxjs"

export interface ErrorService {
  error$: Observable<ErrorMapped | null>
  handle(error: any): ErrorMapped
}

export interface ErrorMapper {
  handle(error: any): ErrorMapped
}

export interface ErrorFactory<TParams = any, TError = any> {
  create(params: TParams): TError
}

export interface ErrorCustom {
  status: number
  code: string
  message: string
}

export interface ErrorMapped extends ErrorCustom {
  original: any
}

export interface ErrorSchema extends ErrorCustom {
  issues: any
}

export interface ErrorParams {
  status: number
  code: string
  message: string
}

export interface ErrorMappedParams extends ErrorParams {
  original: any
}

export interface ErrorSchemaParams extends ErrorParams {
  issues: any
}
