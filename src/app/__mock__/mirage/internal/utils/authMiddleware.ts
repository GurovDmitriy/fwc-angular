import { jwtVerify } from "jose"
import { Response } from "miragejs"
import { ConfigTesting } from "../../../../configuration/config-testing"

export function authMiddleware(handler: any, config: ConfigTesting) {
  return async function (schema: any, request: any) {
    const authHeader = request.requestHeaders["Authorization"]

    if (!authHeader) {
      return new Response(
        401,
        {},
        {
          code: "app/error/missing_auth_header",
          message: "No authorization header",
          errors: {},
        },
      )
    }

    const tokenString = authHeader.split("Bearer")[1]?.trim()

    if (!tokenString) {
      return new Response(
        401,
        {},
        {
          code: "app/error/bearer_not_found",
          message: "Invalid authorization header",
          errors: {},
        },
      )
    }

    const secret = new TextEncoder().encode(config.jwtSecret)
    let res: any

    try {
      res = (await jwtVerify(tokenString, secret)) as unknown as {
        payload: {
          userId: string
          email: string
        }
      }
    } catch {
      return new Response(
        401,
        {},
        {
          code: "app/error/token_expire",
          message: "Token expire",
          errors: {},
        },
      )
    }

    return handler(schema, request, res)
  }
}
