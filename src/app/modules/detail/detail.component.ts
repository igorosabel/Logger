import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router, RouterModule } from "@angular/router";
import { EntryResult } from "src/app/interfaces/interfaces";
import { Entry } from "src/app/model/entry.model";
import { MaterialModule } from "src/app/modules/material/material.module";
import { EntryTagListComponent } from "src/app/modules/shared/components/entry-tag-list/entry-tag-list.component";
import { ApiService } from "src/app/services/api.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { DataShareService } from "src/app/services/data-share.service";
import { DialogService } from "src/app/services/dialog.service";

@Component({
  standalone: true,
  selector: "app-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
  imports: [CommonModule, MaterialModule, RouterModule, EntryTagListComponent],
  providers: [DialogService],
})
export default class DetailComponent implements OnInit {
  loading: boolean = true;
  username: string;
  entry: Entry;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dss: DataShareService,
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
    this.as.getEntry(id).subscribe((response: EntryResult): void => {
      if (response.status == "ok") {
        this.entry = this.cms.getEntry(response.entry);
        this.dss.setGlobal("where", "entry");
        this.dss.setGlobal("entryId", this.entry.id);
        this.dss.setGlobal("entrySlug", this.entry.slug);
        this.loading = false;
      } else {
        this.dialog
          .alert({
            title: "Error",
            content: "Ocurrió un error al cargar la entrada",
            ok: "Continuar",
          })
          .subscribe((result: boolean): void => {
            this.router.navigate(["/", this.username]);
          });
      }
    });
  }
}
