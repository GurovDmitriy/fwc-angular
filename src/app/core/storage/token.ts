import { InjectionToken } from "@angular/core"
import type { StorageCustom } from "./types"

export const TOKEN_STORAGE_CUSTOM = new InjectionToken<StorageCustom>(
  "app.service StorageCustom",
)
