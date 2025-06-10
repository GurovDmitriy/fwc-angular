import { Injectable } from "@angular/core"
import { from, Observable } from "rxjs"
import { createStorage } from "unstorage"
import localStorageDriver from "unstorage/drivers/localstorage"
import { StorageCustom } from "./types"

@Injectable({
  providedIn: "root",
})
export class StorageBase implements StorageCustom {
  private storage = createStorage({
    driver: localStorageDriver({ base: "app:" }),
  })

  setItem(
    ...params: Parameters<typeof this.storage.setItem>
  ): Observable<void> {
    return from(this.storage.setItem(...params))
  }

  removeItem(
    ...params: Parameters<typeof this.storage.removeItem>
  ): Observable<void> {
    return from(this.storage.removeItem(...params))
  }
}
