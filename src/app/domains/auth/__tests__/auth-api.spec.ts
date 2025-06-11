import { provideHttpClient } from "@angular/common/http"
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing"
import { TestBed } from "@angular/core/testing"
import { firstValueFrom } from "rxjs"
import { afterEach, beforeEach, describe, expect, it, test, vi } from "vitest"
import { appEnvServiceProvider } from "../../../composition/provider"
import { Environment, TOKEN_ENV } from "../../../configuration/env"
import { HttpCache } from "../../../core/http/http-cache"
import { AuthApiService, AuthSchema } from "../internal"
import {
  AuthSignInPayload,
  AuthSignToken,
  AuthSignUpPayload,
  AuthUser,
} from "../types"

describe("AuthApiService", () => {
  let apiService: AuthApiService

  let envService: Environment
  let httpTesting: HttpTestingController
  let spySchema: Record<keyof AuthSchema, ReturnType<typeof vi.fn>>
  let spyHttpCache: Record<keyof HttpCache, any>

  beforeEach(() => {
    const authSchema = {
      signUp: vi.fn().mockImplementation((arg) => arg),
      signIn: vi.fn().mockImplementation((arg) => arg),
      tokenRefresh: vi.fn().mockImplementation((arg) => arg),
      me: vi.fn().mockImplementation((arg) => arg),
    }

    const httpCache = {
      cacheKey: "CacheKey",
      resetKey: "ResetKey",
      connect: vi.fn().mockImplementation((arg) => arg),
      setCtxCacheKey: vi.fn().mockImplementation((arg) => arg),
      setCtxResetKey: vi.fn().mockImplementation((arg) => arg),
    }

    TestBed.configureTestingModule({
      providers: [
        AuthApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        appEnvServiceProvider(),
        {
          provide: AuthSchema,
          useValue: authSchema,
        },
        {
          provide: HttpCache,
          useValue: httpCache,
        },
      ],
    })

    spySchema = TestBed.inject(AuthSchema) as unknown as Record<
      keyof AuthSchema,
      ReturnType<typeof vi.fn>
    >
    spyHttpCache = TestBed.inject(HttpCache) as unknown as Record<
      keyof HttpCache,
      any
    >

    envService = TestBed.inject(TOKEN_ENV)
    httpTesting = TestBed.inject(HttpTestingController)

    apiService = TestBed.inject(AuthApiService)
  })

  afterEach(() => {
    httpTesting.verify()
  })

  describe("signUp", () => {
    test("signUp create correct POST request", async () => {
      // Arrange
      const url = `${envService.apiUrl}/auth/sign-up`
      const mockPayload: AuthSignUpPayload = {
        name: "name",
        email: "username@gmail.com",
        password: "1234",
        passwordConfirm: "1234",
      }

      const mockToken: AuthSignToken = {
        id: "123",
        tokenAccess: "abc",
        tokenRefresh: "abc",
      }

      const query$ = apiService.signUp(mockPayload)

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)

      // Assert (HTTP request)
      expect(req.request.method).toBe("POST")
      expect(req.request.body).toEqual(mockPayload)

      // Act (HTTP response)
      req.flush(mockToken)

      // Assert (result)
      expect(await queryPromise).toEqual(mockToken)
    })

    it("signUp should throw Error Schema", async () => {
      // Arrange
      const url = `${envService.apiUrl}/auth/sign-up`
      const mockPayload: AuthSignUpPayload = {
        name: "name",
        email: "username@gmail.com",
        password: "1234",
        passwordConfirm: "1234",
      }

      const mockToken: AuthSignToken = {
        id: "123",
        tokenAccess: "abc",
        tokenRefresh: "abc",
      }

      spySchema.signUp.mockImplementation(() => {
        throw new Error("Error Schema")
      })

      const query$ = apiService.signUp(mockPayload)

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)
      req.flush(mockToken)

      // Assert
      await expect(queryPromise).rejects.toThrow()
    })

    it("signUp throw HttpError", async () => {
      // Arrange
      const url = `${envService.apiUrl}/auth/sign-up`
      const mockPayload: AuthSignUpPayload = {
        name: "name",
        email: "username@gmail.com",
        password: "1234",
        passwordConfirm: "1234",
      }

      const query$ = apiService.signUp(mockPayload)

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)
      req.flush("Failed!", { status: 409, statusText: "Conflict" })

      // Assert
      await expect(queryPromise).rejects.toThrow()
    })

    it("signUp should throw ProgressEvent", async () => {
      // Arrange
      const url = `${envService.apiUrl}/auth/sign-up`
      const mockPayload: AuthSignUpPayload = {
        name: "name",
        email: "username@gmail.com",
        password: "1234",
        passwordConfirm: "1234",
      }

      const query$ = apiService.signUp(mockPayload)

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)
      req.error(new ProgressEvent("network error!"))

      // Assert
      await expect(queryPromise).rejects.toThrow()
    })
  })

  describe("signIn", () => {
    test("signIn create correct POST request", async () => {
      // Arrange
      const url = `${envService.apiUrl}/auth/sign-in`
      const mockPayload: AuthSignInPayload = {
        email: "username@gmail.com",
        password: "1234",
      }

      const mockToken: AuthSignToken = {
        id: "123",
        tokenAccess: "abc",
        tokenRefresh: "abc",
      }

      const query$ = apiService.signIn(mockPayload)

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)

      // Assert (HTTP request)
      expect(req.request.method).toBe("POST")
      expect(req.request.body).toEqual(mockPayload)

      // Act (HTTP response)
      req.flush(mockToken)

      // Assert (result)
      expect(await queryPromise).toEqual(mockToken)
    })

    it("signIn should throw Error Schema", async () => {
      // Arrange
      const url = `${envService.apiUrl}/auth/sign-in`
      const mockPayload: AuthSignInPayload = {
        email: "username@gmail.com",
        password: "1234",
      }

      const mockToken: AuthSignToken = {
        id: "123",
        tokenAccess: "abc",
        tokenRefresh: "abc",
      }

      spySchema.signIn.mockImplementation(() => {
        throw new Error("Error Schema")
      })

      const query$ = apiService.signIn(mockPayload)

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)
      req.flush(mockToken)

      // Assert
      await expect(queryPromise).rejects.toThrow()
    })

    it("signIn should throw HttpError", async () => {
      // Arrange
      const url = `${envService.apiUrl}/auth/sign-in`
      const mockPayload: AuthSignInPayload = {
        email: "username@gmail.com",
        password: "1234",
      }

      const query$ = apiService.signIn(mockPayload)

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)
      req.flush("Failed!", { status: 409, statusText: "Conflict" })

      // Assert
      await expect(queryPromise).rejects.toThrow()
    })

    it("signIn should throw ProgressEvent", async () => {
      // Arrange
      const url = `${envService.apiUrl}/auth/sign-in`
      const mockPayload: AuthSignInPayload = {
        email: "username@gmail.com",
        password: "1234",
      }

      const query$ = apiService.signIn(mockPayload)

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)
      req.error(new ProgressEvent("network error!"))

      // Assert
      await expect(queryPromise).rejects.toThrow()
    })
  })

  describe("signOut", () => {
    test("signOut create correct POST request", async () => {
      // Arrange
      const url = `${envService.apiUrl}/auth/sign-out`
      const mockReturnData = {}
      const query$ = apiService.signOut()

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)

      // Assert (HTTP request)
      expect(req.request.method).toBe("POST")

      // Act (HTTP response)
      req.flush(mockReturnData)

      // Assert (result)
      expect(await queryPromise).toEqual(mockReturnData)
    })

    it("signOut should throw HttpError", async () => {
      // Arrange
      const url = `${envService.apiUrl}/auth/sign-out`
      const query$ = apiService.signOut()

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)
      req.flush("Failed!", { status: 404, statusText: "Not found" })

      // Assert
      await expect(queryPromise).rejects.toThrow()
    })

    it("signOut should throw ProgressEvent", async () => {
      // Arrange
      const url = `${envService.apiUrl}/auth/sign-out`
      const query$ = apiService.signOut()

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)
      req.error(new ProgressEvent("network error!"))

      // Assert
      await expect(queryPromise).rejects.toThrow()
    })
  })

  describe("refreshToken", () => {
    test("refreshToken create correct POST request", async () => {
      // Arrange
      const url = `${envService.apiUrl}/auth/refresh`
      const mockRefreshToken = "123abc"

      const mockToken: AuthSignToken = {
        id: "123",
        tokenAccess: "abc",
        tokenRefresh: "abc",
      }

      const query$ = apiService.tokenRefresh(mockRefreshToken)

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)

      // Assert (HTTP request)
      expect(req.request.method).toBe("POST")

      // Act (HTTP response)
      req.flush(mockToken)

      // Assert (result)
      expect(await queryPromise).toEqual(mockToken)
    })

    it("refreshToken should throw HttpError", async () => {
      // Arrange
      const url = `${envService.apiUrl}/auth/refresh`
      const mockRefreshToken = "123abc"

      const query$ = apiService.tokenRefresh(mockRefreshToken)

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)
      req.flush("Failed!", { status: 404, statusText: "Not found" })

      // Assert
      await expect(queryPromise).rejects.toThrow()
    })

    it("refreshToken should throw ProgressEvent", async () => {
      // Arrange
      const url = `${envService.apiUrl}/auth/refresh`
      const mockRefreshToken = "123abc"
      const query$ = apiService.tokenRefresh(mockRefreshToken)

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)
      req.error(new ProgressEvent("network error!"))

      // Assert
      await expect(queryPromise).rejects.toThrow()
    })
  })

  describe("me", () => {
    test("me create correct GET request", async () => {
      // Arrange
      const url = `${envService.apiUrl}/auth/me`
      const mockUser: AuthUser = {
        id: "123",
        name: "name",
        email: "email@gmail.com",
      }

      const query$ = apiService.me()

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)

      // Assert (HTTP request)
      expect(req.request.method).toBe("GET")
      expect(req.request.body).toBeFalsy()

      // Act (HTTP response)
      req.flush(mockUser)

      // Assert (result)
      expect(await queryPromise).toEqual(mockUser)
    })

    it("me should throw Error Schema", async () => {
      // Arrange
      const url = `${envService.apiUrl}/auth/me`
      const mockUser: AuthUser = {
        id: "123",
        name: "name",
        email: "email@gmail.com",
      }

      spySchema.me.mockImplementation(() => {
        throw new Error("Error Schema")
      })

      const query$ = apiService.me()

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)
      req.flush(mockUser)

      // Assert
      await expect(queryPromise).rejects.toThrow()
    })

    it("me should throw HttpError", async () => {
      // Arrange
      const url = `${envService.apiUrl}/auth/me`

      const query$ = apiService.me()

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)
      req.flush("Failed!", { status: 409, statusText: "Conflict" })

      // Assert
      await expect(queryPromise).rejects.toThrow()
    })

    it("me should throw ProgressEvent", async () => {
      // Arrange
      const url = `${envService.apiUrl}/auth/me`

      const query$ = apiService.me()

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)
      req.error(new ProgressEvent("network error!"))

      // Assert
      await expect(queryPromise).rejects.toThrow()
    })
  })

  describe("meUpdate", () => {
    test("meUpdate create correct POST request", async () => {
      // Arrange
      const url = `${envService.apiUrl}/auth/me-update`

      const mockUser: AuthUser = {
        id: "123",
        name: "name",
        email: "email@gmail.com",
      }

      const mockUserPayload: AuthUser = {
        name: "name",
      } as any

      spyHttpCache.setKeyCacheResetCtx.mockImplementation((args: any) => args)

      const query$ = apiService.meUpdate(mockUserPayload)

      // Act
      const queryPromise = firstValueFrom(query$)
      const req = httpTesting.expectOne(url)

      // Assert (HTTP request)
      expect(req.request.method).toBe("POST")

      // Act (HTTP response)
      req.flush(mockUser)

      // Assert (result)
      expect(spyHttpCache.setKeyCacheResetCtx).toBeCalledTimes(1)
      expect(await queryPromise).toEqual(mockUser)
    })
  })
})
