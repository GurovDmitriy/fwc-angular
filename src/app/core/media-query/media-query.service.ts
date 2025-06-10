import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import { MediaQueryState, MediaQueryStateKeyName } from "./types"

/**
 * Provide mediaQuery state breakpoints
 */
@Injectable({
  providedIn: "root",
})
export class MediaQueryService {
  private mediaQueries = new Map<keyof MediaQueryState, MediaQueryList>()
  private listeners = new Map<string, (event: MediaQueryListEvent) => void>()

  private breakpoints = {
    xs: "(min-width: 0px) and (max-width: 575px)",
    sm: "(min-width: 576px) and (max-width: 767px)",
    md: "(min-width: 768px) and (max-width: 991px)",
    lg: "(min-width: 992px) and (max-width: 1199px)",
    xl: "(min-width: 1200px) and (max-width: 1599px)",
    xxl: "(min-width: 1600px)",
  }

  private stateSubject = new BehaviorSubject<MediaQueryState>({
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
    xxl: false,
  })

  public state$ = this.stateSubject.asObservable()

  constructor() {
    this._initMediaQueries()
    this._updateInitialState()
  }

  private _initMediaQueries(): void {
    Object.entries(this.breakpoints).forEach(([key, query]) => {
      const mediaQuery = window.matchMedia(query)

      const listener = (event: MediaQueryListEvent) => {
        this.stateSubject.next({
          ...this.stateSubject.getValue(),
          [key]: event.matches,
        })
      }

      mediaQuery.addEventListener("change", listener)
      this.mediaQueries.set(key as MediaQueryStateKeyName, mediaQuery)
      this.listeners.set(key, listener)
    })
  }

  private _updateInitialState(): void {
    const state = { ...this.stateSubject.getValue(), ready: true }

    for (const [key, mediaQuery] of this.mediaQueries) {
      if (mediaQuery.matches) {
        state[key] = true
      }
    }

    this.stateSubject.next(state)
  }

  destroy(): void {
    this.listeners.forEach((listener, key) => {
      const mediaQuery = this.mediaQueries.get(key as MediaQueryStateKeyName)
      mediaQuery?.removeEventListener("change", listener)
    })
  }
}
