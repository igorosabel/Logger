import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { ApiService }        from '../../services/api.service';
import { Entry }             from '../../model/entry.model';
import { Tag }               from '../../model/tag.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
	username: string;
	entryList: Entry[];

	constructor(private activatedRoute: ActivatedRoute, private as: ApiService) {
		this.entryList = [];
	}

	ngOnInit() {
		this.activatedRoute.params.subscribe((params: Params) => {
			this.username = params.username;
			this.loadEntries();
		});
	}
	
	loadEntries() {
		this.as.getEntries().subscribe(response => {
			if (response.status=='ok') {
				for (let e of response.list) {
					let entry = new Entry(e.id, e.title, e.slug, e.body, e.createdAt, e.updatedAt);
					for (let t of e.tags) {
						let tag = new Tag(t.id, t.name, t.slug, t.createdAt, t.updatedAt);
						entry.addTag(tag);
					}
					this.entryList.push(entry);
				}
			}
		});
	}
}