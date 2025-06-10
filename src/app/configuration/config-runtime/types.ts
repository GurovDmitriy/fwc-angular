import { FromJS } from "immutable"
import { Observable } from "rxjs"

export interface ConfigRuntimeService {
  config$: Observable<ConfigRuntimeImm>
  load(): Promise<ConfigRuntimeImm>
  update(cb: (value: ConfigRuntimeImm) => ConfigRuntimeImm): void
}

export interface ConfigRuntime {
  theme: "dark" | "light"
  nameApp: string
}

export type ConfigRuntimeImm = FromJS<ConfigRuntime>
