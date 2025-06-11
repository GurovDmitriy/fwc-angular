import { Response } from "miragejs"
import { Server } from "miragejs/server"
import { ConfigTesting } from "../../../configuration/config-testing"
import { Environment } from "../../../configuration/env"
import { AuthUser } from "../../../domains/auth"
import { authMiddleware } from "./utils/authMiddleware"

export function mockCart(
  self: Server<any>,
  environment: Environment,
  config: ConfigTesting,
) {
  self.get(
    "/cart",
    authMiddleware(async function (schema: any, request: any, auth: any) {
      const cart = schema.findBy("cart", {
        id: auth.payload.userId,
      }) as unknown as AuthUser

      if (!cart) {
        return new Response(
          404,
          {},
          {
            code: "app/error/cart_not_found",
            message: "Cart not found",
            errors: {},
          },
        )
      }

      return new Response(
        200,
        {},
        {
          data: cart,
        },
      )
    }, config),
  )

  self.post(
    "/cart/add",
    authMiddleware(async function (schema: any, request: any, auth: any) {
      const cart = schema.findBy("cart", {
        id: auth.payload.userId,
      })

      if (!cart) {
        return new Response(
          404,
          {},
          {
            code: "app/error/cart_not_found",
            message: "Cart not found",
            errors: {},
          },
        )
      }

      const attrs = JSON.parse(request.requestBody)

      const product = schema.findBy("product", {
        id: attrs.id,
      })

      if (!product) {
        return new Response(
          404,
          {},
          {
            code: "app/error/product_not_found",
            message: "Product not found",
            errors: {},
          },
        )
      }

      const productIdx = cart.attrs.list.findIndex(
        (item: any) => item.product.id === product.attrs.id,
      )

      if (productIdx !== -1) {
        cart.update({
          list: cart.attrs.list.map((item: any, index: number) => {
            if (index !== productIdx) {
              return item
            } else {
              return {
                ...item,
                quantity: item.quantity + attrs.quantity,
              }
            }
          }),
        })
      } else {
        cart.update({
          list: [
            ...cart.attrs.list,
            {
              product: {
                id: product.attrs.id,
                name: product.name,
                description: product.description,
                image: product.image,
                price: product.price,
              },
              quantity: 1,
            },
          ],
        })
      }

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
        200,
        {},
        {
          data: cart,
        },
      )
    }, config),
  )

  self.post(
    "/cart/remove",
    authMiddleware(async function (schema: any, request: any, auth: any) {
      const cart = schema.findBy("cart", {
        id: auth.payload.userId,
      })

      if (!cart) {
        return new Response(
          404,
          {},
          {
            code: "app/error/cart_not_found",
            message: "Cart not found",
            errors: {},
          },
        )
      }

      const attrs = JSON.parse(request.requestBody)

      const product = schema.findBy("product", {
        id: attrs.id,
      })

      if (!product) {
        return new Response(
          404,
          {},
          {
            code: "app/error/product_not_found",
            message: "Product not found",
            errors: {},
          },
        )
      }

      const productIdx = cart.attrs.list.findIndex(
        (item: any) => item.product.id === product.attrs.id,
      )

      if (productIdx !== -1) {
        cart.update({
          list: cart.attrs.list
            .map((item: any, index: number) => {
              if (index !== productIdx) {
                return item
              } else {
                return {
                  ...item,
                  quantity:
                    attrs.quantity <= item.quantity
                      ? item.quantity - attrs.quantity
                      : 0,
                }
              }
            })
            .filter((item: any) => item.quantity > 0),
        })
      } else {
        return new Response(
          404,
          {},
          {
            code: "app/error/product_not_found",
            message: "Product not found",
            errors: {},
          },
        )
      }

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
        200,
        {},
        {
          data: cart,
        },
      )
    }, config),
  )
}
