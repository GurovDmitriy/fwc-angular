import { AsyncPipe, TitleCasePipe } from "@angular/common"
import { Component, inject } from "@angular/core"
import { toSignal } from "@angular/core/rxjs-interop"
import { ActivatedRoute } from "@angular/router"
import { NzBadgeComponent } from "ng-zorro-antd/badge"
import { NzButtonComponent } from "ng-zorro-antd/button"
import { NzCardComponent, NzCardMetaComponent } from "ng-zorro-antd/card"
import { NzColDirective, NzRowDirective } from "ng-zorro-antd/grid"
import { NzIconDirective } from "ng-zorro-antd/icon"
import { NzTypographyComponent } from "ng-zorro-antd/typography"
import { combineLatest, map, Observable, startWith, switchMap } from "rxjs"
import { ErrorMapped } from "../../../../core/error"
import { Status, StatusName } from "../../../../core/status"
import { CartAddUsecase } from "../../../../domains/cart/cart-add.usecase"
import { CartRemoveUsecase } from "../../../../domains/cart/cart-remove.usecase"
import { CartUsecase } from "../../../../domains/cart/cart.usecase"
import { Product } from "../../../../domains/product"
import { ProductByIdUsecase } from "../../../../domains/product/product-by-id.usecase"

@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.component.html",
  styleUrl: "./product-detail.component.scss",
  imports: [
    NzColDirective,
    NzRowDirective,
    AsyncPipe,
    NzCardComponent,
    NzCardMetaComponent,
    NzIconDirective,
    TitleCasePipe,
    NzButtonComponent,
    NzBadgeComponent,
    NzTypographyComponent,
  ],
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute)

  product = inject(ProductByIdUsecase)

  cart = inject(CartUsecase)
  cartAdd = inject(CartAddUsecase)
  cartRemove = inject(CartRemoveUsecase)

  params = toSignal(this.route.params)

  state$ = this.route.params.pipe(
    switchMap((params) =>
      this.product.handle(params["productId"]).pipe(
        map((state) => {
          return {
            status: state.status,
            error: state.error,
            data: {
              id: state.data?.data?.id ?? null,
              name: state.data?.data?.name ?? null,
              price: state.data?.data?.price ?? null,
              image: state.data?.data?.image
                ? `images/${state.data?.data?.image}`
                : null,
              description: state.data?.data?.description ?? null,
            } as Product,
          }
        }),
        startWith({
          status: Status.useless,
          data: {
            id: null,
            name: null,
            price: null,
            image: null,
            description: null,
          },
          error: null,
        }),
      ),
    ),
  )

  stateCart$: Observable<{
    status: StatusName
    quantity: number
    error: ErrorMapped | null
  }> = combineLatest([this.route.params, this.cart.state$]).pipe(
    map(([params, cartState]) => {
      return {
        status: cartState.status,
        quantity: cartState.data?.list?.get(params["productId"])?.quantity ?? 0,
        error: cartState.error,
      }
    }),
    startWith({
      status: Status.useless,
      quantity: 0,
      error: null,
    }),
  )

  constructor() {}

  handleCart() {}

  handleAdd() {
    const id = this.params()?.["productId"]
    if (!id) return

    this.cartAdd.handle({
      productId: id,
      quantity: 1,
    })
  }

  handleRemove() {
    const id = this.params()?.["productId"]
    if (!id) return

    this.cartRemove.handle({
      productId: id,
      quantity: 1,
    })
  }
}
