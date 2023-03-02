import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router, RouterModule } from "@angular/router";
import { EntriesResult } from "src/app/interfaces/interfaces";
import { Entry } from "src/app/model/entry.model";
import { MaterialModule } from "src/app/modules/material/material.module";
import { OneEntryComponent } from "src/app/modules/shared/components/one-entry/one-entry.component";
import { ApiService } from "src/app/services/api.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { DataShareService } from "src/app/services/data-share.service";
import { UserService } from "src/app/services/user.service";

@Component({
  standalone: true,
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
  imports: [CommonModule, MaterialModule, RouterModule, OneEntryComponent],
})
export default class MainComponent implements OnInit {
  loading: boolean = true;
  username: string;
  entryList: Entry[];
  menuShow: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dss: DataShareService,
    private user: UserService,
    private as: ApiService,
    private cms: ClassMapperService
  ) {
    this.entryList = [];
  }

  ngOnInit(): void {
    this.dss.setGlobal("where", "home");
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.username = params.username;
      this.loadEntries();
    });
  }

  loadEntries(): void {
    this.as.getEntries().subscribe((response: EntriesResult): void => {
      if (response.status == "ok") {
        this.entryList = this.cms.getEntries(response);
        this.loading = false;
      }
    });
  }

  menuOpened(mode: boolean): void {
    this.menuShow = mode;
  }

  logout(ev: MouseEvent): void {
    ev.preventDefault();
    this.user.logout();
    this.router.navigate(["/"]);
  }
}
