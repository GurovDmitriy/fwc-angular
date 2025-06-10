import { Observable } from "rxjs"

export interface MediaQueryState {
  xs: boolean
  sm: boolean
  md: boolean
  lg: boolean
  xl: boolean
  xxl: boolean
}

export interface MediaQuery {
  state$: Observable<MediaQueryState>
}

export type MediaQueryStateKeyName = keyof MediaQueryState
