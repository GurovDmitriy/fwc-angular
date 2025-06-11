import { jwtVerify } from "jose"
import { HttpResponse } from "msw"
import { ConfigTesting } from "../../../configuration/config-testing"
import { Environment } from "../../../configuration/env"
import { MockDB } from "../mock-db"

export class WithAuth {
  constructor(
    private db: MockDB,
    private env: Environment,
    private config: ConfigTesting,
  ) {}

  handle(resolver: (...args: any[]) => any) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this

    return async function withAuth(input: any) {
      const authHeader = input.request.headers.get("Authorization")

      if (!authHeader) {
        return HttpResponse.json(
          {
            code: "app/error/missing_auth_header",
            message: "No authorization header",
            errors: {},
          },
          { status: 401 },
        )
      }

      const tokenString = authHeader.split("Bearer")[1]?.trim()

      if (!tokenString) {
        return HttpResponse.json(
          {
            code: "app/error/bearer_not_found",
            message: "Invalid authorization header",
            errors: {},
          },
          { status: 401 },
        )
      }

      const secret = new TextEncoder().encode(self.config.jwtSecret)
      let res: any

      try {
        res = (await jwtVerify(tokenString, secret)) as unknown as {
          payload: {
            userId: string
            email: string
          }
        }
      } catch {
        return HttpResponse.json(
          {
            code: "app/error/token_expire",
            message: "Token expire",
            errors: {},
          },
          { status: 401 },
        )
      }

      return resolver(input, {
        userId: res.payload.userId,
        email: res.payload.email,
      })
    }
  }
}
