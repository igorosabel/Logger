import { Component, InputSignal, input } from "@angular/core";
import { MatListModule } from "@angular/material/list";
import { RouterModule } from "@angular/router";
import { Entry } from "@model/entry.model";
import { EntryTagListComponent } from "@shared/components/entry-tag-list/entry-tag-list.component";
import { ShortTextPipe } from "@shared/pipes/shorttext.pipe";

@Component({
  standalone: true,
  selector: "app-one-entry",
  templateUrl: "./one-entry.component.html",
  imports: [RouterModule, EntryTagListComponent, ShortTextPipe, MatListModule],
})
export class OneEntryComponent {
  entry: InputSignal<Entry> = input.required<Entry>();
}
