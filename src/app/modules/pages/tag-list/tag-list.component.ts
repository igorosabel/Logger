import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import {
  EntryInterface,
  TagEntriesResult,
  TagInterface,
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

  async loadEntries(): Promise<void> {
    try {
      const response: TagEntriesResult = await firstValueFrom(
        this.as.getTagEntries(this.idTag)
      );

      if (response.status === "ok") {
        const encryptedTag: TagInterface = response.tag;
        const decryptedTag: TagInterface = await this.crypto.decryptTag(
          encryptedTag
        );
        this.tag = this.cms.getTag(decryptedTag);
        const encryptedEntries: EntryInterface[] = response.list;
        const decryptedEntries: EntryInterface[] =
          await this.crypto.decryptEntries(encryptedEntries);
        this.entryList = this.cms.getEntries(decryptedEntries);
      }
    } catch (error) {
      console.error("Error al cargar las entradas:", error);
    } finally {
      this.loading = false;
    }
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
