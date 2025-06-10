import {
  EnvironmentProviders,
  inject,
  provideAppInitializer,
  Provider,
} from "@angular/core"
import { StorageBase, TOKEN_STORAGE_CUSTOM } from "../../core/storage"

export function appStorageCustomProvider(): Provider | EnvironmentProviders {
  return {
    provide: TOKEN_STORAGE_CUSTOM,
    useClass: StorageBase,
  }
}

export function appStorageCustomInitializer(): Provider | EnvironmentProviders {
  return provideAppInitializer(() => {
    const storageBase = inject(TOKEN_STORAGE_CUSTOM)
    return Promise.resolve(storageBase)
  })
}
