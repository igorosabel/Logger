import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { EntryResult } from "src/app/interfaces/interfaces";
import { Entry } from "src/app/model/entry.model";
import { MaterialModule } from "src/app/modules/material/material.module";
import { ApiService } from "src/app/services/api.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { DialogService } from "src/app/services/dialog.service";

@Component({
  standalone: true,
  selector: "app-public-detail",
  templateUrl: "./public-detail.component.html",
  styleUrls: ["./public-detail.component.scss"],
  imports: [CommonModule, MaterialModule],
  providers: [DialogService],
})
export default class PublicDetailComponent implements OnInit {
  loading: boolean = true;
  username: string;
  entry: Entry;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private as: ApiService,
    private cms: ClassMapperService,
    private dialog: DialogService
  ) {
    this.entry = new Entry();
  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.username = params.username;
      this.loadEntry(params.id);
    });
  }

  loadEntry(id: number): void {
    this.as.getPublicEntry(id).subscribe((response: EntryResult): void => {
      if (response.status == "ok") {
        this.entry = this.cms.getEntry(response.entry);
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
}
