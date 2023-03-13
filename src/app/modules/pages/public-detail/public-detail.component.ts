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
import { EntryResult } from "src/app/interfaces/interfaces";
import { Entry } from "src/app/model/entry.model";
import { Photo } from "src/app/model/photo.model";
import { MaterialModule } from "src/app/modules/material/material.module";
import { ImgCryptComponent } from "src/app/modules/shared/components/img-crypt/img-crypt.component";
import { ApiService } from "src/app/services/api.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { DialogService } from "src/app/services/dialog.service";
import { UserService } from "src/app/services/user.service";

@Component({
  standalone: true,
  selector: "app-public-detail",
  templateUrl: "./public-detail.component.html",
  styleUrls: ["./public-detail.component.scss"],
  imports: [CommonModule, MaterialModule, RouterModule],
  providers: [DialogService],
})
export default class PublicDetailComponent implements OnInit {
  loading: boolean = true;
  isLogged: boolean = false;
  entry: Entry = new Entry();
  htmlContent: SafeHtml = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private as: ApiService,
    private us: UserService,
    private cms: ClassMapperService,
    private dialog: DialogService,
    private sanitizer: DomSanitizer,
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef
  ) {
    this.us.loadLogin();
  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.isLogged = this.us.logged;
      this.loadEntry(params.id);
    });
  }

  loadEntry(id: number): void {
    this.as.getPublicEntry(id).subscribe((response: EntryResult): void => {
      if (response.status == "ok") {
        this.entry = this.cms.getEntry(response.entry);
        const html: string = this.entry.composed;
        this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(html);
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
            this.router.navigate(["/"]);
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
      component.instance.decrypt = false;
      component.instance.photo = photo;
      component.instance.type = "full";

      targetElement.appendChild(component.location.nativeElement);
    }
  }
}
