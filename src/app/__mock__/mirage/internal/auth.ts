import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { Response } from "miragejs"
import { Server } from "miragejs/server"
import * as R from "ramda"
import { ConfigTesting } from "../../../configuration/config-testing"
import { Environment } from "../../../configuration/env"
import { AuthUser } from "../../../domains/auth"
import { authMiddleware } from "./utils/authMiddleware"

export function mockAuth(
  self: Server<any>,
  environment: Environment,
  config: ConfigTesting,
) {
  self.post("/auth/sign-up", async function (schema, request) {
    const attrs = JSON.parse(request.requestBody)

    const isFieldRequired = R.all(R.isNotEmpty)([
      attrs.email,
      attrs.name,
      attrs.password,
      attrs.passwordConfirm,
    ])

    if (!isFieldRequired) {
      return new Response(
        422,
        {},
        {
          code: "app/error/validation",
          message: "Missing fields",
          errors: {},
        },
      )
    }

    if (attrs.password !== attrs.passwordConfirm) {
      return new Response(
        422,
        {},
        {
          code: "app/error/password_not_confirm",
          message: "Missing fields",
          errors: {},
        },
      )
    }

    const existingUser = schema.findBy("user", { email: attrs.email })

    if (existingUser) {
      return new Response(
        409,
        {},
        {
          code: "app/error/email_exist",
          message: "Email already exists",
          errors: {},
        },
      )
    }

    const passwordHash = bcrypt.hashSync(attrs.password, 10)

    const user = schema.create("user", {
      name: attrs.name,
      email: attrs.email,
      password: passwordHash,
    })

    const secret = new TextEncoder().encode(config.jwtSecret)

    const tokenAccess = await new SignJWT({
      userId: user.id,
      email: user.email,
    } as any)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(config.tokenExpires)
      .sign(secret)

    const tokenRefresh = await new SignJWT({
      userId: user.id,
      email: user.email,
    } as any)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(config.tokenRefreshExpires)
      .sign(secret)

    const token = schema.create("token", {
      tokenAccess,
      tokenRefresh,
      user,
    })

    user.update({ token })
    const cart = schema.create("cart", { user })
    cart.update({
      list: [],
    })

    const db = schema.db as any
    localStorage.setItem(
      "mirage",
      JSON.stringify({
        users: db.users,
        tokens: db.tokens,
        carts: db.carts,
        previews: db.previews,
        products: db.products,
      }),
    )

    return new Response(
      201,
      {},
      {
        id: user.id,
        tokenAccess,
        tokenRefresh,
      },
    )
  })

  self.post("/auth/sign-in", async function (schema, request) {
    const attrs = JSON.parse(request.requestBody)

    const isFieldRequired = R.all(R.isNotEmpty)([attrs.email, attrs.password])

    if (!isFieldRequired) {
      return new Response(
        422,
        {},
        {
          code: "app/error/validation",
          message: "Missing fields",
          errors: {},
        },
      )
    }

    const user = schema.findBy("user", { email: attrs.email }) as any

    if (!user) {
      return new Response(
        422,
        {},
        {
          code: "app/error/invalid_credential",
          message: "Invalid email or password",
          errors: {},
        },
      )
    }

    if (!bcrypt.compareSync(attrs.password, user.password)) {
      return new Response(
        422,
        {},
        {
          code: "app/error/invalid_credential",
          message: "Invalid email or password",
          errors: {},
        },
      )
    }

    const secret = new TextEncoder().encode(config.jwtSecret)

    const tokenAccess = await new SignJWT({
      userId: user.id,
      email: user.email,
    } as any)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(config.tokenExpires)
      .sign(secret)

    const tokenRefresh = await new SignJWT({
      userId: user.id,
      email: user.email,
    } as any)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(config.tokenRefreshExpires)
      .sign(secret)

    let token = schema.findBy("token", { userId: user.id })

    if (token) {
      token.update({ tokenAccess, tokenRefresh })
    } else {
      token = schema.create("token", { tokenAccess, tokenRefresh, user })
      user.update({ token })
    }

    const db = schema.db as any
    localStorage.setItem(
      "mirage",
      JSON.stringify({
        users: db.users,
        tokens: db.tokens,
        previews: db.previews,
        products: db.products,
      }),
    )

    return new Response(
      201,
      {},
      {
        id: user.id,
        tokenAccess,
        tokenRefresh,
      },
    )
  })

  self.post("/auth/sign-out", async function () {
    return new Response(200, {}, {})
  })

  self.get(
    "/auth/me",
    authMiddleware(async function (schema: any, request: any, auth: any) {
      const user = schema.findBy("user", {
        id: auth.payload.userId,
      }) as unknown as AuthUser

      if (!user) {
        return new Response(
          401,
          {},
          {
            code: "app/error/user_not_found",
            message: "User not found",
            errors: {},
          },
        )
      }

      return new Response(
        201,
        {},
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      )
    }, config),
  )

  self.post(
    "/auth/me-update",
    authMiddleware(async function (schema: any, request: any, auth: any) {
      const user = schema.findBy("user", {
        id: auth.payload.userId,
      }) as any

      if (!user) {
        return new Response(
          401,
          {},
          {
            code: "app/error/user_not_found",
            message: "User not found",
            errors: {},
          },
        )
      }

      const attrs = JSON.parse(request.requestBody)

      const isFieldRequired = R.all(R.isNotEmpty)([attrs.name])

      if (!isFieldRequired) {
        return new Response(
          422,
          {},
          {
            code: "app/error/validation",
            message: "Missing fields",
            errors: {},
          },
        )
      }

      user.update({ name: attrs.name })

      const db = schema.db as any
      localStorage.setItem(
        "mirage",
        JSON.stringify({
          users: db.users,
          tokens: db.tokens,
          previews: db.previews,
          products: db.products,
        }),
      )

      return new Response(
        201,
        {},
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      )
    }, config),
  )

  self.post("/auth/refresh", async function (schema, request) {
    const attrs = JSON.parse(request.requestBody)

    if (!attrs.tokenRefresh) {
      return new Response(
        401,
        {},
        {
          code: "app/error/token_not_found",
          message: "Token not found",
          errors: {},
        },
      )
    }

    const secret = new TextEncoder().encode(config.jwtSecret)
    let res: any

    try {
      res = (await jwtVerify(attrs.tokenRefresh, secret)) as unknown as {
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
          code: "app/error/user_not_found",
          message: "User not found",
          errors: {},
        },
      )
    }

    const user = schema.findBy("user", {
      id: res.payload.userId,
    }) as any

    if (!user) {
      return new Response(
        401,
        {},
        {
          code: "app/error/user_not_found",
          message: "User not found",
          errors: {},
        },
      )
    }

    const tokenAccess = await new SignJWT({
      userId: user.id,
      email: user["email"],
    } as any)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(config.tokenExpires)
      .sign(secret)

    const tokenRefresh = await new SignJWT({
      userId: user.id,
      email: user["email"],
    } as any)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(config.tokenRefreshExpires)
      .sign(secret)

    let token = schema.findBy("token", { userId: user.id })

    if (token) {
      token.update({ tokenAccess, tokenRefresh })
    } else {
      token = schema.create("token", { tokenAccess, tokenRefresh, user })
      user.update({ token })
    }

    const db = schema.db as any
    localStorage.setItem(
      "mirage",
      JSON.stringify({
        users: db.users,
        tokens: db.tokens,
        previews: db.previews,
        products: db.products,
      }),
    )

    return new Response(
      201,
      {},
      {
        id: user.id,
        tokenAccess,
        tokenRefresh,
      },
    )
  })

  self.post("/auth/validate-email", async function (schema, request) {
    const attrs = JSON.parse(request.requestBody)

    const isFieldRequired = R.all(R.isNotEmpty)([attrs.email])

    if (!isFieldRequired) {
      return new Response(
        422,
        {},
        {
          code: "app/error/validation",
          message: "Missing fields",
          errors: {},
        },
      )
    }

    const existingUser = schema.findBy("user", { email: attrs.email })

    if (existingUser) {
      return new Response(
        409,
        {},
        {
          code: "app/error/email_exist",
          message: "Email already exists",
          errors: {},
        },
      )
    }

    return new Response(200, {}, {})
  })
}
