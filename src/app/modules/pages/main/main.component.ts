import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router, RouterModule } from "@angular/router";
import { EntriesResult, EntryInterface } from "src/app/interfaces/interfaces";
import { Entry } from "src/app/model/entry.model";
import { MaterialModule } from "src/app/modules/material/material.module";
import { OCalendarDate } from "src/app/modules/shared/components/ocalendar/ocalendar-date.model";
import { OCalendarMonth } from "src/app/modules/shared/components/ocalendar/ocalendar-month.model";
import { OcalendarComponent } from "src/app/modules/shared/components/ocalendar/ocalendar.component";
import { OneEntryComponent } from "src/app/modules/shared/components/one-entry/one-entry.component";
import { ApiService } from "src/app/services/api.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { CryptoService } from "src/app/services/crypto.service";
import { DataShareService } from "src/app/services/data-share.service";
import { UserService } from "src/app/services/user.service";

@Component({
  standalone: true,
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    OneEntryComponent,
    OcalendarComponent,
  ],
})
export default class MainComponent implements OnInit {
  loading: boolean = true;
  username: string;
  entryList: Entry[] = [];
  menuShow: boolean = false;
  markedDays: string[] = ["13-11", "21-11"];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dss: DataShareService,
    private user: UserService,
    private as: ApiService,
    private cms: ClassMapperService,
    private crypto: CryptoService
  ) {}

  ngOnInit(): void {
    this.dss.setGlobal("where", "home");
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.loadEntries();
    });
  }

  loadEntries(): void {
    this.as.getEntries().subscribe((response: EntriesResult): void => {
      if (response.status == "ok") {
        const list: EntryInterface[] = this.crypto.decryptEntries(
          response.list
        );
        this.entryList = this.cms.getEntries(list);
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

  calendarChange(ev: OCalendarMonth): void {
    console.log(ev);
  }

  calendarSelectDay(ev: OCalendarDate): void {
    console.log(ev);
  }
}
