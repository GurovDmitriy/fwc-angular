import { provideHttpClient, withInterceptors } from "@angular/common/http"
import { EnvironmentProviders, Provider } from "@angular/core"
import {
  authTokenInterceptor,
  authTokenRefreshInterceptor,
} from "../../domains/auth"
import {
  httpErrorInterceptor,
  httpReporterInterceptor,
} from "../../domains/http"

export function appHttpClientProvider(): Provider | EnvironmentProviders {
  return provideHttpClient(
    withInterceptors([
      httpReporterInterceptor,
      httpErrorInterceptor,
      authTokenRefreshInterceptor,
      authTokenInterceptor,
    ]),
  )
}
