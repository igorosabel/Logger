import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params, Router, RouterModule } from "@angular/router";
import { EntryResult, StatusResult } from "src/app/interfaces/interfaces";
import { Entry } from "src/app/model/entry.model";
import { MaterialModule } from "src/app/modules/material/material.module";
import { EditorComponent } from "src/app/modules/shared/components/editor/editor.component";
import { ApiService } from "src/app/services/api.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { CryptoService } from "src/app/services/crypto.service";
import { DialogService } from "src/app/services/dialog.service";
import { EntryInterface } from "./../../interfaces/interfaces";

@Component({
  standalone: true,
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"],
  imports: [CommonModule, MaterialModule, RouterModule, EditorComponent],
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

  loadEntry(): void {
    this.as.getEntry(this.idEntry).subscribe((response: EntryResult): void => {
      if (response.status == "ok") {
        this.entry = this.cms.getEntry(response.entry);
        this.editor.loadEntry(this.entry);
      } else {
        this.dialog
          .alert({
            title: "Error",
            content:
              "Ocurrió un error al cargar la entrada. Inténtalo de nuevo más tarde por favor.",
            ok: "Continuar",
          })
          .subscribe((result: boolean): void => {});
      }
    });
  }

  editorLoaded(ev: boolean): void {
    this.loading = ev;
  }

  saveEntry(): boolean {
    this.entry = this.editor.getEntry();

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

    const encryptedEntry: EntryInterface = this.crypto.encryptEntry(
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
              this.router.navigate(["/" + this.username]);
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
                    this.router.navigate(["/", this.username]);
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
