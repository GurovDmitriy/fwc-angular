import { inject, Injectable } from "@angular/core"
import { Store } from "@ngrx/store"
import { filter, Observable } from "rxjs"
import { ProductRemovePayload } from "../product"
import { CartActions, CartFeature, CartState } from "./cart.store"

@Injectable({
  providedIn: "root",
})
export class CartRemoveUsecase {
  private store = inject(Store)

  state$: Observable<CartState> = this.store
    .select(CartFeature.selectCartState)
    .pipe(filter((state) => state.statusDetail.includes("[Cart] remove")))

  handle(payload: ProductRemovePayload) {
    this.store.dispatch(
      CartActions.remove({
        payload,
      }),
    )
  }
}
