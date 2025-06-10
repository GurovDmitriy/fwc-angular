import { HttpClient } from "@angular/common/http"
import { inject, Injectable } from "@angular/core"
import { map, Observable } from "rxjs"
import { TOKEN_ENV } from "../../../configuration/env"
import {
  AuthSignInPayload,
  AuthSignToken,
  AuthSignUpPayload,
  AuthUser,
} from "../types"
import { AuthSchema } from "./auth.schema"

@Injectable({
  providedIn: "root",
})
export class AuthApiService {
  private envService = inject(TOKEN_ENV)
  private httpClient = inject(HttpClient)
  private schema = inject(AuthSchema)

  signUp(payload: AuthSignUpPayload): Observable<AuthSignToken> {
    return this.httpClient
      .post<AuthSignToken>(`${this.envService.apiUrl}/auth/sign-up`, payload)
      .pipe(map((value) => this.schema.signUp(value)))
  }

  signIn(payload: AuthSignInPayload): Observable<AuthSignToken> {
    return this.httpClient
      .post<AuthSignToken>(`${this.envService.apiUrl}/auth/sign-in`, payload)
      .pipe(map((value) => this.schema.signIn(value)))
  }

  signOut(): Observable<null> {
    return this.httpClient.post<null>(
      `${this.envService.apiUrl}/auth/sign-out`,
      {},
    )
  }

  tokenRefresh(tokenRefresh: string): Observable<AuthSignToken> {
    return this.httpClient
      .post<AuthSignToken>(`${this.envService.apiUrl}/auth/refresh`, {
        tokenRefresh,
      })
      .pipe(map((value) => this.schema.tokenRefresh(value)))
  }

  me(): Observable<AuthUser> {
    return this.httpClient
      .get<AuthUser>(`${this.envService.apiUrl}/auth/me`)
      .pipe(map((value) => this.schema.me(value)))
  }

  validateEmail(payload: Pick<AuthSignUpPayload, "email">): Observable<void> {
    return this.httpClient.post<void>(
      `${this.envService.apiUrl}/auth/validate-email`,
      payload,
    )
  }
}
