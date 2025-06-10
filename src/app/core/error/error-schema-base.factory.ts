import { Injectable } from "@angular/core"
import { ErrorSchemaBase } from "./error-schema-base"
import type { ErrorFactory, ErrorSchema, ErrorSchemaParams } from "./types"

@Injectable({
  providedIn: "root",
})
export class ErrorSchemaBaseFactory
  implements ErrorFactory<ErrorSchemaParams, ErrorSchema>
{
  create(params: ErrorSchemaParams): ErrorSchema {
    return new ErrorSchemaBase(params)
  }
}
