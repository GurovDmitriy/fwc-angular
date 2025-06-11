import { inject, Injectable } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import {
  createActionGroup,
  createFeature,
  createReducer,
  emptyProps,
  on,
  props,
} from "@ngrx/store"
import {
  catchError,
  concat,
  concatMap,
  EMPTY,
  exhaustMap,
  from,
  last,
  map,
  Observable,
  of,
} from "rxjs"
import { ErrorMapped, TOKEN_ERROR_SERVICE } from "../../core/error"
import { StatusName } from "../../core/status"
import { AuthApiService, AuthStorageService } from "./internal"
import {
  AuthMeUpdatePayload,
  AuthSignInPayload,
  AuthSignToken,
  AuthSignUpPayload,
  AuthUser,
} from "./types"

const payloadProps = <TPayload>() => props<{ payload: TPayload }>()
const errorProps = <TError = ErrorMapped>() => props<{ error: TError }>()

const AUTH_FILTER_NAME = {
  signUp: "[Auth] signUp",
  signIn: "[Auth] signIn",
  signOut: "[Auth] signOut",
  signMe: "[Auth] me",
  signTokenRefresh: "[Auth] tokenRefresh",
}

const AuthBaseActions = createActionGroup({
  source: "Auth",
  events: {
    signUp: payloadProps<AuthSignUpPayload>(),
    signUpSuccess: payloadProps<AuthUser>(),
    signUpFailure: errorProps(),

    signIn: payloadProps<AuthSignInPayload>(),
    signInSuccess: payloadProps<AuthUser>(),
    signInFailure: errorProps(),

    signOut: emptyProps(),
    signOutSuccess: emptyProps(),
    signOutFailure: errorProps(),

    me: emptyProps(),
    meSuccess: payloadProps<AuthUser>(),
    meFailure: errorProps(),

    meUpdate: payloadProps<AuthMeUpdatePayload>(),
    meUpdateSuccess: payloadProps<AuthUser>(),
    meUpdateFailure: errorProps(),

    tokenRefresh: emptyProps(),
    tokenRefreshSuccess: payloadProps<AuthSignToken>(),
    tokenRefreshFailure: errorProps(),
  },
})

interface AuthBaseState {
  status: StatusName
  statusIs: {
    useless: boolean
    pending: boolean
    success: boolean
    failure: boolean
  }
  statusDetail:
    | (typeof AuthBaseActions)[keyof typeof AuthBaseActions]["type"]
    | "useless"
  isAuth: boolean
  user: AuthUser | null
  error: ErrorMapped | null
}

const initialState: AuthBaseState = {
  status: "useless",
  statusIs: {
    useless: true,
    pending: false,
    success: false,
    failure: false,
  },
  statusDetail: "useless",
  isAuth: false,
  user: null,
  error: null,
}

const AuthBaseFeature = createFeature({
  name: "auth",
  reducer: createReducer(
    initialState,

    on(
      AuthBaseActions.signUp,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("pending", action),
          error: null,
        }) satisfies AuthBaseState,
    ),

    on(
      AuthBaseActions.signUpSuccess,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("success", action),
          user: action.payload,
          isAuth: true,
          error: null,
        }) satisfies AuthBaseState,
    ),

    on(
      AuthBaseActions.signUpFailure,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("failure", action),
          isAuth: false,
          user: null,
          error: action.error,
        }) satisfies AuthBaseState,
    ),

    on(
      AuthBaseActions.signIn,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("pending", action),
          error: null,
          statusDetail: AuthBaseActions.signIn.type,
        }) satisfies AuthBaseState,
    ),

    on(
      AuthBaseActions.signInSuccess,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("success", action),
          user: action.payload,
          isAuth: true,
          error: null,
        }) satisfies AuthBaseState,
    ),

    on(
      AuthBaseActions.signInFailure,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("failure", action),
          isAuth: false,
          user: null,
          error: action.error,
        }) satisfies AuthBaseState,
    ),

    on(
      AuthBaseActions.signOut,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("pending", action),
          error: null,
        }) satisfies AuthBaseState,
    ),

    on(
      AuthBaseActions.signOutSuccess,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("success", action),
          user: null,
          isAuth: false,
          error: null,
        }) satisfies AuthBaseState,
    ),

    on(
      AuthBaseActions.signOutFailure,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("failure", action),
          isAuth: false,
          user: null,
          error: action.error,
        }) satisfies AuthBaseState,
    ),

    on(
      AuthBaseActions.me,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("pending", action),
          error: null,
        }) satisfies AuthBaseState,
    ),

    on(
      AuthBaseActions.meSuccess,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("success", action),
          user: action.payload,
          isAuth: true,
          error: null,
        }) satisfies AuthBaseState,
    ),

    on(
      AuthBaseActions.meFailure,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("failure", action),
          isAuth: false,
          user: null,
          error: action.error,
        }) satisfies AuthBaseState,
    ),

    on(
      AuthBaseActions.meUpdate,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("pending", action),
          error: null,
        }) satisfies AuthBaseState,
    ),

    on(
      AuthBaseActions.meUpdateSuccess,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("success", action),
          user: action.payload,
          isAuth: true,
          error: null,
        }) satisfies AuthBaseState,
    ),

    on(
      AuthBaseActions.meUpdateFailure,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("failure", action),
          isAuth: false,
          user: null,
          error: action.error,
        }) satisfies AuthBaseState,
    ),

    on(
      AuthBaseActions.tokenRefresh,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("pending", action),
          error: null,
        }) satisfies AuthBaseState,
    ),

    on(
      AuthBaseActions.tokenRefreshSuccess,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("success", action),
          isAuth: true,
          error: null,
        }) satisfies AuthBaseState,
    ),

    on(
      AuthBaseActions.tokenRefreshFailure,
      (state, action) =>
        ({
          ...state,
          ...statusHelper("failure", action),
          isAuth: false,
          user: null,
          error: action.error,
        }) satisfies AuthBaseState,
    ),
  ),
})

