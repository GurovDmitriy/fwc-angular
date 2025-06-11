import { inject, Injectable } from "@angular/core"
import { map } from "rxjs"
import { httpWrapWithStatus } from "../../core/http"
import { ProductApiService } from "./internal/product-api.service"

@Injectable({
  providedIn: "any",
})
export class ProductByCategoryUsecase {
  api = inject(ProductApiService)

  constructor() {}

  handle(categoryId: string) {
    return this.api.productByCategory(categoryId).pipe(
      map((res) => {
        return {
          ...res,
          data: res.data.map((item) => {
            return {
              ...item,
              image: `images/${item.image}`,
            }
          }),
        }
      }),
      httpWrapWithStatus(),
    )
  }
}
