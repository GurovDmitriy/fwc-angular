import { HttpClient } from "@angular/common/http"
import { inject, Injectable } from "@angular/core"
import { map } from "rxjs"
import { TOKEN_ENV } from "../../../configuration/env"
import { HttpCache } from "../../../core/http/http-cache"
import { ProductAddPayload, ProductRemovePayload } from "../../product"
import { CartNormalized } from "../types"
import { CartSchema } from "./cart.schema"

@Injectable({
  providedIn: "root",
})
export class CartApiService {
  private envService = inject(TOKEN_ENV)
  private httpClient = inject(HttpClient)
  private httpCache = inject(HttpCache)
  private schema = inject(CartSchema)

  cart() {
    return this.httpClient
      .get<CartNormalized>(`${this.envService.apiUrl}/cart`)
      .pipe(map((value) => this.schema.cart(value)))
  }

  add(payload: ProductAddPayload) {
    return this.httpClient
      .post<CartNormalized>(`${this.envService.apiUrl}/cart/add`, payload, {
        context: this.httpCache.setKeyCacheResetCtx(
          `${this.envService.apiUrl}/cart`,
        ),
      })
      .pipe(map((value) => this.schema.cart(value)))
  }

  remove(payload: ProductRemovePayload) {
    return this.httpClient
      .post<CartNormalized>(`${this.envService.apiUrl}/cart/remove`, payload, {
        context: this.httpCache.setKeyCacheResetCtx(
          `${this.envService.apiUrl}/cart`,
        ),
      })
      .pipe(map((value) => this.schema.cart(value)))
  }

  clear() {
    return this.httpClient
      .delete<CartNormalized>(`${this.envService.apiUrl}/cart/clear`, {
        context: this.httpCache.setKeyCacheResetCtx(
          `${this.envService.apiUrl}/cart`,
        ),
      })
      .pipe(map((value) => this.schema.cart(value)))
  }
}