@Injectable({
  providedIn: "root",
})
class AuthBaseEffects {
  private errorService = inject(TOKEN_ERROR_SERVICE)
  private api = inject(AuthApiService)
  private storage = inject(AuthStorageService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  private actions$ = inject(Actions)

  signUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthBaseActions.signUp),
      exhaustMap((action) => {
        return this.api
          .signUp({
            ...action.payload,
          } as AuthSignUpPayload)
          .pipe(
            concatMap((response) => this.handleSaveToken(response)),
            concatMap(() => this.api.me()),
            map((user) => AuthBaseActions.signUpSuccess({ payload: user })),
            catchError((error) => {
              return of(
                AuthBaseActions.signUpFailure({
                  error: this.errorService.handle(error),
                }),
              )
            }),
          )
      }),
    ),
  )

  signIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthBaseActions.signIn),
      exhaustMap((action) => {
        return this.api
          .signIn({
            ...action.payload,
          } as AuthSignInPayload)
          .pipe(
            concatMap((response) => this.handleSaveToken(response)),
            concatMap(() => this.api.me()),
            map((user) => AuthBaseActions.signInSuccess({ payload: user })),
            catchError((error) => {
              return of(
                AuthBaseActions.signInFailure({
                  error: this.errorService.handle(error),
                }),
              )
            }),
          )
      }),
    ),
  )

  signOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthBaseActions.signOut),
      exhaustMap(() => {
        return this.api.signOut().pipe(
          concatMap(() => this.handleRemoveToken()),
          map(() => AuthBaseActions.signOutSuccess()),
          catchError((error) => {
            return of(
              AuthBaseActions.signOutFailure({
                error: this.errorService.handle(error),
              }),
            )
          }),
        )
      }),
    ),
  )

  me$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthBaseActions.me),
      exhaustMap(() => {
        return this.api.me().pipe(
          map((user) => AuthBaseActions.meSuccess({ payload: user })),
          catchError((error) => {
            return of(
              AuthBaseActions.meFailure({
                error: this.errorService.handle(error),
              }),
            )
          }),
        )
      }),
    ),
  )

  meUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthBaseActions.meUpdate),
      exhaustMap((action) => {
        return this.api
          .meUpdate({
            ...(action.payload as AuthMeUpdatePayload),
          })
          .pipe(
            concatMap(() => this.api.me()),
            map((user) => AuthBaseActions.meUpdateSuccess({ payload: user })),
            catchError((error) => {
              return of(
                AuthBaseActions.meUpdateFailure({
                  error: this.errorService.handle(error),
                }),
              )
            }),
          )
      }),
    ),
  )

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthBaseActions.tokenRefresh),
      exhaustMap(() => {
        return this.storage.getItem("tokenRefresh").pipe(
          concatMap((tokenRefresh) => this.api.tokenRefresh(tokenRefresh)),
          concatMap((response) => this.handleSaveToken(response)),
          map((token) =>
            AuthBaseActions.tokenRefreshSuccess({
              payload: token,
            }),
          ),
          catchError((error) => {
            return of(
              AuthBaseActions.tokenRefreshFailure({
                error: this.errorService.handle(error),
              }),
            )
          }),
        )
      }),
    ),
  )

  navigateAfterSignUp$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthBaseActions.signUpSuccess),
        concatMap(() => {
          const redirectUrl =
            this.route.snapshot.queryParams["redirectUrl"] || "/"
          return from(this.router.navigate([redirectUrl]))
        }),
        catchError(() => {
          return EMPTY
        }),
      ),
    { dispatch: false },
  )

  navigateAfterSignIn$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthBaseActions.signInSuccess),
        concatMap(() => {
          const redirectUrl =
            this.route.snapshot.queryParams["redirectUrl"] || "/"
          return from(this.router.navigate([redirectUrl]))
        }),
        catchError(() => {
          return EMPTY
        }),
      ),
    { dispatch: false },
  )

  navigateAfterSignOut$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthBaseActions.signOutSuccess),
        concatMap(() => from(this.router.navigate(["/sign-in"]))),
        catchError(() => {
          return EMPTY
        }),
      ),
    { dispatch: false },
  )

  constructor() {}

  private handleSaveToken(response: AuthSignToken): Observable<AuthSignToken> {
    return concat(
      this.storage.setItem("tokenAccess", response.tokenAccess),
      this.storage.setItem("tokenRefresh", response.tokenRefresh),
    ).pipe(
      last(),
      map(() => response),
    )
  }

  private handleRemoveToken(): Observable<void> {
    return concat(
      this.storage.removeItem("tokenAccess"),
      this.storage.removeItem("tokenRefresh"),
    ).pipe(last())
  }
}

function statusHelper(name: StatusName, action: { type: any }) {
  const init = {
    useless: false,
    pending: false,
    success: false,
    failure: false,
  }

  return {
    statusIs: {
      ...init,
      [name]: true,
    },
    status: name,
    statusDetail: action.type,
  }
}

export {
  AUTH_FILTER_NAME,
  AuthBaseActions,
  AuthBaseEffects,
  AuthBaseFeature,
  type AuthBaseState,
}
