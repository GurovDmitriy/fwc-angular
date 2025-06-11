import { HttpClient } from "@angular/common/http"
import { inject, Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { TOKEN_ENV } from "../../../configuration/env"
import { Product } from "../types"

@Injectable({
  providedIn: "root",
})
export class ProductApiService {
  private envService = inject(TOKEN_ENV)
  private httpClient = inject(HttpClient)

  productByCategory(categoryId: string): Observable<{ data: Product[] }> {
    return this.httpClient.get<{ data: Product[] }>(
      `${this.envService.apiUrl}/category/${categoryId}/product`,
    )
  }

  productById(productId: string): Observable<{ data: Product }> {
    return this.httpClient.get<{ data: Product }>(
      `${this.envService.apiUrl}/product/${productId}`,
    )
  }
}
