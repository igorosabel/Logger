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
import { EntryInterface, StatusResult } from '@interfaces/interfaces';
import Entry from '@model/entry.model';
import ApiService from '@services/api.service';
import CryptoService from '@services/crypto.service';
import DialogService from '@services/dialog.service';
import EditorComponent from '@shared/components/editor/editor.component';

@Component({
  standalone: true,
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  imports: [
    RouterModule,
    EditorComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [DialogService],
})
export default class AddComponent implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private as: ApiService = inject(ApiService);
  private dialog: DialogService = inject(DialogService);
  private router: Router = inject(Router);
  private crypto: CryptoService = inject(CryptoService);

  loading: WritableSignal<boolean> = signal<boolean>(false);
  username: string = '';
  entry: Entry = new Entry(null, 'Nueva entrada');
  editor: Signal<EditorComponent> =
    viewChild.required<EditorComponent>('editor');

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.username = params['username'];
      this.editor().loadEntry(this.entry);
    });
  }

  editorLoaded(ev: boolean): void {
    this.loading.set(ev);
  }

  async saveEntry(): Promise<void> {
    this.entry = this.editor().getEntry();

    if (this.entry.title == '') {
      this.dialog
        .alert({
          title: 'Error',
          content: '¡No puedes dejar el título de la entrada en blanco!',
          ok: 'Continuar',
        })
        .subscribe((): void => {
          this.editor().focusTitle();
        });
      return;
    }

    const encryptedEntry: EntryInterface = await this.crypto.encryptEntry(
      this.entry.toInterface()
    );
    this.loading.set(true);

    this.as
      .saveEntry(encryptedEntry)
      .subscribe((result: StatusResult): void => {
        this.loading.set(false);
        if (result.status == 'ok') {
          this.dialog
            .alert({
              title: 'OK',
              content: `La nueva entrada "${this.entry.title}" ha sido guardada.`,
              ok: 'Continuar',
            })
            .subscribe((): void => {
              this.router.navigate(['/home']);
            });
        } else {
          this.dialog.alert({
            title: 'Error',
            content:
              'Ocurrió un error al guardar la entrada. Inténtalo de nuevo más tarde por favor.',
            ok: 'Continuar',
          });
        }
      });
  }
}
