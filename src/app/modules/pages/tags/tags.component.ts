import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router, RouterModule } from "@angular/router";
import { TagsResult } from "src/app/interfaces/interfaces";
import { Tag } from "src/app/model/tag.model";
import { MaterialModule } from "src/app/modules/material/material.module";
import { ApiService } from "src/app/services/api.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
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
    private router: Router,
    private dss: DataShareService,
    private as: ApiService,
    private cms: ClassMapperService
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

  loadTags(): void {
    this.as.getTags().subscribe((response: TagsResult): void => {
      if (response.status == "ok") {
        this.tagList = this.cms.getTags(response.list);
        this.loading = false;
      }
    });
  }
}
