import { fakeAsync, TestBed, tick } from "@angular/core/testing"
import { AbstractControl } from "@angular/forms"
import { of, throwError } from "rxjs"
import { vi } from "vitest"
import { AuthApiService } from "../internal"
import { AuthEmailValidator } from "../internal/auth-email.validator"

describe("AuthEmailValidator", () => {
  let validator: AuthEmailValidator
  let authApiServiceMock: Partial<AuthApiService>

  beforeEach(() => {
    authApiServiceMock = {
      validateEmail: vi.fn(),
    }

    TestBed.configureTestingModule({
      providers: [
        AuthEmailValidator,
        { provide: AuthApiService, useValue: authApiServiceMock },
      ],
    })

    validator = TestBed.inject(AuthEmailValidator)
  })

  function createControl(value: string): AbstractControl {
    return { value } as AbstractControl
  }

  it("should return null when email is valid", fakeAsync(() => {
    // Arrange
    ;(authApiServiceMock.validateEmail as any).mockReturnValue(of(null))

    const control = createControl("test@example.com")
    let result: any

    // Act
    validator.validate(control).subscribe((res) => (result = res))

    tick(1000)
    tick()
    expect(result).toBeNull()
  }))

  it("should return error object when email exists", fakeAsync(() => {
    // Arrange
    ;(authApiServiceMock.validateEmail as any).mockReturnValue(
      throwError(() => new Error("exists")),
    )

    const control = createControl("exists@example.com")
    let result: any

    validator.validate(control).subscribe((res) => (result = res))

    tick(1000)
    tick()
    expect(result).toEqual({ customExistEmail: true })
  }))
})
