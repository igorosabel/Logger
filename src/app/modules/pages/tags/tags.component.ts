import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, RouterModule } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { TagInterface, TagsResult } from "src/app/interfaces/interfaces";
import { Tag } from "src/app/model/tag.model";
import { MaterialModule } from "src/app/modules/material/material.module";
import { ApiService } from "src/app/services/api.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { CryptoService } from "src/app/services/crypto.service";
import { DataShareService } from "src/app/services/data-share.service";

@Component({
  standalone: true,
  selector: "app-tags",
  templateUrl: "./tags.component.html",
  imports: [CommonModule, RouterModule, MaterialModule],
})
export default class TagsComponent implements OnInit {
  loading: boolean = true;
  username: string;
  tagList: Tag[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private dss: DataShareService,
    private as: ApiService,
    private cms: ClassMapperService,
    private crypto: CryptoService
  ) {
    this.tagList = [];
  }

  ngOnInit(): void {
    this.dss.setGlobal("where", "tags");
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.username = params.username;
      this.loadTags();
    });
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
      }
    } catch (error) {
      console.error("Error al cargar los tags:", error);
    } finally {
      this.loading = false;
    }
  }
}
