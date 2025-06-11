import { Routes } from "@angular/router"
import { authMainGuard } from "../domains/auth"
import { LayoutAuthComponent } from "./layouts/layout-auth"
import { LayoutHomeComponent } from "./layouts/layout-home"
import { PageHomeComponent } from "./pages/page-home"
import { PageNotFoundComponent } from "./pages/page-not-found"
import { PageSignInComponent } from "./pages/page-sign-in"
import { PageSignUpComponent } from "./pages/page-sign-up"

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
      {
        path: "category/:categoryId",
        loadComponent: () =>
          import("./pages/page-category").then((c) => c.PageCategoryComponent),
      },
      {
        path: "product/:productId",
        loadComponent: () =>
          import("./pages/page-product").then((c) => c.PageProductComponent),
      },
    ],
  },

  {
    path: "",
    component: LayoutAuthComponent,
    children: [
      {
        path: "sign-up",
        component: PageSignUpComponent,
      },
    ],
  },

  {
    path: "",
    component: LayoutAuthComponent,
    children: [
      {
        path: "sign-in",
        component: PageSignInComponent,
      },
    ],
  },

  {
    path: "**",
    component: PageNotFoundComponent,
  },
]
