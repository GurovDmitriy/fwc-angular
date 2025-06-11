import { HttpClient } from "@angular/common/http"
import { inject, Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { TOKEN_ENV } from "../../../configuration/env"
import { Preview } from "../types"

@Injectable({
  providedIn: "root",
})
export class PreviewApiService {
  private envService = inject(TOKEN_ENV)
  private httpClient = inject(HttpClient)

  list(): Observable<{ data: Preview[] }> {
    return this.httpClient.get<{ data: Preview[] }>(
      `${this.envService.apiUrl}/category`,
    )
  }
}
