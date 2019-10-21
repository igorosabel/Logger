import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard }            from './guard/auth.guard';
import { LoginComponent }       from './pages/login/login.component';
import { RegisterComponent }    from './pages/register/register.component';
import { MainComponent }        from './pages/main/main.component';
import { DetailComponent }      from './pages/detail/detail.component';
import { AddComponent }         from './pages/add/add.component';
import { EditComponent }        from './pages/edit/edit.component';
import { TagsComponent }        from './pages/tags/tags.component';
import { TagListComponent }     from './pages/tag-list/tag-list.component';


const routes: Routes = [
    { path: '',                         component: LoginComponent },
	{ path: 'register',                 component: RegisterComponent },
	{ path: ':username',                component: MainComponent,    canActivate: [AuthGuard] },
	{ path: ':username/:id/:slug',      component: DetailComponent,  canActivate: [AuthGuard] },
	{ path: ':username/add',            component: AddComponent,     canActivate: [AuthGuard] },
	{ path: ':username/:id/:slug/edit', component: EditComponent,    canActivate: [AuthGuard] },
	{ path: ':username/tags',           component: TagsComponent,    canActivate: [AuthGuard] },
	{ path: ':username/tag/:id/:slug',  component: TagListComponent, canActivate: [AuthGuard] },
	{ path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
