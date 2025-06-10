import {
  EnvironmentProviders,
  inject,
  provideAppInitializer,
  Provider,
} from "@angular/core"
import {
  CONFIG_RUNTIME_INITIAL_VALUE,
  ConfigRuntimeServiceBase,
  TOKEN_CONFIG_RUNTIME_INITIAL_VALUE,
  TOKEN_CONFIG_RUNTIME_SERVICE,
} from "../../configuration/config-runtime"

export function appConfigRuntimeProvider(): Provider | EnvironmentProviders {
  return [
    {
      provide: TOKEN_CONFIG_RUNTIME_SERVICE,
      useClass: ConfigRuntimeServiceBase,
    },
    {
      provide: TOKEN_CONFIG_RUNTIME_INITIAL_VALUE,
      useValue: CONFIG_RUNTIME_INITIAL_VALUE,
    },
  ]
}

export function appConfigRuntimeInitializer(): Provider | EnvironmentProviders {
  return provideAppInitializer(() => {
    const configRuntimeService = inject(TOKEN_CONFIG_RUNTIME_SERVICE)
    return configRuntimeService.load()
  })
}
