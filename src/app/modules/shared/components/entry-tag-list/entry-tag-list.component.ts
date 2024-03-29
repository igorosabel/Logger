import { Component, InputSignal, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { Router } from "@angular/router";
import { Tag } from "@model/tag.model";

@Component({
  standalone: true,
  selector: "app-entry-tag-list",
  templateUrl: "./entry-tag-list.component.html",
  styleUrls: ["./entry-tag-list.component.scss"],
  imports: [MatButtonModule],
})
export class EntryTagListComponent {
  tags: InputSignal<Tag[]> = input.required<Tag[]>();

  constructor(private router: Router) {}

  goToTag(tag: Tag, ev: MouseEvent): void {
    ev.stopPropagation();
    ev.preventDefault();
    this.router.navigate(["/tag", tag.id]);
  }
}
