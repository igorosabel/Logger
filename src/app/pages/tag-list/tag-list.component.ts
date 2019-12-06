import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { ApiService }         from '../../services/api.service';
import { ClassMapperService } from '../../services/class-mapper.service';
import { DataShareService }   from '../../services/data-share.service';
import { Tag }                from '../../model/tag.model';
import { Entry }              from '../../model/entry.model';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: []
})
export class TagListComponent implements OnInit {
	loading: boolean = true;
	username: string;
	idTag: number;
	tag: Tag;
	entryList: Entry[];

	constructor(private activatedRoute: ActivatedRoute, private router: Router, private dss: DataShareService, private as: ApiService, private cms: ClassMapperService) {
		this.tag = new Tag();
		this.entryList = [];
	}

	ngOnInit() {
		this.activatedRoute.params.subscribe((params: Params) => {
			this.username = params.username;
			this.idTag    = params.id;
			this.loadEntries();
		});
	}
	
	loadEntries() {
		this.as.getTagEntries(this.idTag).subscribe(response => {
			if (response.status=='ok') {
				this.tag = this.cms.getTag(response.tag);
				this.entryList = this.cms.getEntries(response);
				this.loading = false;
			}
		});
	}
	
	goBack() {
		const whereTo = this.dss.getGlobal('where');
		switch(whereTo) {
			case 'home': {
				this.router.navigate(['/', this.username]);
			}
			break;
			case 'entry': {
				const entryId = this.dss.getGlobal('entryId');
				const entrySlug = this.dss.getGlobal('entrySlug');
				this.router.navigate(['/', this.username, entryId, entrySlug]);
			}
			break;
			case 'tags': {
				this.router.navigate(['/', this.username, 'tags']);
			}
			break;
		}
	}
}