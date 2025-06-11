import { AsyncPipe } from "@angular/common"
import { Component, inject } from "@angular/core"
import { NzAlertComponent } from "ng-zorro-antd/alert"
import { NzButtonComponent } from "ng-zorro-antd/button"
import { NzIconDirective } from "ng-zorro-antd/icon"
import {
  NzListComponent,
  NzListItemActionComponent,
  NzListItemActionsComponent,
  NzListItemComponent,
  NzListItemMetaComponent,
} from "ng-zorro-antd/list"
import { combineLatest, map, Observable, startWith } from "rxjs"
import { Status, StatusName } from "../../../../core/status"
import { CartItemNormalized } from "../../../../domains/cart"
import { CartAddUsecase } from "../../../../domains/cart/cart-add.usecase"
import { CartRemoveUsecase } from "../../../../domains/cart/cart-remove.usecase"
import { CartUsecase } from "../../../../domains/cart/cart.usecase"

interface CartDetailList {
  list: CartDetailItem[]
  total: number
}

interface CartDetailItem extends CartItemNormalized {
  sum: number
}

@Component({
  selector: "app-cart-detail",
  templateUrl: "./cart-detail.component.html",
  styleUrl: "./cart-detail.component.scss",
  imports: [
    NzListComponent,
    AsyncPipe,
    NzListItemMetaComponent,
    NzListItemActionComponent,
    NzListItemActionsComponent,
    NzListItemComponent,
    NzButtonComponent,
    NzIconDirective,
    NzAlertComponent,
  ],
})
export class CartDetailComponent {
  cart = inject(CartUsecase)
  cartAdd = inject(CartAddUsecase)
  cartRemove = inject(CartRemoveUsecase)

  status$: Observable<{
    add: StatusName
    remove: StatusName
  }> = combineLatest([
    this.cartAdd.state$.pipe(startWith({ status: Status.useless })),
    this.cartRemove.state$.pipe(startWith({ status: Status.useless })),
  ]).pipe(
    map(([add, remove]) => {
      return {
        add: add.status,
        remove: remove.status,
      }
    }),
    startWith({
      add: Status.useless,
      remove: Status.useless,
    }),
  )

  list$: Observable<CartDetailList> = this.cart.state$.pipe(
    map((state) => {
      if (!state.data)
        return {
          list: [],
          total: 0,
        }

      const total = {
        list: [] as any,
        total: 0,
      }

      const list = state.data.list.toArray()

      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < list.length; i++) {
        const sum = parseInt(list[i][1].product.price) * list[i][1].quantity

        total.list.push({ ...list[i][1], sum })
        total.total += sum
      }

      return total
    }),
  )

  handleAdd(productId: string) {
    this.cartAdd.handle({
      productId,
      quantity: 1,
    })
  }

  handleRemove(productId: string) {
    this.cartRemove.handle({
      productId,
      quantity: 1,
    })
  }
}
