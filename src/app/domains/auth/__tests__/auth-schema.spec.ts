import { TestBed } from "@angular/core/testing"
import { Observable } from "rxjs"
import { beforeEach, describe, it, vi } from "vitest"
import {
  ErrorSchemaBaseFactory,
  ErrorService,
  TOKEN_ERROR_SERVICE,
} from "../../../core/error"
import { AuthSchema } from "../internal"
import { AuthSignToken } from "../types"

describe("AuthSchema", () => {
  let authSchema: AuthSchema
  let spyErrorService: ErrorService
  let spyErrorFactory: ErrorSchemaBaseFactory

  beforeEach(() => {
    spyErrorService = {
      error$: new Observable(),
      handle: vi.fn().mockImplementation((arg) => arg),
    }

    spyErrorFactory = {
      create: vi.fn().mockImplementation((arg) => arg),
    }

    TestBed.configureTestingModule({
      providers: [
        AuthSchema,
        {
          provide: TOKEN_ERROR_SERVICE,
          useValue: spyErrorService,
        },
        {
          provide: ErrorSchemaBaseFactory,
          useValue: spyErrorFactory,
        },
      ],
    })

    authSchema = TestBed.inject(AuthSchema)
    spyErrorService = TestBed.inject(TOKEN_ERROR_SERVICE)
    spyErrorFactory = TestBed.inject(ErrorSchemaBaseFactory)
  })

  it("signIn should be return mapped output", () => {
    // Arrange
    const mockResponse: AuthSignToken = {
      id: "123abc",
      tokenAccess: "abc",
      tokenRefresh: "abc",
    }

    // Act
    const responseMapped = authSchema.signIn(mockResponse)

    // Assert
    ;["id", "tokenAccess", "tokenRefresh"].forEach((key) => {
      expect((responseMapped as any)[key]).toBeTruthy()
    })
  })

  it("signIn should be throw Error", () => {
    const mockResponse = {
      id: "123abc",
      accessToken: "abc",
      tokenRefresh: "abc",
    } as unknown as AuthSignToken

    // Act
    const action = () => authSchema.signIn(mockResponse)

    // Assert
    expect(action).toThrowError()
  })

  it.todo("signUp should be return mapped output", () => {})

  it.todo("signUp should be throw Error", () => {})

  it.todo("tokenRefresh should be return mapped output", () => {})

  it.todo("tokenRefresh should be throw Error", () => {})

  it.todo("me should be return mapped output", () => {})

  it.todo("me should be throw Error", () => {})
})
