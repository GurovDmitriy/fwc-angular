import { inject, Injectable } from "@angular/core"
import { Store } from "@ngrx/store"
import { Observable } from "rxjs"
import { CartFeature, CartState } from "./cart.store"

@Injectable({
  providedIn: "root",
})
export class CartUsecase {
  private store = inject(Store)

  state$: Observable<CartState> = this.store.select(CartFeature.selectCartState)

  handle() {}
}
