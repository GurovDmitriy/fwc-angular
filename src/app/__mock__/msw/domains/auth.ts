import bcrypt from "bcryptjs"
import { jwtVerify, SignJWT } from "jose"
import { http, HttpResponse } from "msw"
import * as R from "ramda"
import { ConfigTesting } from "../../../configuration/config-testing"
import { Environment } from "../../../configuration/env"
import { WithAuth } from "../middleware/withAuth"
import { MockDB } from "../mock-db"
import {
  EmailValidatePayload,
  TokenItem,
  UserSignInPayload,
  UserSignUpPayload,
  UserUpdatePayload,
} from "../types"

export class Auth {
  withAuth

  constructor(
    private db: MockDB,
    private env: Environment,
    private config: ConfigTesting,
  ) {
    this.withAuth = new WithAuth(this.db, this.env, this.config)
  }

  handle() {
    return [
      http.post<never, UserSignUpPayload>(
        `${this.env.apiUrl}/auth/sign-up`,
        async ({ request }) => {
          const body = await request.clone().json()

          const isFieldRequired = R.all(R.isNotEmpty)([
            body.email,
            body.name,
            body.password,
            body.passwordConfirm,
          ])

          if (!isFieldRequired) {
            return HttpResponse.json(
              {
                code: "app/error/validation",
                message: "Missing fields",
                errors: {},
              },
              { status: 422 },
            )
          }

          if (body.password !== body.passwordConfirm) {
            return HttpResponse.json(
              {
                code: "app/error/password_not_confirm",
                message: "Missing fields",
                errors: {},
              },
              { status: 422 },
            )
          }

          const existingUser = this.db.getUserByEmail(body.email)

          if (existingUser) {
            return HttpResponse.json(
              {
                code: "app/error/email_exist",
                message: "Email already exists",
                errors: {},
              },
              { status: 422 },
            )
          }

          const passwordHash = bcrypt.hashSync(body.password, 10)

          const user = this.db.createUser({
            name: body.name,
            email: body.email,
            password: passwordHash,
          })

          const secret = new TextEncoder().encode(this.config.jwtSecret)

          const tokenAccess = await new SignJWT({
            userId: user.id,
            email: user.email,
          } as any)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime(this.config.tokenExpires)
            .sign(secret)

          const tokenRefresh = await new SignJWT({
            userId: user.id,
            email: user.email,
          } as any)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime(this.config.tokenRefreshExpires)
            .sign(secret)

          const token = this.db.createToken({
            userId: user.id,
            tokenAccess,
            tokenRefresh,
          })

          this.db.createCart(user.id)

          return HttpResponse.json(
            {
              ...token,
            },
            { status: 201 },
          )
        },
      ),

      http.post<never, UserSignInPayload>(
        `${this.env.apiUrl}/auth/sign-in`,
        async ({ request }) => {
          const body = await request.clone().json()

          const isFieldRequired = R.all(R.isNotEmpty)([
            body.email,
            body.password,
          ])

          if (!isFieldRequired) {
            return HttpResponse.json(
              {
                code: "app/error/validation",
                message: "Missing fields",
                errors: {},
              },
              { status: 422 },
            )
          }

          const user = this.db.getUserByEmail(body.email)

          if (!user) {
            return HttpResponse.json(
              {
                code: "app/error/invalid_credential",
                message: "Invalid email or password",
                errors: {},
              },
              { status: 422 },
            )
          }

          if (!bcrypt.compareSync(body.password, user.password)) {
            return HttpResponse.json(
              {
                code: "app/error/invalid_credential",
                message: "Invalid email or password",
                errors: {},
              },
              { status: 422 },
            )
          }

          const secret = new TextEncoder().encode(this.config.jwtSecret)

          const tokenAccess = await new SignJWT({
            userId: user.id,
            email: user.email,
          } as any)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime(this.config.tokenExpires)
            .sign(secret)

          const tokenRefresh = await new SignJWT({
            userId: user.id,
            email: user.email,
          } as any)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime(this.config.tokenRefreshExpires)
            .sign(secret)

          const token = this.db.getTokenByUserId(user.id)

          if (token) {
            this.db.updateToken({
              ...token,
              tokenAccess,
              tokenRefresh,
            })
          } else {
            this.db.createToken({
              userId: user.id,
              tokenAccess,
              tokenRefresh,
            })
          }

          return HttpResponse.json(
            {
              id: user.id,
              tokenAccess,
              tokenRefresh,
            },
            { status: 200 },
          )
        },
      ),

      http.post(`${this.env.apiUrl}/auth/sign-out`, async () => {
        return HttpResponse.json({}, { status: 200 })
      }),

      http.get(
        `${this.env.apiUrl}/auth/me`,
        this.withAuth.handle((_, auth) => {
          const user = this.db.getUserById(auth.userId)

          if (!user) {
            return HttpResponse.json(
              {
                code: "app/error/user_not_found",
                message: "User not found",
                errors: {},
              },
              { status: 401 },
            )
          }

          return HttpResponse.json(
            {
              id: user.id,
              name: user.name,
              email: user.email,
            },
            { status: 200 },
          )
        }),
      ),

      http.post<never, UserUpdatePayload>(
        `${this.env.apiUrl}/auth/me-update`,
        this.withAuth.handle(async ({ request }, auth) => {
          const user = this.db.getUserById(auth.userId)

          if (!user) {
            return HttpResponse.json(
              {
                code: "app/error/user_not_found",
                message: "User not found",
                errors: {},
              },
              { status: 401 },
            )
          }

          const body = await request.clone().json()

          const isFieldRequired = R.all(R.isNotEmpty)([body.name])

          if (!isFieldRequired) {
            return HttpResponse.json(
              {
                code: "app/error/validation",
                message: "Missing fields",
                errors: {},
              },
              { status: 422 },
            )
          }

          this.db.updateUser(
            {
              name: body.name,
            },
            auth.userId,
          )

          return HttpResponse.json(
            {
              id: user.id,
              name: user.name,
              email: user.email,
            },
            { status: 200 },
          )
        }),
      ),

      http.post<never, Pick<TokenItem, "tokenRefresh">>(
        `${this.env.apiUrl}/auth/refresh`,
        async ({ request }) => {
          const body = await request.clone().json()

          if (!body.tokenRefresh) {
            return HttpResponse.json(
              {
                code: "app/error/token_not_found",
                message: "Token not found",
                errors: {},
              },
              { status: 401 },
            )
          }

          const secret = new TextEncoder().encode(this.config.jwtSecret)
          let res: any

          try {
            res = (await jwtVerify(body.tokenRefresh, secret)) as unknown as {
              payload: {
                userId: string
                email: string
              }
            }
          } catch {
            return HttpResponse.json(
              {
                code: "app/error/user_not_found",
                message: "User not found",
                errors: {},
              },
              { status: 401 },
            )
          }

          const user = this.db.getUserById(res.payload.userId)

          if (!user) {
            return HttpResponse.json(
              {
                code: "app/error/user_not_found",
                message: "User not found",
                errors: {},
              },
              { status: 401 },
            )
          }

          const tokenAccess = await new SignJWT({
            userId: user.id,
            email: user["email"],
          } as any)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime(this.config.tokenExpires)
            .sign(secret)

          const tokenRefresh = await new SignJWT({
            userId: user.id,
            email: user["email"],
          } as any)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime(this.config.tokenRefreshExpires)
            .sign(secret)

          let token = this.db.getTokenByUserId(user.id)

          if (token) {
            this.db.updateToken({
              ...token,
              tokenAccess,
              tokenRefresh,
            })
          } else {
            token = this.db.createToken({
              userId: user.id,
              tokenAccess,
              tokenRefresh,
            })
          }

          return HttpResponse.json(
            {
              ...token,
            },
            { status: 200 },
          )
        },
      ),

      http.post<never, EmailValidatePayload>(
        `${this.env.apiUrl}/auth/validate-email`,
        async ({ request }) => {
          const body = await request.clone().json()

          const isFieldRequired = R.all(R.isNotEmpty)([body.email])

          if (!isFieldRequired) {
            return HttpResponse.json(
              {
                code: "app/error/validation",
                message: "Missing fields",
                errors: {},
              },
              { status: 422 },
            )
          }

          const existingUser = this.db.getUserByEmail(body.email)

          if (existingUser) {
            return HttpResponse.json(
              {
                code: "app/error/email_exist",
                message: "Email already exists",
                errors: {},
              },
              { status: 409 },
            )
          }

          return HttpResponse.json({}, { status: 200 })
        },
      ),
    ]
  }
}
