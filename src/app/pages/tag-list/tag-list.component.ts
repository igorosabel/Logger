import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { ApiService }         from '../../services/api.service';
import { ClassMapperService } from '../../services/class-mapper.service';
import { Entry }              from '../../model/entry.model';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss']
})
export class TagListComponent implements OnInit {
	username: string;
	idTag: number;
	entryList: Entry[];

	constructor(private activatedRoute: ActivatedRoute, private router: Router, private as: ApiService, private cms: ClassMapperService) {
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
				this.entryList = this.cms.getEntries(response);
			}
		});
	}
}