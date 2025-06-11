import { HttpClient } from "@angular/common/http"
import { inject, Injectable } from "@angular/core"
import { fromJS, is } from "immutable"
import {
  BehaviorSubject,
  catchError,
  distinctUntilChanged,
  firstValueFrom,
  map,
  of,
  tap,
} from "rxjs"
import { TOKEN_ERROR_SERVICE } from "../../core/error"
import { TOKEN_ENV } from "../env"
import { TOKEN_CONFIG_RUNTIME_INITIAL_VALUE } from "./token"
import { ConfigRuntime, ConfigRuntimeImm, ConfigRuntimeService } from "./types"

@Injectable({
  providedIn: "root",
})
export class ConfigRuntimeServiceBase implements ConfigRuntimeService {
  private envService = inject(TOKEN_ENV)
  private httpClient = inject(HttpClient)
  private errorService = inject(TOKEN_ERROR_SERVICE)
  private initialValue = inject(TOKEN_CONFIG_RUNTIME_INITIAL_VALUE)

  private initConfig: ConfigRuntimeImm = fromJS(
    this.initialValue || {
      theme: "",
      nameApp: "",
    },
  )

  private fileMap = {
    development: "/config-runtime.development.json",
    staging: "/config-runtime.staging.json",
    production: "/config-runtime.production.json",
    testing: "/config-runtime.testing.json",
  }
  private configSubject = new BehaviorSubject<ConfigRuntimeImm>(this.initConfig)

  private url = `${this.envService.appUrl || ""}${this.fileMap[this.envService.mode] || this.fileMap.development}`

  config$ = this.configSubject
    .asObservable()
    .pipe(
      distinctUntilChanged((previous: any, current: any) =>
        is(previous, current),
      ),
    )

  constructor() {}

  load(): Promise<ConfigRuntimeImm> {
    return firstValueFrom(
      this.httpClient.get<ConfigRuntime>(this.url).pipe(
        map((value) => fromJS(value)),
        tap((value: any) =>
          this.configSubject.next(
            this.configSubject.getValue().mergeDeep(value),
          ),
        ),
        catchError((error) => {
          this.errorService.handle(error)
          return of(this.initConfig)
        }),
      ),
    )
  }

  update(cb: (value: ConfigRuntimeImm) => ConfigRuntimeImm) {
    this.configSubject.next(cb(this.configSubject.getValue()))
  }
}
