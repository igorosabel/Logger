import { Component, Input } from '@angular/core';
import { Router }           from '@angular/router';
import { Tag }              from '../../model/tag.model';

@Component({
  selector: 'app-entry-tag-list',
  templateUrl: './entry-tag-list.component.html',
  styleUrls: ['./entry-tag-list.component.scss']
})
export class EntryTagListComponent {
	@Input() username : string;
	@Input() tags : Tag[];

	constructor(private router: Router) {}
	
	goToTag(tag: Tag, ev) {
		ev.stopPropagation();
		ev.preventDefault();
		this.router.navigate(['/', this.username, 'tag', tag.id, tag.slug]);
	}
}