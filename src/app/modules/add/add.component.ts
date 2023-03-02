import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params, Router, RouterModule } from "@angular/router";
import { StatusResult } from "src/app/interfaces/interfaces";
import { Entry } from "src/app/model/entry.model";
import { MaterialModule } from "src/app/modules/material/material.module";
import { EditorComponent } from "src/app/modules/shared/components/editor/editor.component";
import { ApiService } from "src/app/services/api.service";
import { DialogService } from "src/app/services/dialog.service";

@Component({
  standalone: true,
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.scss"],
  imports: [CommonModule, MaterialModule, RouterModule, EditorComponent],
  providers: [DialogService],
})
export default class AddComponent implements OnInit {
  loading: boolean = true;
  username: string;
  entry: Entry;
  @ViewChild("editor", { static: true }) editor: EditorComponent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private as: ApiService,
    private dialog: DialogService,
    private router: Router
  ) {
    this.entry = new Entry(null, "Nueva entrada");
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.username = params.username;
      this.editor.loadEntry(this.entry);
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

    this.loading = true;

    this.as.saveEntry(this.entry).subscribe((result: StatusResult): void => {
      this.loading = false;
      if (result.status == "ok") {
        this.dialog
          .alert({
            title: "OK",
            content:
              'La nueva entrada "' + this.entry.title + '" ha sido guardada.',
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
}
