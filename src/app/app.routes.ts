import { Routes } from '@angular/router';
import isLoggedGuardFn from '@app/guard/auth.guard.fn';
import LoginComponent from '@modules/pages/login/login.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'register',
    loadComponent: () => import('@modules/pages/register/register.component'),
  },
  {
    path: 'home',
    loadComponent: () => import('@modules/pages/main/main.component'),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'entry/:id',
    loadComponent: () => import('@modules/pages/detail/detail.component'),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'entry/:id/public',
    loadComponent: () =>
      import('@modules/pages/public-detail/public-detail.component'),
  },
  {
    path: 'add',
    loadComponent: () => import('@modules/pages/add/add.component'),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'entry/:id/edit',
    loadComponent: () => import('@modules/pages/edit/edit.component'),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'tags',
    loadComponent: () => import('@modules/pages/tags/tags.component'),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'tag/:id',
    loadComponent: () => import('@modules/pages/tag-list/tag-list.component'),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: 'crypt',
    loadComponent: () => import('@modules/pages/crypt/crypt.component'),
    canActivate: [isLoggedGuardFn],
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];
export default routes;
