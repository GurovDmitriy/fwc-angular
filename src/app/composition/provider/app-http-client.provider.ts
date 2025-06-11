import { provideHttpClient, withInterceptors } from "@angular/common/http"
import { EnvironmentProviders, Provider } from "@angular/core"
import { TOKEN_HTTP_CACHE_CONFIG } from "../../core/http"
import { httpCacheInterceptor } from "../../core/http/http-cache.interceptor"
import {
  authTokenInterceptor,
  authTokenRefreshInterceptor,
} from "../../domains/auth"
import {
  httpCacheConfig,
  httpErrorInterceptor,
  httpReporterInterceptor,
} from "../../domains/http"

export function appHttpClientProvider(): Provider | EnvironmentProviders {
  return [
    {
      provide: TOKEN_HTTP_CACHE_CONFIG,
      useValue: httpCacheConfig,
    },
    provideHttpClient(
      withInterceptors([
        httpCacheInterceptor,
        httpReporterInterceptor,
        httpErrorInterceptor,
        authTokenRefreshInterceptor,
        authTokenInterceptor,
      ]),
    ),
  ]
}
