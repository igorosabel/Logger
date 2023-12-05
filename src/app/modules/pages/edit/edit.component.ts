import { Component, OnInit, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { ActivatedRoute, Params, Router, RouterModule } from "@angular/router";
import { firstValueFrom } from "rxjs";
import {
  EntryInterface,
  EntryResult,
  StatusResult,
} from "src/app/interfaces/interfaces";
import { Entry } from "src/app/model/entry.model";
import { EditorComponent } from "src/app/modules/shared/components/editor/editor.component";
import { ApiService } from "src/app/services/api.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { CryptoService } from "src/app/services/crypto.service";
import { DialogService } from "src/app/services/dialog.service";

@Component({
  standalone: true,
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"],
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
  loading: boolean = true;
  username: string;
  idEntry: number = null;
  entry: Entry;
  @ViewChild("editor", { static: true }) editor: EditorComponent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private as: ApiService,
    private cms: ClassMapperService,
    private dialog: DialogService,
    private crypto: CryptoService,
    private router: Router
  ) {
    this.entry = new Entry(null, "Nueva entrada");
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.username = params.username;
      this.idEntry = params.id;
      this.loadEntry();
    });
  }

  async loadEntry(): Promise<void> {
    try {
      const response: EntryResult = await firstValueFrom(
        this.as.getEntry(this.idEntry)
      );

      if (response.status === "ok") {
        const encryptedEntry: EntryInterface = response.entry;
        const decryptedEntry: EntryInterface = await this.crypto.decryptEntry(
          encryptedEntry
        );
        this.entry = this.cms.getEntry(decryptedEntry);
        this.editor.loadEntry(this.entry);
      }
    } catch (error) {
      this.dialog
        .alert({
          title: "Error",
          content:
            "Ocurrió un error al cargar la entrada. Inténtalo de nuevo más tarde por favor.",
          ok: "Continuar",
        })
        .subscribe((result: boolean): void => {});
    }
  }

  editorLoaded(ev: boolean): void {
    this.loading = ev;
  }

  async saveEntry(): Promise<boolean> {
    this.entry = this.editor.getEntry();
    console.log(this.entry);
    if (this.entry.title == "") {
      this.dialog
        .alert({
          title: "Error",
          content: "¡No puedes dejar el título de la entrada en blanco!",
          ok: "Continuar",
        })
        .subscribe((result: boolean): void => {
          this.editor.focusTitle();
        });
      return false;
    }

    const encryptedEntry: EntryInterface = await this.crypto.encryptEntry(
      this.entry.toInterface()
    );
    this.loading = true;

    this.as
      .saveEntry(encryptedEntry)
      .subscribe((result: StatusResult): void => {
        if (result.status == "ok") {
          this.loading = false;
          this.dialog
            .alert({
              title: "OK",
              content:
                'La entrada "' + this.entry.title + '" ha sido guardada.',
              ok: "Continuar",
            })
            .subscribe((result: boolean): void => {
              this.router.navigate(["/home"]);
            });
        } else {
          this.dialog
            .alert({
              title: "Error",
              content:
                "Ocurrió un error al guardar la entrada. Inténtalo de nuevo más tarde por favor.",
              ok: "Continuar",
            })
            .subscribe((result: boolean): void => {});
        }
      });
  }

  deleteEntry(): void {
    this.dialog
      .confirm({
        title: "Confirmar",
        content:
          "¿Estás seguro de querer borrar esta entrada? Esta acción es irreversible",
        ok: "Continuar",
        cancel: "Cancelar",
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.loading = true;
          this.as
            .deleteEntry(this.idEntry)
            .subscribe((result: StatusResult): void => {
              this.loading = false;
              if (result.status === "ok") {
                this.dialog
                  .alert({
                    title: "Entrada borrada",
                    content: "La entrada ha sido borrada correctamente.",
                    ok: "Continuar",
                  })
                  .subscribe((result: boolean): void => {
                    this.router.navigate(["/home"]);
                  });
              } else {
                this.dialog
                  .alert({
                    title: "Error",
                    content:
                      "Ocurrió un error al borrar la entrada. Inténtalo de nuevo más tarde por favor.",
                    ok: "Continuar",
                  })
                  .subscribe((result: boolean): void => {});
              }
            });
        }
      });
  }
}
