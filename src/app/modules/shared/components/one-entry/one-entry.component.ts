import { Component, Input } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Entry } from "src/app/model/entry.model";
import { MaterialModule } from "src/app/modules/material/material.module";
import { EntryTagListComponent } from "src/app/modules/shared/components/entry-tag-list/entry-tag-list.component";
import { ShortTextPipe } from "src/app/modules/shared/pipes/shorttext.pipe";

@Component({
  standalone: true,
  selector: "app-one-entry",
  templateUrl: "./one-entry.component.html",
  imports: [RouterModule, MaterialModule, EntryTagListComponent, ShortTextPipe],
})
export class OneEntryComponent {
  @Input() username: string;
  @Input() entry: Entry;
}
