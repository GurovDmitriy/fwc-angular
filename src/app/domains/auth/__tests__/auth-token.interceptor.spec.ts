import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from "@angular/common/http"
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing"
import { TestBed } from "@angular/core/testing"
import { of } from "rxjs"
import { afterEach, beforeEach, describe, test, vi } from "vitest"
import { authTokenInterceptor } from "../auth-token.interceptor"
import { AuthStorageService } from "../internal"

describe("TokenInterceptor", () => {
  let spyAuthStorageService: Record<
    keyof AuthStorageService,
    ReturnType<typeof vi.fn>
  >
  let httpTesting: HttpTestingController
  let http: HttpClient

  beforeEach(() => {
    spyAuthStorageService = {
      getItem: vi.fn().mockImplementation((arg) => arg),
      setItem: vi.fn().mockImplementation((arg) => arg),
      removeItem: vi.fn().mockImplementation((arg) => arg),
    }

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authTokenInterceptor])),
        provideHttpClientTesting(),
        {
          provide: AuthStorageService,
          useValue: spyAuthStorageService,
        },
      ],
    })

    httpTesting = TestBed.inject(HttpTestingController)
    http = TestBed.inject(HttpClient)
  })

  afterEach(() => {
    httpTesting.verify()
  })

  test("add header auth", async () => {
    // Arrange
    spyAuthStorageService.getItem.mockImplementation(() => of("tokenAccess"))

    // Act
    http.get("api/auth").subscribe()
    const req = httpTesting.expectOne("api/auth")

    // Assert
    expect(req.request.headers.get("Authorization")).toEqual(
      "Bearer tokenAccess",
    )
  })
})
