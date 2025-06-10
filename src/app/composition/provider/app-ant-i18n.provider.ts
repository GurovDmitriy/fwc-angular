import {
  EnvironmentProviders,
  inject,
  LOCALE_ID,
  Provider,
} from "@angular/core"
import { en_US, NZ_I18N, ru_RU } from "ng-zorro-antd/i18n"

export function appAntI18nProvider(): Provider | EnvironmentProviders {
  return {
    provide: NZ_I18N,
    useFactory: () => {
      const localId = inject(LOCALE_ID)
      switch (localId) {
        case "en":
          return en_US
        case "ru":
          return ru_RU
        default:
          return en_US
      }
    },
  }
}
