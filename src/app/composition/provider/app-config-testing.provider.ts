import { EnvironmentProviders, Provider } from "@angular/core"
import {
  APP_CONFIG_TESTING_SERVICE,
  TOKEN_CONFIG_TESTING,
} from "../../configuration/config-testing"

export function appConfigTestingProvider(): Provider | EnvironmentProviders {
  return {
    provide: TOKEN_CONFIG_TESTING,
    useValue: APP_CONFIG_TESTING_SERVICE,
  }
}
