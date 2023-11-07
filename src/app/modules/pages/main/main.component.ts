import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { firstValueFrom } from "rxjs";
import {
  EntryInterface,
  HomeDataInterface,
  HomeDataRequest,
  TagInterface,
} from "src/app/interfaces/interfaces";
import { Entry } from "src/app/model/entry.model";
import { Tag } from "src/app/model/tag.model";
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
  day: number = null;
  month: number = new Date().getMonth() + 1;
  year: number = new Date().getFullYear();
  @ViewChild("calendar", { static: true }) calendar: OcalendarComponent;
  tagList: Tag[] = [];
  selectedTag: number = null;
  entryList: Entry[] = [];
  menuShow: boolean = false;

  constructor(
    private router: Router,
    private dss: DataShareService,
    private user: UserService,
    private as: ApiService,
    private cms: ClassMapperService,
    private crypto: CryptoService
  ) {}

  ngOnInit(): void {
    this.dss.setGlobal("where", "home");
    this.loadHomeData();
  }

  async loadHomeData(): Promise<void> {
    try {
      const data: HomeDataRequest = {
        day: this.day,
        month: this.month,
        year: this.year,
        tags: this.selectedTag !== null ? [this.selectedTag] : [],
      };
      const response: HomeDataInterface = await firstValueFrom(
        this.as.getHomeData(data)
      );

      if (response.status === "ok") {
        console.log(response);
        const encryptedEntries: EntryInterface[] = response.entries;
        const decryptedEntries: EntryInterface[] =
          await this.crypto.decryptEntries(encryptedEntries);
        this.entryList = this.cms.getEntries(decryptedEntries);
        const encryptedTags: TagInterface[] = response.tags;
        const decryptedTags: TagInterface[] = await this.crypto.decryptTags(
          encryptedTags
        );
        this.tagList = this.cms.getTags(decryptedTags);
        this.calendar.generateCalendar(response.calendar);
      }
    } catch (error) {
      console.error("Error al cargar las entradas:", error);
    } finally {
      this.loading = false;
    }
  }

  menuOpened(mode: boolean): void {
    this.menuShow = mode;
  }

  logout(ev: MouseEvent): void {
    ev.preventDefault();
    this.user.logout();
    this.router.navigate(["/"]);
  }

  selectTag(tag: Tag): void {
    this.selectedTag = tag.id;
    this.loadHomeData();
  }

  clearFilters(): void {
    this.day = null;
    this.selectedTag = null;
    this.loadHomeData();
  }

  calendarChange(ev: OCalendarMonth): void {
    console.log(ev);
    this.day = null;
    this.month = ev.month;
    this.year = ev.year;
    this.loadHomeData();
  }

  calendarSelectDay(ev: OCalendarDate): void {
    console.log(ev);
    this.day = ev.day;
    this.month = ev.month;
    this.year = ev.year;
    this.loadHomeData();
  }
}
