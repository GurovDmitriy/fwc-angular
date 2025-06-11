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
import { Preview } from "../../preview"
import { ProductApiService } from "../internal/product-api.service"

describe("CartApiService", () => {
  let apiService: ProductApiService

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
        ProductApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        appEnvServiceProvider(),
        {
          provide: HttpCache,
          useValue: spyHttpCache,
        },
      ],
    })

    apiService = TestBed.inject(ProductApiService)
    envService = TestBed.inject(TOKEN_ENV)
    httpTesting = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpTesting.verify()
  })

  describe("productByCategory", () => {
    test("productByCategory create correct GET request", async () => {
      // arrange
      const categoryId = "1"

      const mockReturn = {
        data: [
          {
            id: "1",
            name: "name",
            image: "image",
          },
        ],
      } as { data: Preview[] }

      const query$ = apiService.productByCategory(categoryId)

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(
        `${envService.apiUrl}/category/${categoryId}/product`,
      )

      // Assert (HTTP request)
      expect(req.request.method).toBe("GET")
      expect(req.request.body).toBeFalsy()

      // Act (HTTP response)
      req.flush(mockReturn)

      // Assert (result)
      expect(await queryPromise).toEqual(mockReturn)
    })

    it("productByCategory should throw HttpError", async () => {
      // arrange
      const categoryId = "1"

      const query$ = apiService.productByCategory(categoryId)

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(
        `${envService.apiUrl}/category/${categoryId}/product`,
      )

      // Act (HTTP response)
      req.flush("Failed!", { status: 500, statusText: "Error unknown" })

      // Assert (result)
      await expect(queryPromise).rejects.toThrow()
    })

    it("productByCategory throw ProgressEvent", async () => {
      // arrange
      const categoryId = "1"

      const query$ = apiService.productByCategory(categoryId)

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(
        `${envService.apiUrl}/category/${categoryId}/product`,
      )

      // Act (HTTP response)
      req.error(new ProgressEvent("network error!"))

      // Assert (result)
      await expect(queryPromise).rejects.toThrow()
    })
  })

  describe("productById", () => {
    test("productById create correct GET request", async () => {
      // arrange
      const productId = "1"

      const mockReturn = {
        data: [
          {
            id: "1",
            name: "name",
            image: "image",
          },
        ],
      } as { data: Preview[] }

      const query$ = apiService.productById(productId)

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(
        `${envService.apiUrl}/product/${productId}`,
      )

      // Assert (HTTP request)
      expect(req.request.method).toBe("GET")
      expect(req.request.body).toBeFalsy()

      // Act (HTTP response)
      req.flush(mockReturn)

      // Assert (result)
      expect(await queryPromise).toEqual(mockReturn)
    })

    it("productById should throw HttpError", async () => {
      // arrange
      const productId = "1"

      const query$ = apiService.productById(productId)

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(
        `${envService.apiUrl}/product/${productId}`,
      )

      // Act (HTTP response)
      req.flush("Failed!", { status: 500, statusText: "Error unknown" })

      // Assert (result)
      await expect(queryPromise).rejects.toThrow()
    })

    it("productById throw ProgressEvent", async () => {
      // arrange
      const productId = "1"

      const query$ = apiService.productById(productId)

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(
        `${envService.apiUrl}/product/${productId}`,
      )

      // Act (HTTP response)
      req.error(new ProgressEvent("network error!"))

      // Assert (result)
      await expect(queryPromise).rejects.toThrow()
    })
  })
})
