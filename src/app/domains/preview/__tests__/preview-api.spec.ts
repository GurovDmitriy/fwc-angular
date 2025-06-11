import { provideHttpClient } from "@angular/common/http"
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing"
import { TestBed } from "@angular/core/testing"
import { firstValueFrom } from "rxjs"
import { afterEach, expect, it, test, vi } from "vitest"
import { appEnvServiceProvider } from "../../../composition/provider"
import { Environment, TOKEN_ENV } from "../../../configuration/env"
import { HttpCache } from "../../../core/http/http-cache"
import { PreviewApiService } from "../internal/preview-api.service"
import { Preview } from "../types"

describe("CartApiService", () => {
  let apiService: PreviewApiService

  let envService: Environment
  let httpTesting: HttpTestingController
  let spyHttpCache: Record<keyof HttpCache, any>

  beforeEach(() => {
    spyHttpCache = {
      tokenKeyCacheSave: "CacheKey",
      tokenKeyCacheReset: "ResetKey",
      connect: vi.fn().mockImplementation((arg) => arg),
      setKeyCacheSaveCtx: vi.fn().mockImplementation((arg) => arg),
      setKeyCacheResetCtx: vi.fn().mockImplementation((arg) => arg),
    }

    TestBed.configureTestingModule({
      providers: [
        PreviewApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        appEnvServiceProvider(),
        {
          provide: HttpCache,
          useValue: spyHttpCache,
        },
      ],
    })

    apiService = TestBed.inject(PreviewApiService)
    envService = TestBed.inject(TOKEN_ENV)
    httpTesting = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpTesting.verify()
  })

  describe("list", () => {
    test("list create correct GET request", async () => {
      // arrange
      const url = `${envService.apiUrl}/category`

      const mockReturn = {
        data: [
          {
            id: "1",
            name: "name",
            image: "image",
          },
        ],
      } as { data: Preview[] }

      const query$ = apiService.list()

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)

      // Assert (HTTP request)
      expect(req.request.method).toBe("GET")
      expect(req.request.body).toBeFalsy()

      // Act (HTTP response)
      req.flush(mockReturn)

      // Assert (result)
      expect(await queryPromise).toEqual(mockReturn)
    })

    it("list should throw HttpError", async () => {
      // Arrange
      const url = `${envService.apiUrl}/category`

      const query$ = apiService.list()

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)

      // Act (HTTP response)
      req.flush("Failed!", { status: 500, statusText: "Error unknown" })

      // Assert (result)
      await expect(queryPromise).rejects.toThrow()
    })

    it("list should throw ProgressEvent", async () => {
      // Arrange
      const url = `${envService.apiUrl}/category`

      const query$ = apiService.list()

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)

      // Act (HTTP response)
      req.error(new ProgressEvent("network error!"))

      // Assert (result)
      await expect(queryPromise).rejects.toThrow()
    })
  })
})
