import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing"
import { FormBuilder, Validators } from "@angular/forms"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"
import { provideRouter } from "@angular/router"
import { LockOutline, MailOutline } from "@ant-design/icons-angular/icons"
import { NZ_ICONS } from "ng-zorro-antd/icon"
import { BehaviorSubject, of } from "rxjs"
import { expect, it, MockInstance, test, vi } from "vitest"
import { AuthSignInUsecase } from "../../../../domains/auth"
import { SignInFormComponent } from "./sign-in-form.component"

describe("SignInFormComponent", () => {
  let component: SignInFormComponent
  let fixture: ComponentFixture<SignInFormComponent>

  let spySignInUsecase: AuthSignInUsecase
  let spySignInFormComponent: MockInstance<SignInFormComponent["handleAction"]>
  let mockErrorMessagesSubject: BehaviorSubject<any>

  beforeEach(waitForAsync(() => {
    mockErrorMessagesSubject = new BehaviorSubject({
      form: null,
      field: null,
    })

    const signInUsecase = {
      form: new FormBuilder().group({
        email: ["", [Validators.required, Validators.email]],
        password: [
          "",
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(50),
          ],
        ],
      }),

      errorMessages$: mockErrorMessagesSubject.asObservable(),

      state$: of({
        status: "useless",
      }),

      handle: vi.fn().mockImplementation((args: any) => args),
    } as unknown as AuthSignInUsecase

    TestBed.configureTestingModule({
      imports: [SignInFormComponent, NoopAnimationsModule],
      providers: [
        { provide: NZ_ICONS, useValue: [MailOutline, LockOutline] },
        provideRouter([{ path: "**", component: SignInFormComponent }]),
      ],
    }).overrideComponent(SignInFormComponent, {
      set: {
        providers: [
          {
            provide: AuthSignInUsecase,
            useValue: signInUsecase,
          },
        ],
      },
    })
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()

    spySignInFormComponent = vi.spyOn(component, "handleAction")

    spySignInUsecase = fixture.debugElement.injector.get(AuthSignInUsecase)
  })

  describe("Base", () => {
    test("create component", () => {
      expect(component).toBeDefined()
    })
  })

  describe("Visual identity", () => {
    it("'Sign In' caption should be defined", () => {
      // arrange
      const content = "Sign In".toLowerCase()

      // act
      const compiled = fixture.nativeElement
      const expectedContent = compiled.textContent.toLowerCase()

      // assert
      expect(expectedContent).toContain(content)
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

    it("'Sign In' button should be defined", () => {
      // arrange
      const content = "Sign In".toLowerCase()

      // act
      const compiled = fixture.nativeElement
      const element = compiled.querySelector("button[type='submit']")
      const elementContent = element?.textContent?.toLowerCase()

      // assert
      expect(element).toBeTruthy()
      expect(elementContent).toContain(content)
    })

    it("'Sign Up' link should be defined", () => {
      // arrange
      const content = "Sign Up".toLowerCase()

      // act
      const compiled = fixture.nativeElement
      const element = compiled.querySelector("a[href='/sign-up']")
      const elementContent = element?.textContent?.toLowerCase()

      // assert
      expect(element).toBeTruthy()
      expect(elementContent).toContain(content)
    })
  })

  describe("Button behavior", () => {
    it("'Sign In' button should disabled as default", async () => {
      // arrange

      // act
      const compiled = fixture.nativeElement
      const element = compiled.querySelector("button[type='submit']")
      const elementState = element?.disabled

      // assert
      expect(element).toBeTruthy()
      expect(elementState).toBeTruthy()
    })

    it("'Sign In' button should disabled after invalid inputs", async () => {
      // arrange
      fixture.autoDetectChanges()

      const compiled = fixture.nativeElement
      const element = compiled.querySelector("button[type='submit']")
      const inputEmail = compiled.querySelector("input[name='email']")
      const inputPassword = compiled.querySelector("input[name='password']")

      // act
      inputEmail.value = "email"
      inputPassword.value = "1"

      inputEmail.dispatchEvent(new Event("input"))
      inputPassword.dispatchEvent(new Event("input"))

      await fixture.whenStable()

      const elementState = element?.disabled

      // assert
      expect(element).toBeTruthy()
      expect(elementState).toBeTruthy()
    })

    it("'Sign In' button should not disabled after valid inputs", async () => {
      // arrange
      fixture.autoDetectChanges()

      const compiled = fixture.nativeElement
      const element = compiled.querySelector("button[type='submit']")
      const inputEmail = compiled.querySelector("input[name='email']")
      const inputPassword = compiled.querySelector("input[name='password']")

      // act
      inputEmail.value = "email@gmail.com"
      inputPassword.value = "1234"

      inputEmail.dispatchEvent(new Event("input"))
      inputPassword.dispatchEvent(new Event("input"))

      await fixture.whenStable()

      const elementState = element?.disabled

      // assert
      expect(element).toBeTruthy()
      expect(elementState).toBeFalsy()
    })

    it("'Sign In' button should trigger handle", async () => {
      // arrange
      fixture.autoDetectChanges()

      const compiled = fixture.nativeElement
      const inputEmail = compiled.querySelector("input[name='email']")
      const inputPassword = compiled.querySelector("input[name='password']")
      const button = compiled.querySelector('button[type="submit"]')

      // act
      inputEmail.value = "email@gmail.com"
      inputPassword.value = "1234"

      inputEmail.dispatchEvent(new Event("input"))
      inputPassword.dispatchEvent(new Event("input"))

      button.click()

      await fixture.whenStable()

      // assert
      expect(spySignInFormComponent).toHaveBeenCalledTimes(1)
      expect(spySignInUsecase.handle).toHaveBeenCalledTimes(1)
    })
  })

  describe("Field behavior", () => {
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
  })
})
