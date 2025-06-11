import {
  EnvironmentProviders,
  inject,
  isDevMode,
  provideAppInitializer,
  Provider,
} from "@angular/core"
import { provideEffects } from "@ngrx/effects"
import { provideStore, Store } from "@ngrx/store"
import { provideStoreDevtools } from "@ngrx/store-devtools"
import {
  AuthBaseActions,
  AuthBaseEffects,
  AuthBaseFeature,
} from "../../domains/auth/auth-base.store"
import {
  CartActions,
  CartEffects,
  CartFeature,
} from "../../domains/cart/cart.store"

export function appStoreProvider(): Provider | EnvironmentProviders {
  return [
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    // provideStore(),
    provideStore({
      [AuthBaseFeature.name]: AuthBaseFeature.reducer,
      [CartFeature.name]: CartFeature.reducer,
    }),
    provideEffects([AuthBaseEffects, CartEffects]),
  ]
}

export function appStoreInitializer(): Provider | EnvironmentProviders {
  return provideAppInitializer(() => {
    const store = inject(Store)
    store.dispatch(AuthBaseActions.me())
    store.dispatch(CartActions.cart())

    // return store.select(AuthBaseFeature.selectStatus).pipe(
    //   filter((value) => value === "success" || value === "failure"),
    //   take(1),
    // )

    return Promise.resolve(true)
  })
}
