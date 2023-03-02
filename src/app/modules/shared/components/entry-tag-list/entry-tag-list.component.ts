import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { Tag } from "src/app/model/tag.model";
import { MaterialModule } from "src/app/modules/material/material.module";

@Component({
  standalone: true,
  selector: "app-entry-tag-list",
  templateUrl: "./entry-tag-list.component.html",
  styleUrls: ["./entry-tag-list.component.scss"],
  imports: [CommonModule, MaterialModule],
})
export class EntryTagListComponent {
  @Input() username: string;
  @Input() tags: Tag[];

  constructor(private router: Router) {}

  goToTag(tag: Tag, ev: MouseEvent): void {
    ev.stopPropagation();
    ev.preventDefault();
    this.router.navigate(["/", this.username, "tag", tag.id, tag.slug]);
  }
}
