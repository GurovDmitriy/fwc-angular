import { inject, Injectable } from "@angular/core"
import * as v from "valibot"
import {
  ErrorSchemaBaseFactory,
  TOKEN_ERROR_SERVICE,
} from "../../../core/error"

@Injectable({
  providedIn: "root",
})
export class AuthSchema {
  private errorService = inject(TOKEN_ERROR_SERVICE)
  private errorFactory = inject(ErrorSchemaBaseFactory)

  private readonly signResponse = v.object({
    id: v.string(),
    tokenAccess: v.string(),
    tokenRefresh: v.string(),
  })

  private readonly tokenRefreshResponse = v.object({
    id: v.string(),
    tokenAccess: v.string(),
    tokenRefresh: v.string(),
  })

  private readonly meResponse = v.object({
    id: v.string(),
    name: v.string(),
    email: v.string(),
  })

  private readonly signTransform = v.pipe(
    this.signResponse,
    v.transform((value) => {
      return {
        id: value.id,
        tokenAccess: value.tokenAccess,
        tokenRefresh: value.tokenRefresh,
      }
    }),
  )

  private readonly tokenRefreshTransform = v.pipe(
    this.tokenRefreshResponse,
    v.transform((value) => {
      return {
        id: value.id,
        tokenAccess: value.tokenAccess,
        tokenRefresh: value.tokenRefresh,
      }
    }),
  )

  private readonly meTransform = v.pipe(
    this.meResponse,
    v.transform((value) => {
      return {
        id: value.id,
        name: value.name,
        email: value.email,
      }
    }),
  )

  constructor() {}

  signIn(response: unknown) {
    const result = v.safeParse(this.signTransform, response)

    if (result.issues) {
      throw this.errorService.handle(
        this.errorFactory.create({
          status: 0,
          code: "app/auth/schema/signUp/response_not_valid",
          message: "Response schema not valid",
          issues: result.issues,
        }),
      )
    }

    return result.output
  }

  signUp(response: unknown) {
    const result = v.safeParse(this.signTransform, response)

    if (result.issues) {
      throw this.errorService.handle(
        this.errorFactory.create({
          status: 0,
          code: "app/auth/schema/signUp/response_not_valid",
          message: "Response schema not valid",
          issues: result.issues,
        }),
      )
    }

    return result.output
  }

  tokenRefresh(response: unknown) {
    const result = v.safeParse(this.tokenRefreshTransform, response)

    if (result.issues) {
      throw this.errorService.handle(
        this.errorFactory.create({
          status: 0,
          code: "app/auth/schema/tokenRefresh/response_not_valid",
          message: "Response schema not valid",
          issues: result.issues,
        }),
      )
    }

    return result.output
  }

  me(response: unknown) {
    const result = v.safeParse(this.meTransform, response)

    if (result.issues) {
      throw this.errorService.handle(
        this.errorFactory.create({
          status: 0,
          code: "app/auth/schema/me/response_not_valid",
          message: "Response schema not valid",
          issues: result.issues,
        }),
      )
    }

    return result.output
  }
}
