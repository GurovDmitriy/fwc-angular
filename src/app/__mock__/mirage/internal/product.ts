import { Response } from "miragejs"
import { Server } from "miragejs/server"

export function mockProduct(self: Server<any>) {
  self.get(
    "/product/category/:categoryId",
    async function (schema: any, request: any) {
      try {
        const categoryId = request.params.categoryId
        const category = schema.previews.find(categoryId)

        if (!category) {
          return new Response(404, {}, { error: "Category not found" })
        }

        const products = category.product.models.map(
          (product: any) => product.attrs,
        )

        return new Response(
          200,
          {},
          {
            data: products,
          },
        )
      } catch {
        return new Response(500, {}, { error: "Unknown error" })
      }
    },
  )

  self.get("/product/:productId", async function (schema: any, request: any) {
    try {
      const productId = request.params.productId
      const product = schema.products.find(productId)

      if (!product) {
        return new Response(404, {}, { error: "Product not found" })
      }

      return new Response(
        200,
        {},
        {
          data: product.attrs,
        },
      )
    } catch {
      return new Response(500, {}, { error: "Unknown error" })
    }
  })
}
