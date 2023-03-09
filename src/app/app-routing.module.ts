import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/guard/auth.guard";
import { LoginComponent } from "src/app/modules/pages/login/login.component";

const routes: Routes = [
  { path: "", component: LoginComponent },
  {
    path: "register",
    loadComponent: () =>
      import("src/app/modules/pages/register/register.component"),
  },
  {
    path: "home",
    loadComponent: () => import("src/app/modules/pages/main/main.component"),
    canActivate: [AuthGuard],
  },
  {
    path: "entry/:id",
    loadComponent: () =>
      import("src/app/modules/pages/detail/detail.component"),
    canActivate: [AuthGuard],
  },
  {
    path: "entry/:id/public",
    loadComponent: () =>
      import("src/app/modules/pages/public-detail/public-detail.component"),
  },
  {
    path: "add",
    loadComponent: () => import("src/app/modules/pages/add/add.component"),
    canActivate: [AuthGuard],
  },
  {
    path: "entry/:id/edit",
    loadComponent: () => import("src/app/modules/pages/edit/edit.component"),
    canActivate: [AuthGuard],
  },
  {
    path: "tags",
    loadComponent: () => import("src/app/modules/pages/tags/tags.component"),
    canActivate: [AuthGuard],
  },
  {
    path: "tag/:id",
    loadComponent: () =>
      import("src/app/modules/pages/tag-list/tag-list.component"),
    canActivate: [AuthGuard],
  },
  {
    path: "crypt",
    loadComponent: () => import("src/app/modules/pages/crypt/crypt.component"),
    canActivate: [AuthGuard],
  },
  { path: "**", redirectTo: "/", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
