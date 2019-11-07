/*
 * Páginas
 */
import { LoginComponent }    from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { MainComponent }     from './pages/main/main.component';
import { DetailComponent }   from './pages/detail/detail.component';
import { AddComponent }      from './pages/add/add.component';
import { EditComponent }     from './pages/edit/edit.component';
import { TagsComponent }     from './pages/tags/tags.component';
import { TagListComponent }  from './pages/tag-list/tag-list.component';

export const PAGES: any[] = [
	LoginComponent,
	RegisterComponent,
	MainComponent,
	DetailComponent,
	AddComponent,
	EditComponent,
	TagsComponent,
	TagListComponent
];

/*
 * Componentes
 */
import { ConfirmDialogComponent } from './components/dialogs/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent }   from './components/dialogs/alert-dialog/alert-dialog.component';
import { FormDialogComponent }    from './components/dialogs/form-dialog/form-dialog.component';
import { OneEntryComponent }      from './components/one-entry/one-entry.component';
import { EntryTagListComponent }  from './components/entry-tag-list/entry-tag-list.component';

export const COMPONENTS: any[] = [
	ConfirmDialogComponent,
	AlertDialogComponent,
	FormDialogComponent,
	OneEntryComponent,
	EntryTagListComponent
];

/*
 * Pipes
 */
import { UrldecodePipe }    from './pipes/urldecode.pipe';
import { ShortTextPipe }    from './pipes/shorttext.pipe';

export const PIPES: any[] = [
	UrldecodePipe,
	ShortTextPipe
];

/*
 * Servicios
 */
import { CommonService }      from './services/common.service';
import { ApiService }         from './services/api.service';
import { DataShareService }   from './services/data-share.service';
import { DialogService }      from './services/dialog.service';
import { UserService }        from './services/user.service';
import { AuthService }        from './services/auth.service';
import { ClassMapperService } from './services/class-mapper.service';

export const SERVICES: any[] = [
	CommonService,
	ApiService,
	DataShareService,
	DialogService,
	UserService,
	AuthService,
	ClassMapperService
];

/*
 * Componentes Angular Material
 */
import { MatToolbarModule }   from '@angular/material/toolbar';
import { MatCardModule }      from '@angular/material/card';
import { MatButtonModule }    from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatIconModule }      from '@angular/material/icon';
import { MatListModule }      from '@angular/material/list';
import { MatDialogModule }    from '@angular/material/dialog';
import { MatRadioModule }     from '@angular/material/radio';
import { MatSidenavModule }   from '@angular/material/sidenav';

export const MATERIAL: any[] = [
	MatToolbarModule,
	MatCardModule,
	MatButtonModule,
	MatFormFieldModule,
	MatInputModule,
	MatIconModule,
	MatListModule,
	MatDialogModule,
	MatRadioModule,
	MatSidenavModule
];