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
import { CartApiService } from "../internal/cart-api.service"
import { CartSchema } from "../internal/cart.schema"
import { CartNormalized, CartProductAddPayload } from "../types"

describe("CartApiService", () => {
  let apiService: CartApiService

  let envService: Environment
  let httpTesting: HttpTestingController
  let spySchema: Record<keyof CartSchema, ReturnType<typeof vi.fn>>
  let spyHttpCache: Record<keyof HttpCache, any>

  beforeEach(() => {
    spySchema = {
      cart: vi.fn().mockImplementation((arg) => arg),
    }

    spyHttpCache = {
      tokenKeyCacheSave: "CacheKey",
      tokenKeyCacheReset: "ResetKey",
      connect: vi.fn().mockImplementation((arg) => arg),
      setKeyCacheSaveCtx: vi.fn().mockImplementation((arg) => arg),
      setKeyCacheResetCtx: vi.fn().mockImplementation((arg) => arg),
    }

    TestBed.configureTestingModule({
      providers: [
        CartApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        appEnvServiceProvider(),
        {
          provide: CartSchema,
          useValue: spySchema,
        },
        {
          provide: HttpCache,
          useValue: spyHttpCache,
        },
      ],
    })

    apiService = TestBed.inject(CartApiService)
    envService = TestBed.inject(TOKEN_ENV)
    httpTesting = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpTesting.verify()
  })

  describe("cart", () => {
    test("cart create correct GET request", async () => {
      // arrange
      const url = `${envService.apiUrl}/cart`

      const mockReturn = {
        id: "1",
        list: {},
      } as CartNormalized

      const query$ = apiService.cart()

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

    it("cart should throw Error Schema", async () => {
      // Arrange
      const url = `${envService.apiUrl}/cart`

      const mockReturn = {
        id: "1",
        list: {},
      } as CartNormalized

      spySchema.cart.mockImplementation(() => {
        throw new Error("Error Schema")
      })

      const query$ = apiService.cart()

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)

      // Act (HTTP response)
      req.flush(mockReturn)

      // Assert (result)
      await expect(queryPromise).rejects.toThrow()
    })

    it("cart should throw HttpError", async () => {
      // Arrange
      const url = `${envService.apiUrl}/cart`

      const query$ = apiService.cart()

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)

      // Act (HTTP response)
      req.flush("Failed!", { status: 500, statusText: "Error unknown" })

      // Assert (result)
      await expect(queryPromise).rejects.toThrow()
    })

    it("cart should throw ProgressEvent", async () => {
      // Arrange
      const url = `${envService.apiUrl}/cart`

      const query$ = apiService.cart()

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)

      // Act (HTTP response)
      req.error(new ProgressEvent("network error!"))

      // Assert (result)
      await expect(queryPromise).rejects.toThrow()
    })
  })

  describe("add", () => {
    test("add create correct POST request", async () => {
      // arrange
      const url = `${envService.apiUrl}/cart/add`

      const mockPayload = {
        productId: "1",
        quantity: 1,
      } as CartProductAddPayload

      const mockReturn = {
        id: "1",
        list: {},
      } as CartNormalized

      const query$ = apiService.add(mockPayload)

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)

      // Assert (HTTP request)
      expect(req.request.method).toBe("POST")
      expect(req.request.body).toEqual(mockPayload)

      // Act (HTTP response)
      req.flush(mockReturn)

      // Assert (result)
      expect(await queryPromise).toEqual(mockReturn)
    })

    it("add should throw Error Schema", async () => {
      // Arrange
      const url = `${envService.apiUrl}/cart/add`

      const mockPayload = {
        productId: "1",
        quantity: 1,
      } as CartProductAddPayload

      const mockReturn = {
        id: "1",
        list: {},
      } as CartNormalized

      spySchema.cart.mockImplementation(() => {
        throw new Error("Error Schema")
      })

      const query$ = apiService.add(mockPayload)

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)

      // Act (HTTP response)
      req.flush(mockReturn)

      // Assert (result)
      await expect(queryPromise).rejects.toThrow()
    })

    it("add should throw HttpError", async () => {
      // Arrange
      const url = `${envService.apiUrl}/cart/add`

      const mockPayload = {
        productId: "1",
        quantity: 1,
      } as CartProductAddPayload

      const query$ = apiService.add(mockPayload)

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)

      // Act (HTTP response)
      req.flush("Failed!", { status: 500, statusText: "Error unknown" })

      // Assert (result)
      await expect(queryPromise).rejects.toThrow()
    })

    it("add should throw ProgressEvent", async () => {
      // Arrange
      const url = `${envService.apiUrl}/cart/add`

      const mockPayload = {
        productId: "1",
        quantity: 1,
      } as CartProductAddPayload

      const query$ = apiService.add(mockPayload)

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)

      // Act (HTTP response)
      req.error(new ProgressEvent("network error!"))

      // Assert (result)
      await expect(queryPromise).rejects.toThrow()
    })
  })

  describe("remove", () => {
    test("remove create correct POST request", async () => {
      // arrange
      const url = `${envService.apiUrl}/cart/remove`

      const mockPayload = {
        productId: "1",
        quantity: 1,
      } as CartProductAddPayload

      const mockReturn = {
        id: "1",
        list: {},
      } as CartNormalized

      const query$ = apiService.remove(mockPayload)

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)

      // Assert (HTTP request)
      expect(req.request.method).toBe("POST")
      expect(req.request.body).toEqual(mockPayload)

      // Act (HTTP response)
      req.flush(mockReturn)

      // Assert (result)
      expect(await queryPromise).toEqual(mockReturn)
    })

    it("remove should throw Error Schema", async () => {
      // Arrange
      const url = `${envService.apiUrl}/cart/remove`

      const mockPayload = {
        productId: "1",
        quantity: 1,
      } as CartProductAddPayload

      const mockReturn = {
        id: "1",
        list: {},
      } as CartNormalized

      spySchema.cart.mockImplementation(() => {
        throw new Error("Error Schema")
      })

      const query$ = apiService.remove(mockPayload)

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)

      // Act (HTTP response)
      req.flush(mockReturn)

      // Assert (result)
      await expect(queryPromise).rejects.toThrow()
    })

    it("remove should throw HttpError", async () => {
      // Arrange
      const url = `${envService.apiUrl}/cart/remove`

      const mockPayload = {
        productId: "1",
        quantity: 1,
      } as CartProductAddPayload

      const query$ = apiService.remove(mockPayload)

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)

      // Act (HTTP response)
      req.flush("Failed!", { status: 500, statusText: "Error unknown" })

      // Assert (result)
      await expect(queryPromise).rejects.toThrow()
    })

    it("remove should throw ProgressEvent", async () => {
      // Arrange
      const url = `${envService.apiUrl}/cart/remove`

      const mockPayload = {
        productId: "1",
        quantity: 1,
      } as CartProductAddPayload

      const query$ = apiService.remove(mockPayload)

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)

      // Act (HTTP response)
      req.error(new ProgressEvent("network error!"))

      // Assert (result)
      await expect(queryPromise).rejects.toThrow()
    })
  })

  describe("clear", () => {
    test("clear create correct POST request", async () => {
      // arrange
      const url = `${envService.apiUrl}/cart/clear`

      const mockReturn = {
        id: "1",
        list: {},
      } as CartNormalized

      const query$ = apiService.clear()

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)

      // Assert (HTTP request)
      expect(req.request.method).toBe("DELETE")
      expect(req.request.body).toBeFalsy()

      // Act (HTTP response)
      req.flush(mockReturn)

      // Assert (result)
      expect(await queryPromise).toEqual(mockReturn)
    })

    it("clear should throw Error Schema", async () => {
      // Arrange
      const url = `${envService.apiUrl}/cart/clear`

      const mockReturn = {
        id: "1",
        list: {},
      } as CartNormalized

      spySchema.cart.mockImplementation(() => {
        throw new Error("Error Schema")
      })

      const query$ = apiService.clear()

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)

      // Act (HTTP response)
      req.flush(mockReturn)

      // Assert (result)
      await expect(queryPromise).rejects.toThrow()
    })

    it("clear should throw HttpError", async () => {
      // Arrange
      const url = `${envService.apiUrl}/cart/clear`

      const query$ = apiService.clear()

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)

      // Act (HTTP response)
      req.flush("Failed!", { status: 500, statusText: "Error unknown" })

      // Assert (result)
      await expect(queryPromise).rejects.toThrow()
    })

    it("clear should throw ProgressEvent", async () => {
      // Arrange
      const url = `${envService.apiUrl}/cart/clear`

      const query$ = apiService.clear()

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
