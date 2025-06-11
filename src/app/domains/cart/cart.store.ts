import { inject, Injectable } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import {
  createActionGroup,
  createFeature,
  createReducer,
  emptyProps,
  on,
  props,
  Store,
} from "@ngrx/store"
import { catchError, exhaustMap, map, of } from "rxjs"
import { ErrorMapped, TOKEN_ERROR_SERVICE } from "../../core/error"
import { StatusName } from "../../core/status"
import { ProductAddPayload, ProductRemovePayload } from "../product"
import { CartApiService } from "./internal/cart-api.service"
import { CartNormalized } from "./types"

const payloadProps = <TPayload>() => props<{ payload: TPayload }>()
const errorProps = <TError = ErrorMapped>() => props<{ error: TError }>()

const CartFilterName = {
  cart: "[Cart] cart",
  add: "[Cart] add",
  remove: "[Cart] remove",
  clear: "[Cart] clear",
}

const CartActions = createActionGroup({
  source: "Cart",
  events: {
    cart: emptyProps(),
    cartSuccess: payloadProps<CartNormalized>(),
    cartFailure: errorProps(),

    add: payloadProps<ProductAddPayload>(),
    addSuccess: payloadProps<CartNormalized>(),
    addFailure: errorProps(),

    remove: payloadProps<ProductRemovePayload>(),
    removeSuccess: payloadProps<CartNormalized>(),
    removeFailure: errorProps(),

    clear: emptyProps(),
    clearSuccess: payloadProps<CartNormalized>(),
    clearFailure: errorProps(),
  },
})

interface CartState {
  status: StatusName
  statusDetail:
    | (typeof CartActions)[keyof typeof CartActions]["type"]
    | "useless"
  data: CartNormalized | null
  error: ErrorMapped | null
}

const initialState: CartState = {
  status: "useless",
  statusDetail: "useless",
  data: null,
  error: null,
}

function statusHelper(name: StatusName, action: { type: any }) {
  return {
    status: name,
    statusDetail: action.type,
  }
}

const CartFeature = createFeature({
  name: "cart",
  reducer: createReducer(
    initialState,

    on(
      CartActions.cart,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("pending", action),
          error: null,
        }) satisfies CartState,
    ),

    on(
      CartActions.cartSuccess,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("success", action),
          data: action.payload,
          error: null,
        }) satisfies CartState,
    ),

    on(
      CartActions.cartFailure,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("failure", action),
          data: null,
          error: action.error,
        }) satisfies CartState,
    ),

    on(
      CartActions.add,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("pending", action),
          error: null,
        }) satisfies CartState,
    ),

    on(
      CartActions.addSuccess,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("success", action),
          data: action.payload,
          error: null,
        }) satisfies CartState,
    ),

    on(
      CartActions.addFailure,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("failure", action),
          data: null,
          error: action.error,
        }) satisfies CartState,
    ),

    on(
      CartActions.remove,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("pending", action),
          error: null,
        }) satisfies CartState,
    ),

    on(
      CartActions.removeSuccess,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("success", action),
          data: action.payload,
          error: null,
        }) satisfies CartState,
    ),

    on(
      CartActions.removeFailure,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("failure", action),
          data: null,
          error: action.error,
        }) satisfies CartState,
    ),

    on(
      CartActions.clear,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("pending", action),
          error: null,
        }) satisfies CartState,
    ),

    on(
      CartActions.cartSuccess,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("success", action),
          data: action.payload,
          error: null,
        }) satisfies CartState,
    ),

    on(
      CartActions.cartFailure,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("failure", action),
          data: null,
          error: action.error,
        }) satisfies CartState,
    ),
  ),
})

@Injectable({
  providedIn: "root",
})
class CartEffects {
  private errorService = inject(TOKEN_ERROR_SERVICE)
  private api = inject(CartApiService)
  private actions$ = inject(Actions)
  private store = inject(Store)

  cart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.cart),
      exhaustMap(() => {
        return this.api.cart().pipe(
          map((cart) => CartActions.cartSuccess({ payload: cart })),
          catchError((error) => {
            return of(
              CartActions.cartFailure({
                error: this.errorService.handle(error),
              }),
            )
          }),
        )
      }),
    ),
  )

  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.add),
      exhaustMap((action) => {
        return this.api
          .add({
            ...action.payload,
          })
          .pipe(
            map((cart) => CartActions.addSuccess({ payload: cart })),
            catchError((error) => {
              return of(
                CartActions.addFailure({
                  error: this.errorService.handle(error),
                }),
              )
            }),
          )
      }),
    ),
  )

  remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.remove),
      exhaustMap((action) => {
        return this.api
          .remove({
            ...action.payload,
          })
          .pipe(
            map((cart) => CartActions.removeSuccess({ payload: cart })),
            catchError((error) => {
              return of(
                CartActions.removeFailure({
                  error: this.errorService.handle(error),
                }),
              )
            }),
          )
      }),
    ),
  )
}

export { CartActions, CartEffects, CartFeature, CartFilterName, type CartState }
