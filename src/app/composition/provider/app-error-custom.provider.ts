import {
  EnvironmentProviders,
  ErrorHandler,
  inject,
  provideAppInitializer,
  Provider,
} from "@angular/core"
import {
  ErrorHandlerDefault,
  ErrorServiceDefault,
  TOKEN_ERROR_MAPPER,
  TOKEN_ERROR_SERVICE,
} from "../../core/error"
import { ErrorMapperCustom, ErrorReporter } from "../../domains/error"

export function appErrorHandlerProvider(): Provider | EnvironmentProviders {
  return {
    provide: ErrorHandler,
    useClass: ErrorHandlerDefault,
  }
}

export function appErrorServiceProvider(): Provider | EnvironmentProviders {
  return {
    provide: TOKEN_ERROR_SERVICE,
    useClass: ErrorServiceDefault,
  }
}

export function appErrorMapperProvider(): Provider | EnvironmentProviders {
  return {
    provide: TOKEN_ERROR_MAPPER,
    useClass: ErrorMapperCustom,
  }
}

export function appErrorReporterProvider(): Provider | EnvironmentProviders {
  return {
    provide: ErrorReporter,
    useClass: ErrorReporter,
  }
}

export function appErrorReporterInitializer(): Provider | EnvironmentProviders {
  return provideAppInitializer(() => {
    const errorReporter = inject(ErrorReporter)
    return Promise.resolve(errorReporter)
  })
}
