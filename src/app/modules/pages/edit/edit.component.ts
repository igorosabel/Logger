import {
  Component,
  OnInit,
  Signal,
  WritableSignal,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import {
  EntryInterface,
  EntryResult,
  StatusResult,
} from '@interfaces/interfaces';
import Entry from '@model/entry.model';
import { DialogService } from '@osumi/angular-tools';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import CryptoService from '@services/crypto.service';
import EditorComponent from '@shared/components/editor/editor.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  imports: [
    RouterModule,
    EditorComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [DialogService],
})
export default class EditComponent implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private as: ApiService = inject(ApiService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private dialog: DialogService = inject(DialogService);
  private crypto: CryptoService = inject(CryptoService);
  private router: Router = inject(Router);

  loading: WritableSignal<boolean> = signal<boolean>(false);
  username: string = '';
  idEntry: number = -1;
  entry: Entry = new Entry(null, 'Nueva entrada');
  editor: Signal<EditorComponent> =
    viewChild.required<EditorComponent>('editor');

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.username = params['username'];
      this.idEntry = params['id'];
      this.loadEntry();
    });
  }

  async loadEntry(): Promise<void> {
    try {
      const response: EntryResult = await firstValueFrom(
        this.as.getEntry(this.idEntry)
      );

      if (response.status === 'ok') {
        const encryptedEntry: EntryInterface = response.entry;
        const decryptedEntry: EntryInterface = await this.crypto.decryptEntry(
          encryptedEntry
        );
        this.entry = this.cms.getEntry(decryptedEntry);
        this.editor().loadEntry(this.entry);
      }
    } catch (error) {
      this.dialog.alert({
        title: 'Error',
        content:
          'Ocurrió un error al cargar la entrada. Inténtalo de nuevo más tarde por favor.',
      });
    }
  }

  editorLoaded(ev: boolean): void {
    this.loading.set(ev);
  }

  async saveEntry(): Promise<boolean> {
    this.entry = this.editor().getEntry();
    console.log(this.entry);
    if (this.entry.title == '') {
      this.dialog
        .alert({
          title: 'Error',
          content: '¡No puedes dejar el título de la entrada en blanco!',
        })
        .subscribe((): void => {
          this.editor().focusTitle();
        });
      return false;
    }

    const encryptedEntry: EntryInterface = await this.crypto.encryptEntry(
      this.entry.toInterface()
    );
    this.loading.set(true);

    this.as
      .saveEntry(encryptedEntry)
      .subscribe((result: StatusResult): void => {
        if (result.status == 'ok') {
          this.loading.set(false);
          this.dialog
            .alert({
              title: 'OK',
              content: `La entrada "${this.entry.title}" ha sido guardada.`,
            })
            .subscribe((): void => {
              this.router.navigate(['/home']);
            });
        } else {
          this.dialog.alert({
            title: 'Error',
            content:
              'Ocurrió un error al guardar la entrada. Inténtalo de nuevo más tarde por favor.',
          });
        }
      });
    return false;
  }

  deleteEntry(): void {
    this.dialog
      .confirm({
        title: 'Confirmar',
        content:
          '¿Estás seguro de querer borrar esta entrada? Esta acción es irreversible',
        warn: true,
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.loading.set(true);
          this.as
            .deleteEntry(this.idEntry)
            .subscribe((result: StatusResult): void => {
              this.loading.set(false);
              if (result.status === 'ok') {
                this.dialog
                  .alert({
                    title: 'Entrada borrada',
                    content: 'La entrada ha sido borrada correctamente.',
                  })
                  .subscribe((): void => {
                    this.router.navigate(['/home']);
                  });
              } else {
                this.dialog.alert({
                  title: 'Error',
                  content:
                    'Ocurrió un error al borrar la entrada. Inténtalo de nuevo más tarde por favor.',
                });
              }
            });
        }
      });
  }
}
