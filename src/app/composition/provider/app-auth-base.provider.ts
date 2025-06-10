import {
  EnvironmentProviders,
  inject,
  isDevMode,
  provideAppInitializer,
  Provider,
} from "@angular/core"
import { provideEffects } from "@ngrx/effects"
import { provideState, provideStore, Store } from "@ngrx/store"
import { provideStoreDevtools } from "@ngrx/store-devtools"
import {
  AuthBaseActions,
  AuthBaseEffects,
  AuthBaseFeature,
} from "../../domains/auth/auth-base.store"

export function appAuthBaseProvider(): Provider | EnvironmentProviders {
  return [
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideStore(),
    provideState(AuthBaseFeature),
    provideEffects(AuthBaseEffects),
  ]
}

export function appAuthBaseInitializer(): Provider | EnvironmentProviders {
  return provideAppInitializer(() => {
    const store = inject(Store)
    store.dispatch(AuthBaseActions.me())

    // return store.select(AuthBaseFeature.selectStatus).pipe(
    //   filter((value) => value === "success" || value === "failure"),
    //   take(1),
    // )

    return Promise.resolve(true)
  })
}
