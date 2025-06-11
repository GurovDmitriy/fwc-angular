import { inject, Injectable } from "@angular/core"
import { OrderedMap } from "immutable"
import * as v from "valibot"
import {
  ErrorSchemaBaseFactory,
  TOKEN_ERROR_SERVICE,
} from "../../../core/error"

@Injectable({
  providedIn: "root",
})
export class CartSchema {
  private errorService = inject(TOKEN_ERROR_SERVICE)
  private errorFactory = inject(ErrorSchemaBaseFactory)

  private readonly cartResponse = v.object({
    data: v.object({
      id: v.string(),
      list: v.array(
        v.object({
          product: v.object({
            id: v.string(),
            name: v.string(),
            description: v.string(),
            price: v.string(),
            image: v.string(),
          }),
          quantity: v.number(),
        }),
      ),
    }),
  })

  private readonly cartTransform = v.pipe(
    this.cartResponse,
    v.transform((value) => {
      return {
        id: value.data.id,
        list: OrderedMap(
          value.data.list.map((item: any) => {
            return [
              item.product.id,
              {
                productId: item.product.id,
                ...item,
              },
            ]
          }),
        ),
      }
    }),
  )

  constructor() {}

  cart(response: unknown) {
    const result = v.safeParse(this.cartTransform, response)

    if (result.issues) {
      throw this.errorService.handle(
        this.errorFactory.create({
          status: 0,
          code: "app/cart/schema/cart/response_not_valid",
          message: "Response schema not valid",
          issues: result.issues,
        }),
      )
    }

    return result.output
  }
}
