import { provideHttpClient } from "@angular/common/http"
import { provideHttpClientTesting } from "@angular/common/http/testing"
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing"
import { FormBuilder, Validators } from "@angular/forms"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"
import { provideRouter } from "@angular/router"
import { LockOutline, MailOutline } from "@ant-design/icons-angular/icons"
import { NZ_ICONS } from "ng-zorro-antd/icon"
import { BehaviorSubject, of } from "rxjs"
import { expect, it, MockInstance, test, vi } from "vitest"
import { formSameAsValidator } from "../../../../core/form"
import { AuthSignUpUsecase } from "../../../../domains/auth"
import { SignUpFormComponent } from "./sign-up-form.component"

describe("SignUpFormComponent", () => {
  let component: SignUpFormComponent
  let fixture: ComponentFixture<SignUpFormComponent>

  let spySignUpUsecase: AuthSignUpUsecase
  let spySignUpFormComponent: MockInstance<SignUpFormComponent["handleAction"]>
  let mockErrorMessagesSubject: BehaviorSubject<any>
  let mockFormMetaSubjectSubject: BehaviorSubject<any>
  const mockAsyncValidatorFn = {
    validate: vi.fn().mockReturnValue(of(null)),
  }

  beforeEach(waitForAsync(() => {
    mockErrorMessagesSubject = new BehaviorSubject({
      form: null,
      field: null,
    })

    mockFormMetaSubjectSubject = new BehaviorSubject([
      {
        typeView: "text",
        name: "name",
        placeholder: "Name",
        icon: "user",
      },
      {
        typeView: "email",
        name: "email",
        placeholder: "Email",
        icon: "mail",
      },
      {
        typeView: "password",
        name: "password",
        placeholder: "Password",
        icon: "lock",
      },
      {
        typeView: "password",
        name: "passwordConfirm",
        placeholder: "Confirm password",
        icon: "lock",
      },
    ])

    const signUpUsecase = {
      form: new FormBuilder().group(
        {
          name: ["", [Validators.required]],
          email: [
            "",
            {
              validators: [Validators.required, Validators.email],
              asyncValidators: [
                mockAsyncValidatorFn.validate.bind(mockAsyncValidatorFn),
              ],
              // updateOn: "blur",
            },
          ],
          password: [
            "",
            [
              Validators.required,
              Validators.minLength(4),
              Validators.maxLength(50),
            ],
          ],
          passwordConfirm: [
            "",
            [
              Validators.required,
              Validators.minLength(4),
              Validators.maxLength(50),
            ],
          ],
        },
        {
          validators: [formSameAsValidator("passwordConfirm", "password")],
        },
      ),

      errorMessages$: mockErrorMessagesSubject.asObservable(),
      formMeta$: mockFormMetaSubjectSubject.asObservable(),

      state$: of({
        status: "useless",
      }),

      handle: vi.fn().mockImplementation((args: any) => args),

      toggleAbout: vi.fn().mockImplementation((args: any) => args),
    } as unknown as AuthSignUpUsecase

    TestBed.configureTestingModule({
      imports: [SignUpFormComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: NZ_ICONS, useValue: [MailOutline, LockOutline] },
        provideRouter([{ path: "**", component: SignUpFormComponent }]),
      ],
    }).overrideComponent(SignUpFormComponent, {
      set: {
        providers: [
          {
            provide: AuthSignUpUsecase,
            useValue: signUpUsecase,
          },
        ],
      },
    })
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()

    spySignUpFormComponent = vi.spyOn(component, "handleAction")

    spySignUpUsecase = fixture.debugElement.injector.get(AuthSignUpUsecase)
  })

  describe("Base", () => {
    test("create component", () => {
      expect(component).toBeDefined()
    })
  })

  describe("Visual identity", () => {
    it("'Sign Up' caption should be defined", () => {
      // arrange
      const content = "Sign Up".toLowerCase()

      // act
      const compiled = fixture.nativeElement
      const expectedContent = compiled.textContent.toLowerCase()

      // assert
      expect(expectedContent).toContain(content)
    })

    it("'Name' field should should be defined", () => {
      // arrange

      // act
      const compiled = fixture.nativeElement
      const element = compiled.querySelector("input[name='name']")

      // assert
      expect(element).toBeTruthy()
    })

    it("'Email' field should should be defined", () => {
      // arrange

      // act
      const compiled = fixture.nativeElement
      const element = compiled.querySelector("input[name='email']")

      // assert
      expect(element).toBeTruthy()
    })

    it("'Password' field should be defined", () => {
      // arrange

      // act
      const compiled = fixture.nativeElement
      const element = compiled.querySelector("input[name='password']")

      // assert
      expect(element).toBeTruthy()
    })

    it("'PasswordConfirm' field should be defined", () => {
      // arrange

      // act
      const compiled = fixture.nativeElement
      const element = compiled.querySelector("input[name='passwordConfirm']")

      // assert
      expect(element).toBeTruthy()
    })

    it("'Sign Up' button should be defined", () => {
      // arrange
      const content = "Sign Up".toLowerCase()

      // act
      const compiled = fixture.nativeElement
      const element = compiled.querySelector("button[type='submit']")
      const elementContent = element?.textContent?.toLowerCase()

      // assert
      expect(element).toBeTruthy()
      expect(elementContent).toContain(content)
    })

    it("'Sign In' link should be defined", () => {
      // arrange
      const content = "Sign In".toLowerCase()

      // act
      const compiled = fixture.nativeElement
      const element = compiled.querySelector("a[href='/sign-in']")
      const elementContent = element?.textContent?.toLowerCase()

      // assert
      expect(element).toBeTruthy()
      expect(elementContent).toContain(content)
    })
  })

  describe("Button behavior", () => {
    it("'Sign Up' button should disabled as default", async () => {
      // arrange

      // act
      const compiled = fixture.nativeElement
      const element = compiled.querySelector("button[type='submit']")
      const elementState = element?.disabled

      // assert
      expect(element).toBeTruthy()
      expect(elementState).toBeTruthy()
    })

    it("'Sign Up' button should disabled after invalid inputs", async () => {
      // arrange
      fixture.autoDetectChanges()

      const compiled = fixture.nativeElement
      const element = compiled.querySelector("button[type='submit']")
      const inputName = compiled.querySelector("input[name='name']")
      const inputEmail = compiled.querySelector("input[name='email']")
      const inputPassword = compiled.querySelector("input[name='password']")
      const inputPasswordConfirm = compiled.querySelector(
        "input[name='passwordConfirm']",
      )

      // act
      inputName.value = "n"
      inputEmail.value = "email"
      inputPassword.value = "1"
      inputPasswordConfirm.value = "2"

      inputName.dispatchEvent(new Event("input"))
      inputEmail.dispatchEvent(new Event("input"))
      inputPassword.dispatchEvent(new Event("input"))
      inputPasswordConfirm.dispatchEvent(new Event("input"))

      await fixture.whenStable()

      const elementState = element?.disabled

      // assert
      expect(element).toBeTruthy()
      expect(elementState).toBeTruthy()
    })

    it("'Sign Up' button should not disabled after valid inputs", async () => {
      // arrange
      fixture.autoDetectChanges()

      const compiled = fixture.nativeElement
      const element = compiled.querySelector("button[type='submit']")
      const inputName = compiled.querySelector("input[name='name']")
      const inputEmail = compiled.querySelector("input[name='email']")
      const inputPassword = compiled.querySelector("input[name='password']")
      const inputPasswordConfirm = compiled.querySelector(
        "input[name='passwordConfirm']",
      )

      // act
      inputName.value = "name"
      inputEmail.value = "email@email.com"
      inputPassword.value = "1234"
      inputPasswordConfirm.value = "1234"

      inputName.dispatchEvent(new Event("input"))
      inputEmail.dispatchEvent(new Event("input"))
      inputPassword.dispatchEvent(new Event("input"))
      inputPasswordConfirm.dispatchEvent(new Event("input"))

      await fixture.whenStable()

      const elementState = element?.disabled

      // assert
      expect(element).toBeTruthy()
      expect(elementState).toBeFalsy()
    })

    it("'Sign Up' button should trigger handle", async () => {
      // arrange
      fixture.autoDetectChanges()

      const compiled = fixture.nativeElement
      const button = compiled.querySelector('button[type="submit"]')
      const inputName = compiled.querySelector("input[name='name']")
      const inputEmail = compiled.querySelector("input[name='email']")
      const inputPassword = compiled.querySelector("input[name='password']")
      const inputPasswordConfirm = compiled.querySelector(
        "input[name='passwordConfirm']",
      )

      // act
      inputName.value = "name"
      inputEmail.value = "email@email.com"
      inputPassword.value = "1234"
      inputPasswordConfirm.value = "1234"

      inputName.dispatchEvent(new Event("input"))
      inputEmail.dispatchEvent(new Event("input"))
      inputPassword.dispatchEvent(new Event("input"))
      inputPasswordConfirm.dispatchEvent(new Event("input"))

      button.click()

      await fixture.whenStable()

      // assert
      expect(spySignUpFormComponent).toHaveBeenCalledTimes(1)
      expect(spySignUpUsecase.handle).toHaveBeenCalledTimes(1)
    })
  })

  describe("Field behavior", () => {
    it("'Name' field should contains error messages with invalid inputs", async () => {
      // arrange
      fixture.autoDetectChanges()

      const compiled = fixture.nativeElement
      const inputName = compiled.querySelector("input[name='name']")

      // act
      inputName.value = ""

      inputName.dispatchEvent(new Event("input"))

      mockErrorMessagesSubject.next({
        form: null,
        field: {
          name: "name is invalid",
        },
      })

      await fixture.whenStable()

      const content = compiled.textContent

      // assert
      expect(content).toContain("name is invalid")
    })

    it("'Name' field should not contains error messages", async () => {
      // arrange
      fixture.autoDetectChanges()

      const compiled = fixture.nativeElement
      const inputName = compiled.querySelector("input[name='name']")

      // act
      inputName.value = ""
      inputName.dispatchEvent(new Event("input"))

      mockErrorMessagesSubject.next({
        form: null,
        field: {
          name: "name is invalid",
        },
      })

      inputName.value = "name"
      inputName.dispatchEvent(new Event("input"))

      mockErrorMessagesSubject.next({
        form: null,
        field: null,
      })

      await fixture.whenStable()

      const content = compiled.textContent

      // assert
      expect(content).not.toContain("name is invalid")
    })

    it("'Email' field should contains error messages with invalid inputs", async () => {
      // arrange
      fixture.autoDetectChanges()

      const compiled = fixture.nativeElement
      const inputEmail = compiled.querySelector("input[name='email']")

      // act
      inputEmail.value = "email"

      inputEmail.dispatchEvent(new Event("input"))

      mockErrorMessagesSubject.next({
        form: null,
        field: {
          email: "email is invalid",
        },
      })

      await fixture.whenStable()

      const content = compiled.textContent

      // assert
      expect(content).toContain("email is invalid")
    })

    it("'Email' field should not contains error messages", async () => {
      // arrange
      fixture.autoDetectChanges()

      const compiled = fixture.nativeElement
      const inputEmail = compiled.querySelector("input[name='email']")

      // act
      inputEmail.value = "email"
      inputEmail.dispatchEvent(new Event("input"))

      mockErrorMessagesSubject.next({
        form: null,
        field: {
          email: "email is invalid",
        },
      })

      inputEmail.value = "email@gmail.com"
      inputEmail.dispatchEvent(new Event("input"))

      mockErrorMessagesSubject.next({
        form: null,
        field: null,
      })

      await fixture.whenStable()

      const content = compiled.textContent

      // assert
      expect(content).not.toContain("email is invalid")
    })

    it("'Password' field should contains error messages with invalid inputs", async () => {
      // arrange
      fixture.autoDetectChanges()

      const compiled = fixture.nativeElement
      const inputPassword = compiled.querySelector("input[name='password']")

      // act
      inputPassword.value = "1"

      inputPassword.dispatchEvent(new Event("input"))

      mockErrorMessagesSubject.next({
        form: null,
        field: {
          password: "password is invalid",
        },
      })

      await fixture.whenStable()

      const content = compiled.textContent

      // assert
      expect(content).toContain("password is invalid")
    })

    it("'Password' field should not contains error messages", async () => {
      // arrange
      fixture.autoDetectChanges()

      const compiled = fixture.nativeElement
      const inputPassword = compiled.querySelector("input[name='password']")

      // act
      inputPassword.value = "1"
      inputPassword.dispatchEvent(new Event("input"))
      mockErrorMessagesSubject.next({
        form: null,
        field: {
          password: "password is invalid",
        },
      })

      inputPassword.value = "1234"
      inputPassword.dispatchEvent(new Event("input"))
      mockErrorMessagesSubject.next({
        form: null,
        field: null,
      })

      await fixture.whenStable()

      const content = compiled.textContent

      // assert
      expect(content).not.toContain("password is invalid")
    })

    it("'PasswordConfirm' field should contains error messages with invalid inputs", async () => {
      // arrange
      fixture.autoDetectChanges()

      const compiled = fixture.nativeElement
      const inputPasswordConfirm = compiled.querySelector(
        "input[name='passwordConfirm']",
      )

      // act
      inputPasswordConfirm.value = "1"

      inputPasswordConfirm.dispatchEvent(new Event("input"))

      mockErrorMessagesSubject.next({
        form: null,
        field: {
          passwordConfirm: "passwordConfirm is invalid",
        },
      })

      await fixture.whenStable()

      const content = compiled.textContent

      // assert
      expect(content).toContain("passwordConfirm is invalid")
    })

    it("'PasswordConfirm' field should not contains error messages", async () => {
      // arrange
      fixture.autoDetectChanges()

      const compiled = fixture.nativeElement
      const inputPasswordConfirm = compiled.querySelector(
        "input[name='passwordConfirm']",
      )

      // act
      inputPasswordConfirm.value = "1"
      inputPasswordConfirm.dispatchEvent(new Event("input"))
      mockErrorMessagesSubject.next({
        form: null,
        field: {
          passwordConfirm: "passwordConfirm is invalid",
        },
      })

      inputPasswordConfirm.value = "1234"
      inputPasswordConfirm.dispatchEvent(new Event("input"))
      mockErrorMessagesSubject.next({
        form: null,
        field: null,
      })

      await fixture.whenStable()

      const content = compiled.textContent

      // assert
      expect(content).not.toContain("passwordConfirm is invalid")
    })
  })
})
