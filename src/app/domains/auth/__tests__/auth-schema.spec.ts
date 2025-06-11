import { TestBed } from "@angular/core/testing"
import { Observable } from "rxjs"
import { beforeEach, describe, it, vi } from "vitest"
import {
  ErrorSchemaBaseFactory,
  ErrorService,
  TOKEN_ERROR_SERVICE,
} from "../../../core/error"
import { AuthSchema } from "../internal"
import { AuthSignToken, AuthUser } from "../types"

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
    expect(responseMapped).toEqual(mockResponse)
  })

  it("signIn should be throw error", () => {
    const mockResponse = {
      id: "123abc",
      accessToken: "abc", // filed name invalid
      refreshToken: "abc", // filed name invalid
    } as unknown as AuthSignToken

    // Act
    const action = () => authSchema.signIn(mockResponse)

    // Assert
    expect(action).toThrowError()
  })

  it("signUp should be return mapped output", () => {
    // Arrange
    const mockResponse: AuthSignToken = {
      id: "123abc",
      tokenAccess: "abc",
      tokenRefresh: "abc",
    }

    // Act
    const responseMapped = authSchema.signUp(mockResponse)

    // Assert
    expect(responseMapped).toEqual(mockResponse)
  })

  it("signUp should be throw Error", () => {
    const mockResponse = {
      id: "123abc",
      accessToken: "abc", // filed name invalid
      refreshToken: "abc", // filed name invalid
    } as unknown as AuthSignToken

    // Act
    const action = () => authSchema.signUp(mockResponse)

    // Assert
    expect(action).toThrowError()
  })

  it("tokenRefresh should be return mapped output", () => {
    // Arrange
    const mockResponse: AuthSignToken = {
      id: "123abc",
      tokenAccess: "abc",
      tokenRefresh: "abc",
    }

    // Act
    const responseMapped = authSchema.tokenRefresh(mockResponse)

    // Assert
    expect(responseMapped).toEqual(mockResponse)
  })

  it("tokenRefresh should be throw error", () => {
    const mockResponse = {
      id: "123abc",
      accessToken: "abc", // filed name invalid
      refreshToken: "abc", // filed name invalid
    } as unknown as AuthSignToken

    // Act
    const action = () => authSchema.tokenRefresh(mockResponse)

    // Assert
    expect(action).toThrowError()
  })

  it("me should be return mapped output", () => {
    // Arrange
    const mockResponse: AuthUser = {
      id: "123abc",
      name: "name",
      email: "email@gmail.com",
    }

    // Act
    const responseMapped = authSchema.me(mockResponse)

    // Assert
    expect(responseMapped).toEqual(mockResponse)
  })

  it("me should be throw Error", () => {
    const mockResponse: AuthUser = {
      id: "123abc",
      username: "name", // field name invalid
      email: "email@gmail.com",
    } as unknown as AuthUser

    // Act
    const action = () => authSchema.me(mockResponse)

    // Assert
    expect(action).toThrowError()
  })
})
