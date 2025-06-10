import {
  EnvironmentProviders,
  inject,
  provideAppInitializer,
  Provider,
} from "@angular/core"
import { MediaQueryService, TOKEN_MEDIA_QUERY } from "../../core/media-query"

export function appMediaQueryProvider(): Provider | EnvironmentProviders {
  return {
    provide: TOKEN_MEDIA_QUERY,
    useClass: MediaQueryService,
  }
}

export function appMediaQueryInitializer(): Provider | EnvironmentProviders {
  return provideAppInitializer(() => {
    const mediaQueryService = inject(TOKEN_MEDIA_QUERY)
    return Promise.resolve(mediaQueryService)
  })
}
