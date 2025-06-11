import { inject, Injectable } from "@angular/core"
import { Store } from "@ngrx/store"
import { filter, Observable } from "rxjs"
import { ProductAddPayload } from "../product"
import { CartActions, CartFeature, CartState } from "./cart.store"

@Injectable({
  providedIn: "root",
})
export class CartAddUsecase {
  private store = inject(Store)

  state$: Observable<CartState> = this.store
    .select(CartFeature.selectCartState)
    .pipe(filter((state) => state.statusDetail.includes("[Cart] add")))

  handle(payload: ProductAddPayload) {
    this.store.dispatch(
      CartActions.add({
        payload,
      }),
    )
  }
}
