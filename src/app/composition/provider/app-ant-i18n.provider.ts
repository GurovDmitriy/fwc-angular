import {
  EnvironmentProviders,
  inject,
  LOCALE_ID,
  Provider,
} from "@angular/core"
import { en_US, NZ_I18N } from "ng-zorro-antd/i18n"

export function appAntI18nProvider(): Provider | EnvironmentProviders {
  return {
    provide: NZ_I18N,
    useFactory: () => {
      const localId = inject(LOCALE_ID)
      switch (localId) {
        case "en":
          return en_US
        default:
          return en_US
      }
    },
  }
}
