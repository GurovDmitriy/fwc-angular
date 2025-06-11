import { http, HttpResponse } from "msw"
import { ConfigTesting } from "../../../configuration/config-testing"
import { Environment } from "../../../configuration/env"
import { WithAuth } from "../middleware/withAuth"
import { MockDB } from "../mock-db"
import { CartUpdatePayload } from "../types"

export class Cart {
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
      http.get<{ categoryId: string }>(
        `${this.env.apiUrl}/cart`,
        this.withAuth.handle(async (_, auth) => {
          const cart = this.db.getCart(auth.userId)

          if (!cart) {
            return HttpResponse.json(
              {
                code: "app/error/cart_not_found",
                message: "Cart not found",
                errors: {},
              },
              { status: 404 },
            )
          }

          return HttpResponse.json(
            {
              data: cart,
            },
            { status: 200 },
          )
        }),
      ),

      http.post<never, CartUpdatePayload>(
        `${this.env.apiUrl}/cart/add`,
        this.withAuth.handle(async ({ request }, auth) => {
          const cart = this.db.getCart(auth.userId)

          if (!cart) {
            return HttpResponse.json(
              {
                code: "app/error/cart_not_found",
                message: "Cart not found",
                errors: {},
              },
              { status: 404 },
            )
          }

          const body = await request.clone().json()

          const cartUpdated = this.db.updateCart(auth.userId, {
            productId: body.productId,
            quantity: body.quantity,
          })

          if (!cartUpdated) {
            return HttpResponse.json(
              {
                code: "app/error/product_not_found",
                message: "Product not found",
                errors: {},
              },
              { status: 404 },
            )
          }

          return HttpResponse.json(
            {
              data: cartUpdated,
            },
            { status: 200 },
          )
        }),
      ),

      http.post<never, CartUpdatePayload>(
        `${this.env.apiUrl}/cart/remove`,
        this.withAuth.handle(async ({ request }, auth) => {
          const cart = this.db.getCart(auth.userId)

          if (!cart) {
            return HttpResponse.json(
              {
                code: "app/error/cart_not_found",
                message: "Cart not found",
                errors: {},
              },
              { status: 404 },
            )
          }

          const body = await request.clone().json()

          const cartUpdated = this.db.removeCart(auth.userId, {
            productId: body.productId,
            quantity: body.quantity,
          })

          if (!cartUpdated) {
            return HttpResponse.json(
              {
                code: "app/error/product_not_found",
                message: "Product not found",
                errors: {},
              },
              { status: 404 },
            )
          }

          return HttpResponse.json(
            {
              data: cartUpdated,
            },
            { status: 200 },
          )
        }),
      ),
    ]
  }
}
