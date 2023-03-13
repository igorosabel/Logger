import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import {
  EntryInterface,
  TagEntriesResult,
} from "src/app/interfaces/interfaces";
import { Entry } from "src/app/model/entry.model";
import { Tag } from "src/app/model/tag.model";
import { MaterialModule } from "src/app/modules/material/material.module";
import { OneEntryComponent } from "src/app/modules/shared/components/one-entry/one-entry.component";
import { ApiService } from "src/app/services/api.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { CryptoService } from "src/app/services/crypto.service";
import { DataShareService } from "src/app/services/data-share.service";

@Component({
  standalone: true,
  selector: "app-tag-list",
  templateUrl: "./tag-list.component.html",
  imports: [CommonModule, MaterialModule, OneEntryComponent],
})
export default class TagListComponent implements OnInit {
  loading: boolean = true;
  idTag: number;
  tag: Tag = new Tag();
  entryList: Entry[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dss: DataShareService,
    private as: ApiService,
    private cms: ClassMapperService,
    private crypto: CryptoService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.idTag = params.id;
      this.loadEntries();
    });
  }

  loadEntries(): void {
    this.as
      .getTagEntries(this.idTag)
      .subscribe((response: TagEntriesResult): void => {
        if (response.status == "ok") {
          this.tag = this.cms.getTag(this.crypto.decryptTag(response.tag));
          const list: EntryInterface[] = this.crypto.decryptEntries(
            response.list
          );
          this.entryList = this.cms.getEntries(list);
          this.loading = false;
        }
      });
  }

  goBack(): void {
    const whereTo: string = this.dss.getGlobal("where");
    switch (whereTo) {
      case "home":
        {
          this.router.navigate(["/home"]);
        }
        break;
      case "entry":
        {
          const entryId: number = this.dss.getGlobal("entryId");
          this.router.navigate(["/entry", entryId]);
        }
        break;
      case "tags":
        {
          this.router.navigate(["/tags"]);
        }
        break;
    }
  }
}
