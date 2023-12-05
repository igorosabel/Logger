import { Component, OnInit, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { ActivatedRoute, Params, Router, RouterModule } from "@angular/router";
import { EntryInterface, StatusResult } from "src/app/interfaces/interfaces";
import { Entry } from "src/app/model/entry.model";
import { EditorComponent } from "src/app/modules/shared/components/editor/editor.component";
import { ApiService } from "src/app/services/api.service";
import { CryptoService } from "src/app/services/crypto.service";
import { DialogService } from "src/app/services/dialog.service";

@Component({
  standalone: true,
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.scss"],
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
  loading: boolean = true;
  username: string;
  entry: Entry = new Entry(null, "Nueva entrada");
  @ViewChild("editor", { static: true }) editor: EditorComponent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private as: ApiService,
    private dialog: DialogService,
    private router: Router,
    private crypto: CryptoService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.username = params.username;
      this.editor.loadEntry(this.entry);
    });
  }

  editorLoaded(ev: boolean): void {
    this.loading = ev;
  }

  async saveEntry(): Promise<void> {
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
      return;
    }

    const encryptedEntry: EntryInterface = await this.crypto.encryptEntry(
      this.entry.toInterface()
    );
    this.loading = true;

    this.as
      .saveEntry(encryptedEntry)
      .subscribe((result: StatusResult): void => {
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
}
