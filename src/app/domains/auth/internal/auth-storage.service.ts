import { Injectable } from "@angular/core"
import { from, Observable } from "rxjs"
import { createStorage } from "unstorage"
import localStorageDriver from "unstorage/drivers/localstorage"

@Injectable({
  providedIn: "root",
})
export class AuthStorageService {
  private storage = createStorage({
    driver: localStorageDriver({ base: "app:auth:" }),
  })

  setItem(
    ...params: Parameters<typeof this.storage.setItem>
  ): Observable<void> {
    return from(this.storage.setItem(...params))
  }

  getItem(
    ...params: Parameters<typeof this.storage.getItem>
  ): Observable<any | null> {
    return from(this.storage.getItem(...params))
  }

  removeItem(
    ...params: Parameters<typeof this.storage.removeItem>
  ): Observable<void> {
    return from(this.storage.removeItem(...params))
  }
}
