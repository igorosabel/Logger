import { Component, Input } from "@angular/core";
import { MatListModule } from "@angular/material/list";
import { RouterModule } from "@angular/router";
import { Entry } from "src/app/model/entry.model";
import { EntryTagListComponent } from "src/app/modules/shared/components/entry-tag-list/entry-tag-list.component";
import { ShortTextPipe } from "src/app/modules/shared/pipes/shorttext.pipe";

@Component({
  standalone: true,
  selector: "app-one-entry",
  templateUrl: "./one-entry.component.html",
  imports: [RouterModule, EntryTagListComponent, ShortTextPipe, MatListModule],
})
export class OneEntryComponent {
  @Input() entry: Entry;
}
