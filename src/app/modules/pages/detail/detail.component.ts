import { CommonModule } from "@angular/common";
import {
  Component,
  ComponentRef,
  ElementRef,
  OnInit,
  ViewContainerRef,
} from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { ActivatedRoute, Params, Router, RouterModule } from "@angular/router";
import { EntryInterface, EntryResult } from "src/app/interfaces/interfaces";
import { Entry } from "src/app/model/entry.model";
import { Photo } from "src/app/model/photo.model";
import { MaterialModule } from "src/app/modules/material/material.module";
import { EntryTagListComponent } from "src/app/modules/shared/components/entry-tag-list/entry-tag-list.component";
import { ImgCryptComponent } from "src/app/modules/shared/components/img-crypt/img-crypt.component";
import { ApiService } from "src/app/services/api.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { CryptoService } from "src/app/services/crypto.service";
import { DataShareService } from "src/app/services/data-share.service";
import { DialogService } from "src/app/services/dialog.service";

@Component({
  standalone: true,
  selector: "app-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    EntryTagListComponent,
    ImgCryptComponent,
  ],
  providers: [DialogService],
})
export default class DetailComponent implements OnInit {
  loading: boolean = true;
  username: string;
  entry: Entry;
  contenidoHTML: SafeHtml = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dss: DataShareService,
    private as: ApiService,
    private cms: ClassMapperService,
    private dialog: DialogService,
    private crypto: CryptoService,
    private sanitizer: DomSanitizer,
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef
  ) {
    this.entry = new Entry();
  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.username = params.username;
      this.loadEntry(params.id);
    });

    /*const component: ComponentRef<ImgCryptComponent> =
      this.viewContainerRef.createComponent(ImgCryptComponent);*/
  }

  loadEntry(id: number): void {
    this.as.getEntry(id).subscribe((response: EntryResult): void => {
      if (response.status == "ok") {
        const decryptedEntry: EntryInterface = this.crypto.decryptEntry(
          response.entry
        );
        this.entry = this.cms.getEntry(decryptedEntry);
        const html: string = this.entry.composed;
        this.contenidoHTML = this.sanitizer.bypassSecurityTrustHtml(html);

        this.dss.setGlobal("where", "entry");
        this.dss.setGlobal("entryId", this.entry.id);
        setTimeout((): void => {
          this.loadPhotos();
        }, 0);
        this.loading = false;
      } else {
        this.dialog
          .alert({
            title: "Error",
            content: "Ocurrió un error al cargar la entrada",
            ok: "Continuar",
          })
          .subscribe((result: boolean): void => {
            this.router.navigate(["/home"]);
          });
      }
    });
  }

  loadPhotos(): void {
    const html: string = document.querySelector(".body").innerHTML;
    const regex = /<div class="entry-photo" id="photo-(.*?)"><\/div>/g;
    const resultados: IterableIterator<RegExpMatchArray> = html.matchAll(regex);
    for (const resultado of resultados) {
      const photoId: number = parseInt(resultado[1]);
      const photo: Photo = new Photo(photoId);

      const targetElement: HTMLElement =
        this.elementRef.nativeElement.querySelector("#photo-" + photoId);
      const component: ComponentRef<ImgCryptComponent> =
        this.viewContainerRef.createComponent(ImgCryptComponent);
      component.instance.photo = photo;
      component.instance.type = "full";

      targetElement.appendChild(component.location.nativeElement);
    }
  }
}
