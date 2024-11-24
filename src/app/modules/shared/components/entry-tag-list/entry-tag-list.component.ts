import { Component, InputSignal, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import Tag from '@model/tag.model';

@Component({
  selector: 'app-entry-tag-list',
  templateUrl: './entry-tag-list.component.html',
  styleUrls: ['./entry-tag-list.component.scss'],
  imports: [MatButtonModule],
})
export default class EntryTagListComponent {
  private router: Router = inject(Router);

  tags: InputSignal<Tag[]> = input.required<Tag[]>();

  goToTag(tag: Tag, ev: MouseEvent): void {
    ev.stopPropagation();
    ev.preventDefault();
    this.router.navigate(['/tag', tag.id]);
  }
}
