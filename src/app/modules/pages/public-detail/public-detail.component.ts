import {
  Component,
  ComponentRef,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewContainerRef,
  WritableSignal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { EntryResult } from '@interfaces/interfaces';
import Entry from '@model/entry.model';
import Photo from '@model/photo.model';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import DialogService from '@services/dialog.service';
import UserService from '@services/user.service';
import ImgCryptComponent from '@shared/components/img-crypt/img-crypt.component';

@Component({
  selector: 'app-public-detail',
  templateUrl: './public-detail.component.html',
  styleUrls: ['./public-detail.component.scss'],
  imports: [RouterModule, MatToolbarModule, MatButtonModule, MatIconModule],
  providers: [DialogService],
})
export default class PublicDetailComponent implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private as: ApiService = inject(ApiService);
  private us: UserService = inject(UserService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private dialog: DialogService = inject(DialogService);
  private sanitizer: DomSanitizer = inject(DomSanitizer);
  private elementRef: ElementRef = inject(ElementRef);
  private viewContainerRef: ViewContainerRef = inject(ViewContainerRef);

  loading: WritableSignal<boolean> = signal<boolean>(true);
  isLogged: WritableSignal<boolean> = signal<boolean>(true);
  entry: Entry = new Entry();
  htmlContent: SafeHtml = '';

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.isLogged.set(this.us.logged);
      this.loadEntry(params['id']);
    });
  }

  loadEntry(id: number): void {
    this.as.getPublicEntry(id).subscribe((response: EntryResult): void => {
      if (response.status == 'ok') {
        this.entry = this.cms.getEntry(response.entry);
        const html: string = this.entry.composed;
        this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(html);
        setTimeout((): void => {
          this.loadPhotos();
        }, 0);

        this.loading.set(false);
      } else {
        this.dialog
          .alert({
            title: 'Error',
            content: 'Ocurrió un error al cargar la entrada',
            ok: 'Continuar',
          })
          .subscribe((): void => {
            this.router.navigate(['/']);
          });
      }
    });
  }

  loadPhotos(): void {
    const obj: Element | null = document.querySelector('.body');
    if (obj !== null) {
      const html: string = obj.innerHTML;
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
        component.instance.decrypt.set(false);
        component.instance.photo.set(photo);
        component.instance.type.set('full');

        targetElement.appendChild(component.location.nativeElement);
      }
    }
  }
}
