import { inject, Injectable } from "@angular/core"
import { httpWrapWithStatus } from "../../core/http"
import { ProductApiService } from "./internal/product-api.service"

@Injectable({
  providedIn: "any",
})
export class ProductByIdUsecase {
  api = inject(ProductApiService)

  constructor() {}

  handle(productId: string) {
    return this.api.productById(productId).pipe(httpWrapWithStatus())
  }
}
