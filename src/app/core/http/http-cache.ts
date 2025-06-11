import {
  HttpContext,
  HttpContextToken,
  HttpEvent,
  HttpEventType,
  HttpHandlerFn,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http"
import { Inject, inject, Injectable, Optional } from "@angular/core"
import { OrderedMap } from "immutable"
import * as R from "ramda"
import { Observable, of, tap } from "rxjs"
import { TOKEN_ENV } from "../../configuration/env"
import { TOKEN_HTTP_CACHE_CONFIG } from "./token"
import { HttpCacheConfig } from "./types"

interface HttpCacheValue {
  data: HttpResponse<unknown>
  date: number
  key: string
}

@Injectable({
  providedIn: "root",
})
export class HttpCache {
  private envService = inject(TOKEN_ENV)

  private readonly config: HttpCacheConfig = {
    size: 5,
    time: 30 * 1000,
  }

  private cache = OrderedMap<string, HttpCacheValue>()

  tokenKeyCacheSave = new HttpContextToken<string | null>(() => null)
  tokenKeyCacheReset = new HttpContextToken<string | null>(() => null)

  constructor(
    @Optional()
    @Inject(TOKEN_HTTP_CACHE_CONFIG)
    private configUser?: Partial<HttpCacheConfig>,
  ) {
    if (configUser) {
      this.config = {
        ...this.config,
        ...this.configUser,
      }
    }
  }

  connect(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
  ): Observable<HttpEvent<unknown>> {
    this._removeCache(this._getKeyResetFromCtx(req))

    if (this._getIsTypeReqSkip(req)) return next(req)

    const key = this._getKeyCache(req)

    if (R.isEmpty(key)) return next(req)

    const cacheValue = this.cache.get(key)

    if (cacheValue && R.not(this._getIsExpireCache(cacheValue))) {
      return of(cacheValue.data.clone()).pipe(
        tap(() => {
          console.log("HttpCache: from cache")
        }),
      )
    }

    return next(req).pipe(
      tap((event) => {
        if (event.type === HttpEventType.Response) {
          this._saveCache(key, event.clone())
          if (this._getIsOverSizeCache()) this._removeCacheLast()
        }
      }),
    )
  }

  setKeyCacheSaveCtx(key: string): HttpContext {
    return new HttpContext().set(this.tokenKeyCacheSave, key)
  }

  setKeyCacheResetCtx(key: string): HttpContext {
    return new HttpContext().set(this.tokenKeyCacheReset, key)
  }

  private _saveCache(key: string, data: HttpResponse<unknown>): void {
    this.cache = this.cache.set(key, {
      data,
      date: Date.now(),
      key,
    })
  }

  private _removeCache(key: string | null | undefined): void {
    if (key) {
      this.cache = this.cache.remove(key)
    }
  }

  private _removeCacheLast(): void {
    R.when(
      (key: string | undefined): key is string => R.isNotNil(key),
      (key) => this._removeCache(key),
    )(this.cache.keySeq().first())
  }

  private _getKeyCache(req: HttpRequest<unknown>): string {
    return req.context.get(this.tokenKeyCacheSave) ?? req.urlWithParams
  }

  private _getKeyResetFromCtx(req: HttpRequest<unknown>): string | null {
    return req.context.get(this.tokenKeyCacheReset)
  }

  private _getIsTypeReqSkip(req: HttpRequest<unknown>): boolean {
    return R.cond([
      [
        (req: HttpRequest<unknown>) =>
          R.complement(R.equals)(req.method, "GET"),
        () => true,
      ],
      [(req) => R.not(req.url.startsWith(this.envService.apiUrl)), () => true],
      [R.T, () => false],
    ])(req)
  }

  private _getIsOverSizeCache(): boolean {
    return R.ifElse(
      () => R.gt(this.config.size, 0),
      () => R.gt(this.cache.size, this.config.size),
      () => true,
    )()
  }

  private _getIsExpireCache(value: HttpCacheValue | null | undefined): boolean {
    if (R.isNil(value)) return true

    return R.ifElse(
      () => R.gt(this.config.time, 0),
      () => R.gt(Date.now() - value.date, this.config.time),
      () => true,
    )()
  }
}
