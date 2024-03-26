import { NgClass } from "@angular/common";
import {
  Component,
  OnInit,
  Signal,
  WritableSignal,
  signal,
  viewChild,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Router, RouterModule } from "@angular/router";
import { environment } from "@env/environment";
import {
  EntryInterface,
  HomeDataInterface,
  HomeDataRequest,
  TagInterface,
} from "@interfaces/interfaces";
import { Entry } from "@model/entry.model";
import { Tag } from "@model/tag.model";
import { ApiService } from "@services/api.service";
import { ClassMapperService } from "@services/class-mapper.service";
import { CryptoService } from "@services/crypto.service";
import { DataShareService } from "@services/data-share.service";
import { UserService } from "@services/user.service";
import { OCalendarDate } from "@shared/components/ocalendar/ocalendar-date.model";
import { OCalendarMonth } from "@shared/components/ocalendar/ocalendar-month.model";
import { OcalendarComponent } from "@shared/components/ocalendar/ocalendar.component";
import { OneEntryComponent } from "@shared/components/one-entry/one-entry.component";
import { firstValueFrom } from "rxjs";

@Component({
  standalone: true,
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
  imports: [
    NgClass,
    RouterModule,
    OneEntryComponent,
    OcalendarComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatCardModule,
  ],
  providers: [DataShareService],
})
export default class MainComponent implements OnInit {
  loading: WritableSignal<boolean> = signal<boolean>(true);
  first: boolean = true;
  username: string;
  day: number = null;
  month: number = new Date().getMonth() + 1;
  year: number = new Date().getFullYear();
  calendar: Signal<OcalendarComponent> =
    viewChild<OcalendarComponent>("calendar");
  tagList: Tag[] = [];
  selectedTag: number = null;
  entryList: Entry[] = [];
  menuShow: boolean = false;
  filtersCollapsed: WritableSignal<boolean> = signal<boolean>(false);

  page: number = 1;
  numPages: number = 0;
  numResults: number = environment.numResults;

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
        first: this.first,
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
        this.numPages = Math.ceil(this.entryList.length / this.numResults);
        const encryptedTags: TagInterface[] = response.tags;
        const decryptedTags: TagInterface[] = await this.crypto.decryptTags(
          encryptedTags
        );
        this.tagList = this.cms.getTags(decryptedTags);
        this.calendar().generateCalendar(response.calendar);
        this.first = false;
      }
    } catch (error) {
      console.error("Error al cargar las entradas:", error);
    } finally {
      this.loading.set(false);
    }
  }

  paginateResults(): Entry[] {
    const start: number = (this.page - 1) * this.numResults;
    const end: number = start + this.numResults;
    return this.entryList.slice(start, end);
  }

  previousPage(): void {
    if (this.page === 1) {
      return;
    }
    this.page--;
  }

  nextPage(): void {
    if (this.page + 1 > this.numPages) {
      return;
    }
    this.page++;
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

  collapseFilters(): void {
    this.filtersCollapsed.update((value: boolean): boolean => !value);
  }
}
