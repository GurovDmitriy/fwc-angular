import { inject, Injectable } from "@angular/core"
import { map } from "rxjs"
import { httpWrapWithStatus } from "../../core/http"
import { PreviewApiService } from "./internal/preview-api.service"

@Injectable({
  providedIn: "any",
})
export class PreviewListUsecase {
  api = inject(PreviewApiService)

  constructor() {}

  handle() {
    return this.api.list().pipe(
      map((res) => {
        return {
          ...res,
          data: res.data.map((item) => {
            return {
              ...item,
              image: `images/${item.image}`,
            }
          }),
        }
      }),
      httpWrapWithStatus(),
    )
  }
}
