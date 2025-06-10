import { Routes } from "@angular/router"
import { authMainGuard } from "../domains/auth"
import { LayoutAuthComponent } from "./layouts/layout-auth"
import { LayoutHomeComponent } from "./layouts/layout-home"
import { PageHomeComponent } from "./pages/page-home"
import { PageNotFoundComponent } from "./pages/page-not-found"

export const routes: Routes = [
  {
    path: "",
    component: LayoutHomeComponent,
    canActivate: [authMainGuard],
    children: [
      {
        path: "",
        component: PageHomeComponent,
      },
      {
        path: "cart",
        loadComponent: () =>
          import("./pages/page-cart").then((c) => c.PageCartComponent),
      },
      {
        path: "account",
        loadComponent: () =>
          import("./pages/page-account").then((c) => c.PageAccountComponent),
      },
    ],
  },

  {
    path: "",
    component: LayoutAuthComponent,
    children: [
      {
        path: "sign-up",
        loadComponent: () =>
          import("./pages/page-sign-up").then((c) => c.PageSignUpComponent),
      },
    ],
  },

  {
    path: "",
    component: LayoutAuthComponent,
    children: [
      {
        path: "sign-in",
        loadComponent: () =>
          import("./pages/page-sign-in").then((c) => c.PageSignInComponent),
      },
    ],
  },

  {
    path: "**",
    component: PageNotFoundComponent,
  },
]
