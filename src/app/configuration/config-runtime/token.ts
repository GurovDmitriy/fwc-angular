import { InjectionToken } from "@angular/core"
import { ConfigRuntime, ConfigRuntimeService } from "./types"

export const TOKEN_CONFIG_RUNTIME_SERVICE =
  new InjectionToken<ConfigRuntimeService>("app.config ConfigRuntimeService")

export const TOKEN_CONFIG_RUNTIME_INITIAL_VALUE =
  new InjectionToken<ConfigRuntime>("app.config ConfigRuntime")
