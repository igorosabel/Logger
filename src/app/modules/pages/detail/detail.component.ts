import {
  Component,
  ComponentRef,
  ElementRef,
  OnInit,
  ViewContainerRef,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { EntryInterface, EntryResult } from '@interfaces/interfaces';
import Entry from '@model/entry.model';
import Photo from '@model/photo.model';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import CryptoService from '@services/crypto.service';
import DataShareService from '@services/data-share.service';
import DialogService from '@services/dialog.service';
import EntryTagListComponent from '@shared/components/entry-tag-list/entry-tag-list.component';
import ImgCryptComponent from '@shared/components/img-crypt/img-crypt.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  imports: [
    RouterModule,
    EntryTagListComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [DialogService],
})
export default class DetailComponent implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private dss: DataShareService = inject(DataShareService);
  private as: ApiService = inject(ApiService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private dialog: DialogService = inject(DialogService);
  private crypto: CryptoService = inject(CryptoService);
  private sanitizer: DomSanitizer = inject(DomSanitizer);
  private elementRef: ElementRef = inject(ElementRef);
  private viewContainerRef: ViewContainerRef = inject(ViewContainerRef);

  loading: WritableSignal<boolean> = signal<boolean>(true);
  username: string = '';
  entry: Entry = new Entry();
  htmlContent: SafeHtml = '';

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.username = params['username'];
      this.loadEntry(params['id']);
    });
  }

  async loadEntry(id: number): Promise<void> {
    try {
      const response: EntryResult = await firstValueFrom(this.as.getEntry(id));

      if (response.status === 'ok') {
        const encryptedEntry: EntryInterface = response.entry;
        const decryptedEntry: EntryInterface = await this.crypto.decryptEntry(
          encryptedEntry
        );
        this.entry = this.cms.getEntry(decryptedEntry);
        const html: string = this.entry.composed;
        this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(html);

        this.dss.setGlobal('where', 'entry');
        this.dss.setGlobal('entryId', this.entry.id);
        setTimeout((): void => {
          this.loadPhotos();
        }, 0);
        this.loading.set(false);
      }
    } catch (error) {
      console.error(error);
      this.dialog
        .alert({
          title: 'Error',
          content:
            'Ocurrió un error al cargar la entrada. Inténtalo de nuevo más tarde por favor.',
          ok: 'Continuar',
        })
        .subscribe((): void => {
          this.router.navigate(['/home']);
        });
    }
  }

  loadPhotos(): void {
    const body: Element | null = document.querySelector('.body');
    if (body !== null) {
      const html: string = body.innerHTML;
      const regex = /<div class="entry-photo" id="photo-(.*?)"><\/div>/g;
      const resultados: IterableIterator<RegExpMatchArray> =
        html.matchAll(regex);
      for (const resultado of resultados) {
        const photoId: number = parseInt(resultado[1]);
        const photo: Photo = new Photo(photoId);

        const targetElement: HTMLElement =
          this.elementRef.nativeElement.querySelector('#photo-' + photoId);
        const component: ComponentRef<ImgCryptComponent> =
          this.viewContainerRef.createComponent(ImgCryptComponent);
        component.instance.photo.set(photo);
        component.instance.type.set('full');

        targetElement.appendChild(component.location.nativeElement);
      }
    }
  }
}
