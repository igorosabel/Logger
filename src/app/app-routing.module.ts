import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/guard/auth.guard";
import { LoginComponent } from "src/app/modules/login/login.component";

const routes: Routes = [
  { path: "", component: LoginComponent },
  {
    path: "register",
    loadComponent: () => import("src/app/modules/register/register.component"),
  },
  {
    path: ":username",
    loadComponent: () => import("src/app/modules/main/main.component"),
    canActivate: [AuthGuard],
  },
  {
    path: ":username/:id/:slug",
    loadComponent: () => import("src/app/modules/detail/detail.component"),
    canActivate: [AuthGuard],
  },
  {
    path: ":username/public/:id/:slug",
    loadComponent: () =>
      import("src/app/modules/public-detail/public-detail.component"),
  },
  {
    path: ":username/add",
    loadComponent: () => import("src/app/modules/add/add.component"),
    canActivate: [AuthGuard],
  },
  {
    path: ":username/:id/:slug/edit",
    loadComponent: () => import("src/app/modules/edit/edit.component"),
    canActivate: [AuthGuard],
  },
  {
    path: ":username/tags",
    loadComponent: () => import("src/app/modules/tags/tags.component"),
    canActivate: [AuthGuard],
  },
  {
    path: ":username/tag/:id/:slug",
    loadComponent: () => import("src/app/modules/tag-list/tag-list.component"),
    canActivate: [AuthGuard],
  },
  { path: "**", redirectTo: "/", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
