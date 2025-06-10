import { Observable } from "rxjs"

export interface StorageCustom {
  setItem(...params: any[]): Observable<void>
  removeItem(...params: any[]): Observable<void>
}
