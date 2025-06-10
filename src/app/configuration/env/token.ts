import { InjectionToken } from "@angular/core"
import { Environment } from "./types"

export const TOKEN_ENV = new InjectionToken<Environment>("app.evn Environment")
