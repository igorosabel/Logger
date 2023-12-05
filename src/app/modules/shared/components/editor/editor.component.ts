import { CommonModule } from "@angular/common";
import { HttpEvent, HttpEventType } from "@angular/common/http";
import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { firstValueFrom } from "rxjs";
import {
  PhotoUploadResult,
  PhotosResult,
  StatusResult,
  TagInterface,
  TagsResult,
} from "src/app/interfaces/interfaces";
import { Entry } from "src/app/model/entry.model";
import { Photo } from "src/app/model/photo.model";
import { Tag } from "src/app/model/tag.model";
import { ImgCryptComponent } from "src/app/modules/shared/components/img-crypt/img-crypt.component";
import { ApiService } from "src/app/services/api.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { CryptoService } from "src/app/services/crypto.service";
import { DialogService } from "src/app/services/dialog.service";

@Component({
  standalone: true,
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"],
  imports: [
    CommonModule,
    FormsModule,
    ImgCryptComponent,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSlideToggleModule,
    MatCardModule,
  ],
  providers: [DialogService],
})
export class EditorComponent {
  entry: Entry = new Entry();
  @ViewChild("title", { static: true }) titleBox: ElementRef;
  @ViewChild("entryText", { static: true }) entryText: ElementRef;
  tagList: Tag[] = [];
  tags: string = "";
  canPhotos: boolean = false;
  photoList: Photo[];
  showPhotos: boolean = false;
  selectedPhoto: number = null;
  @ViewChild("photoUpload", { static: true }) photoUpload: ElementRef;
  loading: boolean = true;
  @Output() onLoading: EventEmitter<boolean> = new EventEmitter<boolean>();
  uploadProgress: number = null;

  constructor(
    private as: ApiService,
    private cms: ClassMapperService,
    private dialog: DialogService,
    private crypto: CryptoService
  ) {}

  loadEntry(entry: Entry): void {
    this.entry = entry;
    this.tags = this.entry.tags.map((x: Tag): string => x.name).join(", ");
    this.loadTags();
  }

  async loadTags(): Promise<void> {
    try {
      const response: TagsResult = await firstValueFrom(this.as.getTags());

      if (response.status === "ok") {
        const encryptedTags: TagInterface[] = response.list;
        const decryptedTags: TagInterface[] = await this.crypto.decryptTags(
          encryptedTags
        );
        this.tagList = this.cms.getTags(decryptedTags);
        if (this.entry.id) {
          this.canPhotos = true;
          this.loadPhotos();
        } else {
          this.onLoading.emit(false);
        }
      }
    } catch (error) {
      console.error("Error al cargar los tags:", error);
    } finally {
      this.loading = false;
    }
  }

  loadPhotos(): void {
    this.as
      .getPhotos(this.entry.id)
      .subscribe((response: PhotosResult): void => {
        this.photoList = this.cms.getPhotos(response.list);
        this.onLoading.emit(false);
      });
  }

  getEntry(): Entry {
    this.entry.loadTags(this.tags);
    return this.entry;
  }

  focusTitle(): void {
    this.titleBox.nativeElement.focus();
  }

  getSel() {
    // obtain the object reference for the <textarea>
    const txtarea = this.entryText.nativeElement;
    // obtain the index of the first selected character
    const start = txtarea.selectionStart;
    // obtain the index of the last selected character
    const finish = txtarea.selectionEnd;
    // obtain the selected text
    const sel = txtarea.value.substring(start, finish);
    // do something with the selected content

    return { txtarea, start, finish, sel };
  }

  applyFormat(format: string): void {
    const selectionObj = this.getSel();
    if (selectionObj.sel != "") {
      this.entry.body =
        this.entry.body.substring(0, selectionObj.start) +
        "[" +
        format +
        "]" +
        selectionObj.sel +
        "[/" +
        format +
        "]" +
        this.entry.body.substring(selectionObj.finish, this.entry.body.length);
    }
  }

  addTag(tag: Tag): boolean {
    let selectedTags: string[] = [];
    if (this.tags != "") {
      selectedTags = this.tags.split(",").map((x: string): string => x.trim());
    }

    const tagIndex: number = selectedTags.findIndex(
      (x: string): boolean => x == tag.name
    );
    if (tagIndex != -1) {
      return false;
    }

    selectedTags.push(tag.name);
    this.tags = selectedTags.join(", ");
  }

  openPhotos(): void {
    this.selectedPhoto = null;
    this.showPhotos = true;
  }

  closePhotos(): void {
    this.showPhotos = false;
  }

  selectPhoto(photo: Photo): void {
    if (this.uploadProgress != null) {
      return;
    }
    this.selectedPhoto = photo.id;
  }

  insertPhoto(): void {
    this.entry.body += "\n[img]" + this.selectedPhoto + "[/img]\n";
    this.closePhotos();
  }

  addPhoto(): void {
    if (this.uploadProgress != null) {
      return;
    }
    this.photoUpload.nativeElement.click();
  }

  photoContinue(ev: Event): void {
    const file = (<HTMLInputElement>ev.target).files[0];
    const validList: string[] = ["jpg", "jpeg", "png"];
    const fileExt: string = file.name.split(".").pop();
    if (validList.indexOf(fileExt) == -1) {
      this.dialog
        .alert({
          title: "Error",
          content:
            "Solo está permitido imágenes de los siguientes tipos: " +
            validList.join(", "),
          ok: "Continuar",
        })
        .subscribe((result: boolean): void => {});
    } else {
      const fr: FileReader = new FileReader();
      fr.onload = (): void => {
        const base64: string = fr.result.toString();
        this.photoUploadSend(this.entry.id, base64);
      };
      fr.readAsDataURL(file);
    }
  }

  photoUploadSend(id: number, photo: string): void {
    this.uploadProgress = 0;
    this.as.uploadPhoto(id, photo).subscribe((event: HttpEvent<any>): void => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          {
            this.uploadProgress = Math.round(
              (event.loaded / event.total) * 100
            );
          }
          break;
        case HttpEventType.Response: {
          const result: PhotoUploadResult = event.body;
          const photo = this.cms.getPhoto(result.photo);
          this.photoList.push(photo);
          this.selectedPhoto = photo.id;
          this.uploadProgress = null;
        }
      }
    });
  }

  deletePhoto(): void {
    this.dialog
      .confirm({
        title: "Atención",
        content: "¿Estás seguro de querer borrar esta foto?",
        ok: "Continuar",
        cancel: "Cancelar",
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.uploadProgress = 0;
          this.deletePhotoConfirm();
        }
      });
  }

  deletePhotoConfirm(): void {
    this.as
      .deletePhoto(this.selectedPhoto)
      .subscribe((result: StatusResult): void => {
        if (result.status == "ok") {
          const replace: string =
            "\\\n\\[img\\]" + this.selectedPhoto + "\\[\\/img\\]\\\n";
          const re = new RegExp(replace, "g");

          this.entry.body = this.entry.body.replace(re, "");
          this.selectedPhoto = null;
          const ind: number = this.photoList.findIndex(
            (x: Photo): boolean => x.id == this.selectedPhoto
          );
          this.photoList.splice(ind, 1);
          this.uploadProgress = null;
        } else {
          this.dialog
            .alert({
              title: "Error",
              content: "Ha ocurrido un error al borrar la foto.",
              ok: "Continuar",
            })
            .subscribe((result: boolean): void => {});
        }
      });
  }
}
