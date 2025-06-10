import { HttpErrorResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import {
  ErrorMappedBaseFactory,
  ErrorSchemaBase,
  type ErrorMapped,
  type ErrorMapper,
} from "../../core/error"
import { ERROR_MAPPED_CODE } from "./types"

/**
 * - Map error to custom code
 */
@Injectable({
  providedIn: "root",
})
export class ErrorMapperCustom implements ErrorMapper {
  constructor(private errorFactory: ErrorMappedBaseFactory) {}

  handle(error: any): ErrorMapped {
    if (error instanceof HttpErrorResponse) {
      if ((error as any).error?.details?.[0]?.fieldViolations) {
        return this.errorFactory.create({
          status: error.status,
          code: ERROR_MAPPED_CODE["app/error_mapped/http/form_validation"],
          message: error.error.message,
          original: error,
        })
      }

      if (error.status === 422) {
        return this.errorFactory.create({
          status: error.status,
          code: "app/error_mapped/http/invalid_credential",
          message: "Email or password is incorrect",
          original: error,
        })
      }

      return this.errorFactory.create({
        status: error.status,
        code: ERROR_MAPPED_CODE["app/error_mapped/http/not_found"],
        message: "Not found",
        original: error,
      })
    }

    if (error instanceof ErrorSchemaBase) {
      if ((error as any).issues) {
        return this.errorFactory.create({
          status: error.status,
          code: ERROR_MAPPED_CODE["app/error_mapped/schema/schema_not_valid"],
          message: "Error response type",
          original: error,
        })
      }

      return this.errorFactory.create({
        status: error.status,
        code: ERROR_MAPPED_CODE["app/error_mapped/schema/schema_not_valid"],
        message: "Error response type",
        original: error,
      })
    }

    return this.errorFactory.create({
      status: 0,
      code: ERROR_MAPPED_CODE["app/error_mapped/unknown"],
      message: "Unknown error",
      original: error,
    })
  }
}
