import { registerLocaleData } from "@angular/common"
import ru from "@angular/common/locales/ru"
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from "@angular/core"
import { FormsModule } from "@angular/forms"
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async"
import { provideRouter } from "@angular/router"
import { provideAngularSvgIcon } from "angular-svg-icon"
import {
  appAntI18nProvider,
  appConfigRuntimeInitializer,
  appConfigRuntimeProvider,
  appEnvServiceProvider,
  appErrorHandlerProvider,
  appErrorMapperProvider,
  appErrorReporterInitializer,
  appErrorReporterProvider,
  appErrorServiceProvider,
  appHttpClientProvider,
  appMediaQueryInitializer,
  appMediaQueryProvider,
  appStorageCustomInitializer,
  appStorageCustomProvider,
  appStoreInitializer,
  appStoreProvider,
} from "./composition/provider"
import { routes } from "./routing/app.routes"

registerLocaleData(ru)

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideAngularSvgIcon(),
    appEnvServiceProvider(),
    appConfigRuntimeProvider(),
    appConfigRuntimeInitializer(),
    appHttpClientProvider(),
    appErrorHandlerProvider(),
    appErrorServiceProvider(),
    appErrorMapperProvider(),
    appErrorReporterProvider(),
    appErrorReporterInitializer(),
    appMediaQueryProvider(),
    appMediaQueryInitializer(),
    appStorageCustomProvider(),
    appStorageCustomInitializer(),
    appAntI18nProvider(),
    appStoreProvider(),
    appStoreInitializer(),
  ],
}
