import { EnvironmentProviders, Provider } from "@angular/core"
import { APP_ENV_SERVICE, TOKEN_ENV } from "../../configuration/env"

export function appEnvServiceProvider(): Provider | EnvironmentProviders {
  return {
    provide: TOKEN_ENV,
    useValue: APP_ENV_SERVICE,
  }
}
