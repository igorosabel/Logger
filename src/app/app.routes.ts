import { Routes } from "@angular/router";
import { isLoggedGuardFn } from "src/app/guard/auth.guard.fn";
import { LoginComponent } from "src/app/modules/pages/login/login.component";

export const routes: Routes = [
  { path: "", component: LoginComponent },
  {
    path: "register",
    loadComponent: () =>
      import("src/app/modules/pages/register/register.component"),
  },
  {
    path: "home",
    loadComponent: () => import("src/app/modules/pages/main/main.component"),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: "entry/:id",
    loadComponent: () =>
      import("src/app/modules/pages/detail/detail.component"),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: "entry/:id/public",
    loadComponent: () =>
      import("src/app/modules/pages/public-detail/public-detail.component"),
  },
  {
    path: "add",
    loadComponent: () => import("src/app/modules/pages/add/add.component"),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: "entry/:id/edit",
    loadComponent: () => import("src/app/modules/pages/edit/edit.component"),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: "tags",
    loadComponent: () => import("src/app/modules/pages/tags/tags.component"),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: "tag/:id",
    loadComponent: () =>
      import("src/app/modules/pages/tag-list/tag-list.component"),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: "crypt",
    loadComponent: () => import("src/app/modules/pages/crypt/crypt.component"),
    canActivate: [isLoggedGuardFn],
  },
  { path: "**", redirectTo: "/", pathMatch: "full" },
];
