import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent }       from './pages/login/login.component';
import { RegisterComponent }    from './pages/register/register.component';
import { MainComponent }        from './pages/main/main.component';
import { AuthGuard }            from './guard/auth.guard';

const routes: Routes = [
    { path: '',         component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'main',     component: MainComponent, canActivate: [AuthGuard] },
	{ path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
